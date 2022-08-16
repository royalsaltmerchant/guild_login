import { Request, Response, NextFunction } from 'express'
import {User, Contribution, ContributedAsset} from '../../types/dbTypes'
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const mail = require('../smtp/index')
const {
  getUserByIdQuery,
  getAllUsersQuery,
  getUserByUsernameQuery,
  getUserByEmailQuery,
  registerUserQuery,
  editUserQuery,
  editUserPasswordQuery
} = require('../queries/users')
const {
  getContributionsByUserIdQuery,
  getAllContributionsQuery
} = require('../queries/contributions')
const {
  getAllContributedAssetsQuery
} = require('../queries/contributedAssets')

function generateAccessToken(id: number, expires: string): string {
  return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: expires });
}

function sendResetEmail(user: User, token: string) {
  mail.sendMessage({
    user: user,
    title: "Reset Password",
    message: `Visit the following link to reset your password: <a href="https://app.sfaudioguild.com/reset_password/${token}">Reset Password</a>`
  })
}

async function verifyUserByToken(token: string): Promise<{rows: User[]}> {
  return jwt.verify(token, process.env.SECRET_KEY, async (err: any, user: User) => {
    if(err) return null

    const userData = await getUserByIdQuery(user.id)

    if(userData.rows.length === 0) return null

    return userData
  })
}

async function getUserByToken(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers['x-access-token'] ? (req.headers['x-access-token'] as string).split(' ')[1] : null
    if(token) {
      const userData = await verifyUserByToken(token)

      if(!userData) return res.status(400).json({message: "Cannot get user by token"})

      const contributionData = await getContributionsByUserIdQuery(userData.rows[0].id)

      const contributedAssetData = await getAllContributedAssetsQuery()

      for(var contribution of contributionData.rows) {
        contribution.contributed_assets = contributedAssetData.rows.filter((asset: ContributedAsset) => asset.contribution_id === contribution.id)
      }

      const data = userData.rows[0]
      data.contributions = contributionData.rows
  
      res.send(data)
    } else return res.status(400).json({message: "No token sent in headers"})
  } catch(err) {
    next(err)
  }
}

async function getAllUsers(req:Request, res:Response, next:NextFunction) {
  try {
    const usersData = await getAllUsersQuery()

    const contributionsData = await getAllContributionsQuery()

    const data: Array<User> = []
    usersData.rows.forEach((user: User) => {
      user.contributions = contributionsData.rows.filter((contribution: Contribution) => contribution.user_id === user.id)
      data.push(user)
    })

    res.send(data)
  } catch(err) {
    next(err)
  }
}

async function getUserById(req:Request, res:Response, next:NextFunction) {
  try {
    const userData = await getUserByIdQuery(req.body.id)

    const contributionData = await getContributionsByUserIdQuery(userData.rows[0].id)

    const data = userData.rows[0]
    data.contributions = contributionData.rows

    res.send(data)
  } catch(err) {
    next(err)
  }
}

async function getUserByUsername(req:Request, res:Response, next:NextFunction) {
  try {
    const userData = await getUserByUsernameQuery(req.body.username)

    const contributionData = await getContributionsByUserIdQuery(userData.rows[0].id)

    const data = userData.rows[0]
    data.contributions = contributionData.rows

    res.send(data)
  } catch(err) {
    next(err)
  }
}

async function registerUser(req:Request, res:Response, next:NextFunction) {
  try {
    const {username, email, first_name, last_name, password} = req.body
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = await registerUserQuery({
      username,
      email: email.toLowerCase(),
      first_name: first_name.toLowerCase(),
      last_name: last_name.toLowerCase(),
      password: hashedPassword
    })
    const data = userData.rows[0]

    res.status(201).json(data)
  } catch(err) {
    next(err)
  }
}

async function loginUser(req:Request, res:Response, next:NextFunction) {
  try {
    const username = req.body.username_or_email
    const email = req.body.username_or_email.toLowerCase()
    const password = req.body.password
    let user;

    const userNameData = await getUserByUsernameQuery(username)

    if(userNameData.rows.length !== 0) {
      user = userNameData.rows[0]
    } else {
      const userEmailData = await getUserByEmailQuery(email)

      if(userEmailData.rows.length !== 0) {
        user = userEmailData.rows[0]
      } else return res.status(400).json({message: "Incorrect, Account, Information"})
    }

    if(user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if(validPassword) {
        const token = generateAccessToken(user.id, '30d')
        res.send({token: token})
      } else return res.status(400).json({message: "Invalid Password"})
    }

  } catch(err) {
    next(err)
  }
}

async function verifyJwt(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers['x-access-token'] ? (req.headers['x-access-token'] as string).split(' ')[1] : null
    if(token) {
      const userData = verifyUserByToken(token)

      if(!userData) return res.status(400).json({message: "Can't find user by token"})

      res.send({message: "Token validated"})
    } else return res.status(400).json({message: "No token sent in headers"})
  } catch(err) {
    next(err)
  }
}

async function editUser(req:Request, res:Response, next:NextFunction) {
  try {
    if(req.body.coins) {
      const userData = await getUserByIdQuery(req.body.user_id)
      const coins = userData.rows[0].coins
      req.body.coins += coins
    }
    if(req.body.approved_asset_count) {
      const userData = await getUserByIdQuery(req.body.user_id)
      const approvedAssetCount = userData.rows[0].approved_asset_count
      req.body.approved_asset_count += approvedAssetCount
    }
    const userEditData = await editUserQuery(req.body)
    res.send(userEditData.rows[0])

  } catch(err) {
    next(err)
  }
}

async function resetPassword(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.body.token
    const password = req.body.password

    const userData = await verifyUserByToken(token)
    if(userData) {
      // hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await editUserPasswordQuery(userData.rows[0].id, hashedPassword)
      res.send({message: `Reset password success for user: ${user.rows[0].id}`})
    } else res.status(400).json({message: "Invalid Token"})

  } catch(err) {
    next(err)
  }
}

async function requestResetEmail(req:Request, res:Response, next:NextFunction) {
  try {
    const userData = await getUserByEmailQuery(req.body.email.toLowerCase())

    if(userData.rows.length !== 0) {
      const user = userData.rows[0]

      const token = generateAccessToken(user.id, '30m')

      sendResetEmail(userData.rows[0], token)

      res.send({message: 'Email has been sent'})
    } else return res.status(400).json({message: 'No user found by this email'})

  } catch(err) {
    next(err)
  }
}

export {
  getUserByToken,
  getAllUsers,
  getUserById,
  getUserByUsername,
  registerUser,
  loginUser,
  verifyJwt,
  editUser,
  resetPassword,
  requestResetEmail
}
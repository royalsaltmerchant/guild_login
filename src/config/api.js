import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: `api/login`,
      data: {
        email: email,
        password: password
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const authenticate = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/verify_jwt',
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

export {
  login,
  authenticate
}
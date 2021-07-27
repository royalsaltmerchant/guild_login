import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (username_or_email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/login`,
      data: {
        username_or_email: username_or_email,
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
      url: `${config.apiURL}/api/verify_jwt`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getUser = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: `${config.apiURL}/api/get_user`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getUsers = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: `${config.apiURL}/api/users`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const registerUser= async (username, firstName, lastName, email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/register`,

      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        admin: false
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editUser= async (userId, approvedAssetCount, coins, eligible) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_user`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        user_id: userId,
        approvedAssetCount: approvedAssetCount,
        coins: coins,
        eligible: eligible,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getProjects = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: `${config.apiURL}/api/projects`,
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getProject = async (projectId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/get_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: projectId
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const createProject = async (title, description, image) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        title: title,
        description: description,
        image_file: image
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editProject = async (projectId, title, description, active, complete) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: projectId,
        title: title,
        description: description,
        active: active,
        complete: complete

      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const deleteProject = async (projectId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/remove_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: projectId,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getEntry = async (entryId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/get_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entryId
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const createEntry = async (projectId, amount, title, description) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: projectId,
        amount: amount,
        title: title,
        description: description,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editEntry = async (entryId, amount, title, description, complete) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entryId,
        amount: amount,
        title: title,
        description: description,
        complete: complete

      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const deleteEntry = async (entryId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/remove_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entryId,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const createContribution = async (entryId, projectId, amount) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entryId,
        project_id: projectId,
        amount: amount,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editContribution = async (contributionId, amount, status) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        contribution_id: contributionId,
        amount: amount,
        status: status,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const deleteContribution = async (contributionId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/remove_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        contribution_id: contributionId,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getPresignedURL = async (bucketName, objectName) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/signed_URL`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        bucket_name: bucketName,
        object_name: objectName
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getPacks = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: `${config.apiURL}/api/packs`,
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getPack = async (packTitle) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/get_pack_by_title`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_title: packTitle
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const createPack = async (title, description, image, video, coinCost) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        title: title,
        description: description,
        image_file: image,
        video_file: video,
        coin_cost: coinCost
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editPack = async (packId, title, description, image, video, coinCost, active) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_id: packId,
        title: title,
        description: description,
        image_file: image,
        video_file: video,
        coin_cost: coinCost,
        active: active
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const deletePack = async (packId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/remove_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_id: packId,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const createAssetType = async (packId, description) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_id: packId,
        description: description
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editAssetType = async (assetTypeId, description) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        asset_type_id: assetTypeId,
        description: description
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const deleteAssetType = async (assetTypeId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/remove_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        asset_type_id: assetTypeId,
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

export {
  login,
  authenticate,
  getUser,
  getUsers,
  registerUser,
  editUser,
  getProject,
  getProjects,
  createProject,
  editProject,
  deleteProject,
  createEntry,
  getEntry,
  editEntry,
  deleteEntry,
  createContribution,
  editContribution,
  deleteContribution,
  getPresignedURL,
  getPacks,
  getPack,
  createPack,
  editPack,
  deletePack,
  createAssetType,
  editAssetType,
  deleteAssetType
}
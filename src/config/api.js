import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/login`,
      data: params
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

const registerUser= async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/register`,
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editUser= async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_user`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createProject = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editProject = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createEntry = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editEntry = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createContribution = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editContribution = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createContributedAsset = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_contributed_asset`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getPresignedURL = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/signed_URL`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createPack = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editPack = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const createAssetType = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editAssetType = async (params) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: params
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

const requestResetEmail = async (email) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/request_reset_email`,
      data: {
        email: email
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const resetPassword = async (password, token) => {
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/reset_password`,
      data: {
        password: password,
        token: token
      },
      validateStatus: (status) => status === 200 || status === 400
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
  createContributedAsset,
  getPresignedURL,
  getPacks,
  getPack,
  createPack,
  editPack,
  deletePack,
  createAssetType,
  editAssetType,
  deleteAssetType,
  requestResetEmail,
  resetPassword
}
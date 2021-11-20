import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/login`,
    data: params
  })
  return res
}

const authenticate = async () => {
  const res = await axios({
    method: 'get',
    url: `${config.apiURL}/api/verify_jwt`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    }
  })
  return res
}

const getUser = async () => {
  const res = await axios({
    method: 'get',
    url: `${config.apiURL}/api/get_user`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    }
  })
  return res
}

const getUsers = async () => {
  const res = await axios({
    method: 'get',
    url: `${config.apiURL}/api/users`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    }
  })
  return res
}

const registerUser= async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/register`,
    data: params
  })
  return res
}

const editUser= async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_user`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const getProjects = async () => {
  const res = await axios({
    method: 'get',
    url: `${config.apiURL}/api/projects`,
  })
  return res
}

const getProject = async (projectId) => {
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
}

const createProject = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_project`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const editProject = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_project`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const deleteProject = async (projectId) => {
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
}

const getEntry = async (entryId) => {
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
}

const createEntry = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_entry`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const editEntry = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_entry`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const deleteEntry = async (entryId) => {
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
}

const createContribution = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_contribution`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const editContribution = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_contribution`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const deleteContribution = async (contributionId) => {
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
}

const createContributedAsset = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_contributed_asset`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const getPresignedURL = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/signed_URL`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const getPacks = async () => {
  const res = await axios({
    method: 'get',
    url: `${config.apiURL}/api/packs`,
  })
  return res
}

const getPack = async (packTitle) => {
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
}

const createPack = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_pack`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const editPack = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_pack`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const deletePack = async (packId) => {
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
}

const createAssetType = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/add_asset_type`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const editAssetType = async (params) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/edit_asset_type`,
    headers: {
      "x-access-token": localStorage.getItem("token")
    },
    data: params
  })
  return res
}

const deleteAssetType = async (assetTypeId) => {
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
}

const requestResetEmail = async (email) => {
  const res = await axios({
    method: 'post',
    url: `${config.apiURL}/api/request_reset_email`,
    data: {
      email: email
    }
  })
  return res
}

const resetPassword = async (password, token) => {
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
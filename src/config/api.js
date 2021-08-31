import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (params) => {
  const {username_or_email, password} = params
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

const registerUser= async (params) => {
  const {username, first_name, last_name, email, password} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/register`,
      data: {
        username: username,
        first_name: first_name,
        last_name: last_name,
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

const editUser= async (params) => {
  const {user_id, approved_asset_count, coins} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_user`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        user_id: user_id,
        approved_asset_count: approved_asset_count,
        coins: coins
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

const createProject = async (params) => {
  const {title, description, image} = params
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

const editProject = async (params) => {
  const {project_id, title, description, image_file, active, complete} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_project`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: project_id,
        title: title,
        description: description,
        image_file: image_file,
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

const createEntry = async (params) => {
  const {project_id, amount, title, description} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        project_id: project_id,
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

const editEntry = async (params) => {
  const {entry_id, amount, title, description, complete} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_entry`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entry_id,
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

const createContribution = async (params) => {
  const {entry_id, project_id, amount} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        entry_id: entry_id,
        project_id: project_id,
        amount: amount
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editContribution = async (params) => {
  const {contribution_id, amount, status} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_contribution`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        contribution_id: contribution_id,
        amount: amount,
        status: status
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

const createContributedAsset = async (params) => {
  const {contribution_id, name} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_contributed_asset`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        contribution_id: contribution_id,
        name: name
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const getPresignedURL = async (params) => {
  const {bucket_name, object_name} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/signed_URL`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        bucket_name: bucket_name,
        object_name: object_name
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

const createPack = async (params) => {
  const {title, description, image_file, video_file, coin_cost} = params
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
        image_file: image_file,
        video_file: video_file,
        coin_cost: coin_cost
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editPack = async (params) => {
  const {pack_id, title, description, image_file, video_file, coin_cost, active, downloads} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_pack`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_id: pack_id,
        title: title,
        description: description,
        image_file: image_file,
        video_file: video_file,
        coin_cost: coin_cost,
        active: active,
        downloads: downloads
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

const createAssetType = async (params) => {
  const {pack_id, description} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/add_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        pack_id: pack_id,
        description: description
      }
    })
    return res
  } catch(err) {
    throw(err)
  }
}

const editAssetType = async (params) => {
  const {asset_type_id, description} = params
  try {
    const res = await axios({
      method: 'post',
      url: `${config.apiURL}/api/edit_asset_type`,
      headers: {
        "x-access-token": localStorage.getItem("token")
      },
      data: {
        asset_type_id: asset_type_id,
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
  createContributedAsset,
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
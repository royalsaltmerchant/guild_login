import {finalConfig as config} from './config'
import axios from 'axios'

const login = async (username_or_email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: `api/login`,
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

const getUser = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/get_user',
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
      url: '/api/users',
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
      url: '/api/projects',
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
      url: '/api/get_project',
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
      url: '/api/add_project',
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
      url: '/api/edit_project',
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
      url: '/api/remove_project',
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
      url: '/api/get_entry',
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
      url: '/api/add_entry',
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
      url: '/api/edit_entry',
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
      url: '/api/remove_entry',
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

const editContribution = async (contributionId, amount, status) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/edit_contribution',
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
      url: '/api/remove_contribution',
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

export {
  login,
  authenticate,
  getUser,
  getUsers,
  getProject,
  getProjects,
  createProject,
  editProject,
  deleteProject,
  createEntry,
  getEntry,
  editEntry,
  deleteEntry,
  editContribution,
  deleteContribution
}
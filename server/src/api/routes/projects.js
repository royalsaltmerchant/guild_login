const express = require('express')
const {
  getAllProjects,
  getProjectById,
  addProject,
  editProject,
  removeProject
} = require('../controllers/projects')

var router = express.Router()

router.get('/projects', getAllProjects)
router.post('/get_project', getProjectById)
router.post('/add_project', addProject)
router.post('/edit_project', editProject)
router.post('/remove_project', removeProject)

module.exports = router
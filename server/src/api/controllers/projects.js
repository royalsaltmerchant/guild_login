const {
  getAllProjectsQuery,
  getProjectByIdQuery,
  addProjectQuery,
  editProjectQuery,
  removeProjectQuery
} = require('../queries/projects')
const { 
  getAllEntriesQuery
 } = require('../queries/entries')
const { 
  getAllContributionsQuery
} = require('../queries/contributions')

async function getAllProjects(req, res, next) {
  try {
    const projectData = await getAllProjectsQuery()

    const entryData = await getAllEntriesQuery()

    const contributionData = await getAllContributionsQuery()

    for(var project of projectData.rows) {
      project['entries'] = entryData.rows.filter(entry => entry.project_id === project.id)
    }

    for(var project of projectData.rows) {
      for(var entry of project['entries']) {
        entry.contributions = contributionData.rows.filter(contribution => contribution.entry_id === entry.id)
      }
    }


    res.send(projectData.rows)
  } catch(err) {
    next(err)
  }
}

async function getProjectById(req, res, next) {
  try {
    const projectData = await getProjectByIdQuery(req.body.project_id)

    res.send(projectData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function addProject(req, res, next) {
  try {
    const projectData = await addProjectQuery(req.body)
    res.status(201).json(projectData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editProject(req, res, next) {
  try {
    const projectData = await editProjectQuery(req.body)
    res.send(projectData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function removeProject(req, res, next) {
  try {
    await removeProjectQuery(req.body.project_id)
    res.send({message: `Successfully removed project: ${req.body.project_id}`})
  } catch(err) {
    next(err)
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  addProject,
  editProject,
  removeProject
}
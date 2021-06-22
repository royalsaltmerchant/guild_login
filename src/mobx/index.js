import UserStore from './stores/UserStore'
import ProjectsStore from './stores/ProjectsStore'

const userStore = new UserStore()
const projectsStore = new ProjectsStore()

export default {
  userStore,
  projectsStore
}
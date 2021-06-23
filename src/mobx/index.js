import UserStore from './stores/UserStore'
import ProjectsStore from './stores/ProjectsStore'
import EntryStore from './stores/entryStore'

const userStore = new UserStore()
const projectsStore = new ProjectsStore()
const entryStore = new EntryStore()

export default {
  userStore,
  projectsStore,
  entryStore
}
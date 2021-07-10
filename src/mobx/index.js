import UserStore from './stores/UserStore'
import ProjectsStore from './stores/ProjectsStore'
import EntryStore from './stores/entryStore'
import PacksStore from './stores/PacksStore'

const userStore = new UserStore()
const projectsStore = new ProjectsStore()
const entryStore = new EntryStore()
const packsStore = new PacksStore()

export default {
  userStore,
  projectsStore,
  entryStore,
  packsStore
}
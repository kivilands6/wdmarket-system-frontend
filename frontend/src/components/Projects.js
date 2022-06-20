import React, {useState, useContext} from 'react'
import ProjectsKanban from './projects-kanban'
import NewProjectPopup from './Projects-components/NewProjectPopup'
import StateContext from '../StateContext'

function Projects() {
  //just some states
  const appState = useContext(StateContext)
  const [projectCreated, setProjectCreated] = useState(0)
  const [newProjectPopup, setNewProjectPopup] = useState(false)

  function toggleNewProjectPopup() { // for toggling new project popup
    setNewProjectPopup(!newProjectPopup)
  }

  return (
    <div>
      {appState.user.admin ? <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={toggleNewProjectPopup}>Add new project</button> : ""}
      <ProjectsKanban projectCreated={projectCreated} />
      {appState.user.admin ? <NewProjectPopup newProjectPopup={newProjectPopup} toggleNewProjectPopup={toggleNewProjectPopup} setProjectCreated={setProjectCreated} /> : ""}
    </div>
  )
}

export default Projects
import React, {useState} from 'react'
import ProjectsKanban from './projects-kanban'
import NewProjectPopup from './Projects-components/NewProjectPopup'

function Projects() {
  const [projectCreated, setProjectCreated] = useState(0)
  const [newProjectPopup, setNewProjectPopup] = useState(false)

  function toggleNewProjectPopup() {
    setNewProjectPopup(!newProjectPopup)
  }
  return (
    <div>
      <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={toggleNewProjectPopup}>Add new project</button>
      <ProjectsKanban projectCreated={projectCreated} />
      <NewProjectPopup newProjectPopup={newProjectPopup} toggleNewProjectPopup={toggleNewProjectPopup} setProjectCreated={setProjectCreated} />
    </div>
  )
}

export default Projects
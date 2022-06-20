import React, { useState } from 'react'
import Kanban from './task-kanban'
import NewTaskPopup from './Tasks-components/NewTaskPopup'

function Tasks() {
  const [taskCreated, setTaskCreated] = useState(0)
  const [newTaskPopup, setNewTaskPopup] = useState(false)

  function toggleNewTaskPopup() {
    setNewTaskPopup(!newTaskPopup)
  }
    
  return (
    <div>
      <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={toggleNewTaskPopup}>Add new task</button>
      <Kanban taskCreated={taskCreated} />
      <NewTaskPopup newTaskPopup={newTaskPopup} toggleNewTaskPopup={toggleNewTaskPopup} setTaskCreated={setTaskCreated} />
    </div>
  )
}

export default Tasks
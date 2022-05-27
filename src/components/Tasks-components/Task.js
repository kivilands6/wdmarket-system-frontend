import React, {useState} from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Popup from './Popup'

const Task = ( { task, index } ) => {
  const [isOpenTask, setIsOpenTask] = useState(false);
  
  const togglePopupOpen = () => {
      setIsOpenTask(true)
  }

  const togglePopupClose = () => {
    setIsOpenTask(false)
  }

  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          onClick={() => togglePopupOpen()}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? '0.5' : '1'
          }}
        >
          <div className="task-container bg-white rounded-xl p-4 mt-4">
            <div className="task-container-header flex justify-between">
              <h4 className="task-title">{task.title}</h4>
              <div className="task-priority">{task.priority}</div>
            </div>
            <div className="task-project text-[#B5B5B5]">{task.project}</div>
            <div className="task-container-body mt-7">
              <div className="task-body-head flex justify-between">
                <div className="task-progress-title">Task progress</div>
                <div className="progress-percent text-[#5932EA]">40%</div>
              </div>
              <div className="task-content text-[#5932EA]">#####-----------</div>
            </div>
            <div className="task-container-footer flex justify-between">
              <div className="task-users">users pic</div>
              <div className="task-comments text-[#B5B5B5]">comments</div>
            </div>
          </div>
          <Popup task={task} togglePopupClose={togglePopupClose} isOpenTask={isOpenTask} />
        </div>
      )}
    </Draggable>
  )
}

export default Task
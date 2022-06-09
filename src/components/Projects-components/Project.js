import React, {useState} from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Popup from './Popup'

const Project = ( { project, index, statuss } ) => {
  const [isOpenTask, setIsOpenTask] = useState(false);
  
  const togglePopupOpen = () => {
      setIsOpenTask(true)
  }

  const togglePopupClose = () => {
    setIsOpenTask(false)
  }

  return (
    <Draggable
      key={project._id}
      draggableId={project._id}
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
              <h4 className="task-title">{project.name}</h4>
              <div className="task-priority">{statuss}</div>
            </div>
            <div className="task-project text-[#B5B5B5]">{project.link}</div>
            <div className="task-container-body mt-7">
              <div className="task-body-head flex justify-between">
                <div className="project-price-label">Price:</div>
                <div className="progress-percent text-[#5932EA]">{project.price}$</div>
              </div>
              <div className="project-start-date flex justify-between">
                <div className="project-start-date-label">Start date:</div>
                <div className="project-start-date text-[#5932EA]">{project.startDate}</div>
              </div>
              <div className="project-end-date flex justify-between">
                <div className="project-end-date-label">Due date:</div>
                <div className="project-end-date text-[#5932EA]">{project.endDate}</div>
              </div>
            </div>
          </div>
          <Popup project={project} togglePopupClose={togglePopupClose} isOpenTask={isOpenTask} statuss={statuss} />
        </div>
      )}
    </Draggable>
  )
}

export default Project
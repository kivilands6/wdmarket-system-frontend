import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Popup from './Popup'

const TaskNotDraggable = ( { task, index, statuss, taskDelete, setTaskDelete } ) => {
  const [isOpenTask, setIsOpenTask] = useState(false);
  const [subtasks, setSubtasks] = useState([])
  const [subtaskStatusChange, setSubtaskStatusChange] = useState(0)
  
  const togglePopupOpen = () => {
      setIsOpenTask(true)
  }

  const togglePopupClose = () => {
    setIsOpenTask(false)
  }

  // fetch all subtasks
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function getSubtasks(){
        console.log(task.project)
        try{
            const response = await Axios.get('/all-subtasks', {cancelToken: ourRequest.token})
            console.log(response.data)
            setSubtasks(response.data.filter(subtask => task._id == subtask.taskId))
            
        }
        catch(e){
            console.log("There was a problem or the request was canceled!")
        }
    }
    getSubtasks()
    return () => {
        ourRequest.cancel()
    }
    }, [subtaskStatusChange])

    const subtaskCount = subtasks.filter(subtask => subtask.taskId == task._id ).length
    const subtaskDoneCount = subtasks.filter(subtask => subtask.taskId == task._id && subtask.value == true).length

    const progress = 100 / subtaskCount * subtaskDoneCount

  return (
        <div onClick={togglePopupOpen}>
          <div className="task-container bg-white rounded-xl p-4 mt-4">
            <div className="task-container-header flex justify-between">
              <h4 className="task-title">{task.title}</h4>
              <div className="task-statuss ml-2">{statuss}</div>
            </div>
            <div className="task-project text-[#B5B5B5]">{task.project}</div>
            {subtaskCount ? 
            <div className="task-container-body mt-4">
            <div className="task-body-head flex justify-between">
              <div className="task-progress-title">Task progress</div>
              <div className="progress-percent text-[#5932EA]">{Math.round(progress * 100) /100 + "%"}</div>
            </div>
            <div className="task-content text-[#5932EA] mt-2">
              <div className="progress-bar w-full h-[7px] bg-[#5932EA40] rounded-lg">
                  <div className="progress-bar-filled bg-[#5932EA] h-[7px] rounded-lg" style={{ width: progress + "%" }}></div>
              </div>
            </div>
          </div> : ""}
            <div className="task-container-footer flex justify-between mt-4">
              <div className="task-users">{task.assignee}</div>
              <div className="task-comments text-[#B5B5B5]">comments</div>
            </div>
          </div>
          <Popup task={task} 
          togglePopupClose={togglePopupClose} 
          isOpenTask={isOpenTask} 
          statuss={statuss} 
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          subtaskStatusChange={subtaskStatusChange}
          setSubtaskStatusChange={setSubtaskStatusChange}
          subtaskCount={subtaskCount}
          progress={progress}
          taskDelete={taskDelete}
          setTaskDelete={setTaskDelete}
          />
        </div>
  )
}

export default TaskNotDraggable
import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import Subtask from './Subtask'
import DispatchContext from '../../DispatchContext'

function Popup( {task, togglePopupClose, isOpenTask, statuss, subtasks, setSubtasks, subtaskStatusChange, setSubtaskStatusChange, subtaskCount, progress, setTaskDelete, taskDelete} ) {
    const appDispatch = useContext(DispatchContext)
    const [isAccessOpen, setIsAccessOpen] = useState(false)
    const [newSubtask, setNewSubtask] = useState("")

    const [editAccess, setEditAccess] = useState(false)
    const [accessCount, setAccessCount] = useState(0)
    const [access, setAccess] = useState("")

    const toggleAccess = () => {
        setIsAccessOpen(!isAccessOpen)
    }

    

    // get project access
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function getAccess(){
            console.log(task.project)
            try{
                const response = await Axios.post('/project-access',{
                    name: task.project,
                }, {cancelToken: ourRequest.token})
                const newAccess = (response.data[0].access)
                setAccess(newAccess)
                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        getAccess()
        return () => {
            ourRequest.cancel()
        }
    }, [accessCount])

    // change access when changed
    function handleAccessChange() {
        const ourRequest = Axios.CancelToken.source()
        console.log(task.project)
        async function updateAccess(){
            try{
                const response = await Axios.post('/project-access-update',{
                    name: task.project,
                    access: access
                }, {cancelToken: ourRequest.token})
                setAccessCount(accessCount + 1)
                console.log(accessCount)
                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        updateAccess()
        return () => {
            ourRequest.cancel()
        }
    }

    function handleNewSubtask() {
        if(newSubtask.length > 3) {
            const ourRequest = Axios.CancelToken.source()
            async function addNewSubtask(){
                try{
                    const response = await Axios.post('/create-subtask',{
                        content: newSubtask,
                        taskId: task._id
                    }, {cancelToken: ourRequest.token})
                    setSubtaskStatusChange(subtaskStatusChange + 1)
                    setNewSubtask("")
                    
                }
                catch(e){
                    console.log("There was a problem or the request was canceled!")
                }
            }
            addNewSubtask()
            return () => {
                ourRequest.cancel()
            }
        } else {
            // throw error
        }
    }

    function handleDeleteTask() {
        const confirmDelete = window.confirm("Do you really want to delete this task?")
        if(confirmDelete) {
            const ourRequest = Axios.CancelToken.source()
            async function deleteTask(){
                try{
                    const response = await Axios.post('/delete-task',{
                        id: task._id,
                    }, {cancelToken: ourRequest.token})
                    setTaskDelete(taskDelete + 1)
                    appDispatch({type: "flashMessage", value: "Task deleted successfully"})
                                  
                }
                catch(e){
                    console.log("There was a problem or the request was canceled!")
                }
            }
            deleteTask()
            return () => {
                ourRequest.cancel()
            }
        }
    }

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (isOpenTask ? "" : "hidden")} onClick={(e) => {e.stopPropagation()}}>
        <div className="popup-content relative w-3/4 my-0 mx-auto h-auto max-h-[70vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex" onClick={(e) => {e.stopPropagation()}}>

            <div className="task-left-column w-[70%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    {task.title}
                </h2>
                <div className="task-body mt-10">
                    <h2 className="description-label text-xl text-bold">Description:</h2>
                    <div className="task-description mt-4 bg-white p-5 rounded-lg shadow-sm">{task.content}</div>
                </div>
                <div className="body-subtasks mt-4 border-l-2 pl-6 py-3">
                    <h2 className="subtasks-label text-lg text-bold">Subtasks:</h2>
                    {subtaskCount ? 
                    <div className="progress-bar w-full h-[6px] bg-red-500 mt-2 rounded-lg">
                        <div className="progress-bar-filled bg-[#1BC00C] h-[6px] rounded-lg" style={{ width: progress + "%" }}></div>
                    </div> : ""}
                    <div className="checkbox-area my-3">
                        {subtasks.filter(subtask => subtask.taskId == task._id ).map((subtask, index) => ( 
                            <Subtask subtask={subtask} index={index} subtasks={subtasks} setSubtasks={setSubtasks} key={subtask._id} setSubtaskStatusChange={setSubtaskStatusChange} subtaskStatusChange={subtaskStatusChange} />
                        ))}
                    </div>
                    <div className="add-subtasks">
                        <input value={newSubtask} onChange={e => {
                            setNewSubtask(e.target.value)
                        }} id="new-subtask" name="subtask" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 focus:border-[#1BC00C]" type="text" placeholder="New subtask" autoComplete="off" />
                        <button className="py-3 mr-4 text-[#B5B5B5] rounded-xl" onClick={() => setNewSubtask("")}>Discard</button>
                        <button className="py-3 text-[#1BC00C] rounded-xl" onClick={handleNewSubtask}>Save subtask</button>
                    </div>
                </div>
            </div>

            <div className="task-right-column w-[30%] bg-white rounded-tr-xl rounded-br-xl">
                <div className="column-head p-8 pt-5 flex justify-end">
                <div className="access">
                        <button className="btn-close mr-3" onClick={(e) => {
                            e.stopPropagation()
                            toggleAccess()
                            }}>Access
                        </button>
                        <div className={"access-dropdown min-w-[300px] absolute p-3 shadow-lg flex justify-between border-gray-200 border right-12 top-16 bg-white rounded-lg max-w-[400px] " + (isAccessOpen ? "" : "hidden")}>
                            <div className="access-content mr-4">
                                {editAccess && 
                                    <input value={access} onChange={e => setAccess(e.target.value)} id="access" name="access" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" autoComplete="off" />
                                }
                                {!editAccess && 
                                    access
                                }
                            </div>
                            <div className="edit">
                                {editAccess && 
                                    <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={() => {
                                        setEditAccess(false)
                                        handleAccessChange()
                                    }}>Save</button>
                                }
                                {!editAccess && 
                                    <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={() => setEditAccess(true)}>Edit</button>
                                }
                                
                            </div>
                        </div>
                    </div>
                    <button className="btn-close" onClick={(e) => {
                        e.stopPropagation()
                        togglePopupClose()
                        setEditAccess(false)
                        setIsAccessOpen(false)
                        }}>x
                    </button>
                </div>
                <div className="column-content p-8 pt-0">
                    <div className="task-project justify-between flex items-center">
                        <div className="project-label mr-10">Project:</div>
                        <div className="project-name border rounded-lg border-[#E2E2E2] px-6 py-1 w-full text-center">{task.project}</div>
                    </div>
                    <div className="task-priority justify-between flex items-center mt-3">
                        <div className="priority-label mr-10">Statuss:</div>
                        <div className="project-name border rounded-lg border-[#E2E2E2] px-6 py-1 w-full text-center">{statuss}</div>
                    </div>
                </div>
                <div className="delete-task">
                    <button className="py-3 px-7 mb-10 bg-red-500 text-white rounded-xl absolute bottom-0 right-8" onClick={handleDeleteTask}>Delete task</button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Popup
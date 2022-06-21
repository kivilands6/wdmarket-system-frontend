import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import Subtask from './Subtask'
import DispatchContext from '../../DispatchContext'
import Description from './Description'
import Comments from './Comments'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

function Popup( {task, togglePopupClose, isOpenTask, statuss, subtasks, setSubtasks, subtaskStatusChange, setSubtaskStatusChange, subtaskCount, progress, setTaskDelete, taskDelete} ) {
    const appDispatch = useContext(DispatchContext)
    const [isAccessOpen, setIsAccessOpen] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
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
        <div className="popup-content relative w-3/4 my-0 mx-auto h-auto bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex" onClick={(e) => {e.stopPropagation()}}>

            <div className="task-left-column w-[70%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    {task.title}
                </h2>
                <div className="task-body mt-10">
                    <div className="switch-buttons flex mb-6">
                        <buttton className="description mr-4" onClick={() => setCommentsOpen(false)}>Description</buttton>
                        <buttton className="comments" onClick={() => setCommentsOpen(true)}>Comments</buttton>
                    </div>
                    {commentsOpen ? <Comments task={task} /> : <Description task={task} subtasks={subtasks} setSubtasks={setSubtasks} progress={progress} subtaskCount={subtaskCount} newSubtask={newSubtask} setNewSubtask={setNewSubtask} handleNewSubtask={handleNewSubtask} setSubtaskStatusChange={setSubtaskStatusChange} subtaskStatusChange={subtaskStatusChange} />}
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
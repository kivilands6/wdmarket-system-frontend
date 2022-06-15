import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import DispatchContext from '../../DispatchContext'

function Popup( {project, togglePopupClose, isOpenTask, statuss, projectDelete, setProjectDelete} ) {
    const appDispatch = useContext(DispatchContext)
    const [isAccessOpen, setIsAccessOpen] = useState(false)
    const [editAccess, setEditAccess] = useState(false)
    const [access, setAccess] = useState("")

    const toggleAccess = () => {
        setIsAccessOpen(!isAccessOpen)
    }

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function getAccess(){
            console.log(project.name)
            try{
                const response = await Axios.post('http://localhost:8000/project-access',{
                    name: project.name,
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
    }, [])

    function handleAccessChange() {
        const ourRequest = Axios.CancelToken.source()
        console.log(project.name)
        async function updateAccess(){
            try{
                const response = await Axios.post('http://localhost:8000/project-access-update',{
                    name: project.name,
                    access: access
                }, {cancelToken: ourRequest.token})
                console.log(response)
                
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

    function handleDeleteProject() {
        const confirmDelete = window.confirm("Do you really want to delete this project?")
        if(confirmDelete) {
            const ourRequest = Axios.CancelToken.source()
            async function deleteProject(){
                try{
                    const response = await Axios.post('http://localhost:8000/delete-project',{
                        projectId: project._id,
                    }, {cancelToken: ourRequest.token})
                    setProjectDelete(projectDelete + 1)
                    appDispatch({type: "flashMessage", value: "Project deleted successfully"})
                                  
                }
                catch(e){
                    console.log("There was a problem or the request was canceled!")
                }
            }
            deleteProject()
            return () => {
                ourRequest.cancel()
            }
        }
    }

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (isOpenTask ? "" : "hidden")} onClick={(e) => {e.stopPropagation()}}>
        <div className="popup-content relative w-3/4 my-0 mx-auto h-auto max-h-[70vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[70%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    {project.name}
                </h2>
                <h3 className="text-[#9197B3] mt-2">
                    {project.link}
                </h3>
                <div className="task-body mt-10">
                    <h2 className="description-label text-xl text-bold">Description:</h2>
                    <div className="task-description mt-4 bg-white p-5 rounded-lg shadow-sm">{project.content}</div>
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
                        toggleAccess()
                        }}>x
                    </button>
                </div>
                <div className="column-content p-8 pt-0">
                    <div className="project-price justify-between flex items-center">
                        <div className="price-label mr-2">Price:</div>
                        <div className="price border rounded-lg border-[#E2E2E2] px-6 py-1 w-3/5 text-center">{project.price}$</div>
                    </div>
                    <div className="project-priority justify-between flex items-center mt-3">
                        <div className="priority-label mr-2 w-fit">Statuss:</div>
                        <div className="project-name border rounded-lg border-[#E2E2E2] px-6 py-1 w-3/5 text-center">{statuss}</div>
                    </div>
                    <div className="project-start-date justify-between flex items-center mt-3">
                        <div className="start-date-label mr-2 w-fit">Start date:</div>
                        <div className="start-date-value border rounded-lg border-[#E2E2E2] px-6 py-1 w-3/5 text-center">{project.startDate}</div>
                    </div>
                    <div className="project-end-date justify-between flex items-center mt-3">
                        <div className="end-date-label mr-2 w-fit">Due date:</div>
                        <div className="end-date-value border rounded-lg border-[#E2E2E2] px-6 py-1 w-3/5 text-center">{project.endDate}</div>
                    </div>
                </div>
                <div className="delete-project">
                    <button className="py-3 px-7 mb-10 bg-red-500 text-white rounded-xl absolute bottom-0 right-8" onClick={handleDeleteProject}>Delete project</button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Popup
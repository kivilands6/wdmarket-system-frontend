import React, {useState} from 'react'

function Popup( {task, togglePopupClose, isOpenTask} ) {
    const [isAccessOpen, setIsAccessOpen] = useState(false)

    const toggleAccess = () => {
        setIsAccessOpen(!isAccessOpen)
    }

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (isOpenTask ? "" : "hidden")} onClick={(e) => {e.stopPropagation()}}>
        <div className="popup-content relative w-3/4 my-0 mx-auto h-auto max-h-[70vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[70%] py-8 pt-5 px-16">
                <h2 className="task-title">
                    {task.title}
                </h2>
                <div className="task-body mt-10">
                    <h2 className="description-label">Description:</h2>
                    <div className="task-description mt-4 bg-white p-5 rounded-lg shadow-sm">{task.content}</div>
                </div>
                <div className="body-subtasks mt-4 border-l-2 pl-6 py-3">
                    <h2 className="subtasks-label">Subtasks:</h2>
                    <div className="checkbox-area mt-3">
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                        <label for="vehicle1"> I have a bike</label><br/>
                        <input type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
                        <label for="vehicle2"> I have a car</label><br/>
                        <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat" />
                        <label for="vehicle3"> I have a boat</label><br/>
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
                        <div className={"access-dropdown min-w-[300px] absolute p-3 shadow-lg border-gray-200 border right-12 top-16 bg-white rounded-lg max-w-[400px] " + (isAccessOpen ? "" : "hidden")}>
                            <div className="access-content">
                                amarina link lorem ipsum text to see how this scales and some more extra text, and also this should be toggleable
                            </div>
                        </div>
                    </div>
                    <button className="btn-close" onClick={(e) => {
                        e.stopPropagation()
                        togglePopupClose()
                        }}>x
                    </button>
                </div>
                <div className="column-content p-8 pt-0">
                    <div className="task-project justify-between flex items-center">
                        <div className="project-label mr-10">Project:</div>
                        <div className="project-name border rounded-lg border-[#E2E2E2] px-6 py-1 w-full text-center">{task.project}</div>
                    </div>
                    <div className="task-priority justify-between flex items-center mt-3">
                        <div className="priority-label mr-10">Priority:</div>
                        <div className="project-name border rounded-lg border-[#E2E2E2] px-6 py-1 w-full text-center">{task.priority}</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Popup
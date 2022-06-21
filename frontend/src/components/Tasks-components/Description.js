import React from 'react'
import Subtask from './Subtask'

function Description( { task, subtasks, setSubtasks, progress, subtaskCount, newSubtask, setNewSubtask, handleNewSubtask,  setSubtaskStatusChange, subtaskStatusChange} ) {
  return (
    <div>
        <h2 className="description-label text-xl text-bold">Description:</h2>
        <div className="task-description mt-4 bg-white p-5 rounded-lg shadow-sm">{task.content}</div>
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
  )
}

export default Description
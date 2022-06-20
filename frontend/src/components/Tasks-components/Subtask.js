import React from 'react'
import Axios from "axios"
import deleteIcon from '../../img/delete.png'

function Subtask({subtask, index, subtasks, setSubtasks, setSubtaskStatusChange, subtaskStatusChange}) {
    function handleCheckboxChange() {
        console.log(subtasks)
        subtasks[index].value = !subtasks[index].value
        console.log(subtask.value)
        const ourRequest = Axios.CancelToken.source()
        async function updateValue(){
            try{
                const response = await Axios.post('/subtask-value-update',{
                    id: subtask._id,
                    value: subtask.value
                }, {cancelToken: ourRequest.token})
                setSubtaskStatusChange(subtaskStatusChange + 1)
                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        updateValue()
        return () => {
            ourRequest.cancel()
        }
    }

    function handleSubtaskDelete() {
        const ourRequest = Axios.CancelToken.source()
        async function deleteValue(){
            try{
                const response = await Axios.post('/delete-subtask',{
                    id: subtask._id,
                }, {cancelToken: ourRequest.token})
                setSubtaskStatusChange(subtaskStatusChange + 1)                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        deleteValue()
        return () => {
            ourRequest.cancel()
        }
    }
    
  return (
    <div key={index + subtask._id}>
        <input type="checkbox" id={subtask._id} name="subtask" value={subtask.value} checked={subtask.value} onChange={handleCheckboxChange} className="accent-[#1BC00C]"/>
        <label for={subtask._id}>{" " + subtask.content}</label><button onClick={handleSubtaskDelete} className="h-6 w-4 ml-2"><img src={deleteIcon} alt="delete" /></button><br/>    
    </div>
  )
}

export default Subtask
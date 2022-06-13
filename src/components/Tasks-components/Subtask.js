import React from 'react'
import Axios from "axios"

function Subtask({subtask, index, subtasks, setSubtasks, setSubtaskStatusChange, subtaskStatusChange}) {
    function handleCheckboxChange() {
        subtasks[index].value = !subtasks[index].value
        console.log(subtask.value)
        const ourRequest = Axios.CancelToken.source()
        async function updateValue(){
            try{
                const response = await Axios.post('http://localhost:8000/subtask-value-update',{
                    id: subtask._id,
                    value: subtask.value
                }, {cancelToken: ourRequest.token})
                setSubtaskStatusChange(subtaskStatusChange + 1)
                console.log(subtaskStatusChange)
                
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
    
  return (
    <div key={index + subtask._id}>
        <input type="checkbox" id={subtask._id} name="subtask" value={subtask.value} checked={subtask.value} onChange={handleCheckboxChange}/>
        <label for={subtask._id}>{" " + subtask.content + ` ${index} ${subtask.value}`}</label><br/>    
    </div>
  )
}

export default Subtask
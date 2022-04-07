import React, { useState } from 'react'
import initialData from '../initial-data'
import Column from './dnd/column'

function Tasks() {
    const [state, setState] = useState(initialData);
    console.log(state)

  return (
    <div>
        {state.columnOrder.map(columnId => {
            const column = state.columns[columnId]
            const tasks = column.taskIds.map(taskId => state.tasks[taskId])

            return <Column key={column.id} column={column} tasks={tasks} />
        })}
    </div>
  )
}

export default Tasks
import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import initialData from '../initial-data'

function Tasks() {
  const [data, setData] = useState(initialData)
  console.log(initialData)

  const onDragEnd = result => {
    console.log(result)
  }
    
  return (
      <DragDropContext onDragEnd={onDragEnd}>
        { data.map((section) => {
          return (<Droppable
            key={section.id}
            droppableId={section.id}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div>
                  {section.title}
                </div>
                <div>
                  {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.DraggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>
                              {task.title}
                            </div>
                          </div>
                        )}
                      </Draggable>
                  ))}
                </div>
              </div>
            )}
          </Droppable> )
        }) }
      </DragDropContext>
  )
}

export default Tasks
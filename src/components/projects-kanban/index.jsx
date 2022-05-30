import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialDataProjects from '../../initial-data-projects'
import { useState } from 'react'
import Project from '../Projects-components/Project'

const ProjectsKanban = () => {
    const [data, setData] = useState(initialDataProjects)

    const onDragEnd = result => {
        if (!result.destination) return
        const { source, destination } = result

        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
            const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)

            const sourceCol = data[sourceColIndex]
            const destinationCol = data[destinationColIndex]

            const sourceTask = [...sourceCol.tasks]
            const destinationTask = [...destinationCol.tasks]

            const [removed] = sourceTask.splice(source.index, 1)
            destinationTask.splice(destination.index, 0, removed)

            data[sourceColIndex].tasks = sourceTask
            data[destinationColIndex].tasks = destinationTask

            setData(data)
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="column-container w-full flex py-2 mb-7">
                {
                    data.map(section => (
                        <Droppable
                            key={section.id}
                            droppableId={section.id}
                        >
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    className='w-1/5 mx-3'
                                    ref={provided.innerRef}
                                >
                                    <div className={"border-b-2 pb-3 border-" + section.color + "-500"}>
                                        <div className="section-title border-yellow-500 border-red-500 border-green-500 border-blue-500 border-purple-500">
                                            {section.title}
                                        </div>
                                    </div>
                                    <div className="kanban__section__content">
                                        {
                                            section.tasks.map((task, index) => (
                                                <Project task={task} index={index} />
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))
                }
            </div>
        </DragDropContext>
    )
}

export default ProjectsKanban
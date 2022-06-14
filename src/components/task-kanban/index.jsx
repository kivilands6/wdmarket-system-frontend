import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React, { useState, useEffect, useContext } from 'react'
import {useImmer} from 'use-immer'
import Axios from "axios"
import Task from '../Tasks-components/Task'
import StateContext from '../../StateContext'
import Loader from '../Loader'

const TaskKanban = ({taskCreated}) => {
    const appState = useContext(StateContext)
    const [taskState, setTaskState] = useImmer({
        isLoading: true,
        allTasks: []
    })

    const initialDataTasks = [
        {
            id: 'Column-1',
            title: 'Backlog',
            color: 'red',
            tasks: []
        },
        {
            id: 'Column-2',
            title: 'To Do',
            color: 'yellow',
            tasks: []
        },
        {
            id: 'Column-3',
            title: 'In Progress',
            color: 'green',
            tasks: []
        },
        {
            id: 'Column-4',
            title: 'Testing',
            color: 'blue',
            tasks: []
        },
        {
            id: 'Column-5',
            title: 'Done',
            color: 'purple',
            tasks: []
        }
    ]

    const [data, setData] = useState(initialDataTasks)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchData(){
            try{
                const response = await Axios.get('http://localhost:8000/all-tasks', {cancelToken: ourRequest.token})
                console.log(response.data)
                const backlogTasks = await Axios.get('http://localhost:8000/tasks-backlog', {cancelToken: ourRequest.token})
                console.log(backlogTasks.data)
                const todoTasks = await Axios.get('http://localhost:8000/tasks-todo', {cancelToken: ourRequest.token})
                console.log(todoTasks.data)
                const inprogressTasks = await Axios.get('http://localhost:8000/tasks-inprogress', {cancelToken: ourRequest.token})
                const testingTasks = await Axios.get('http://localhost:8000/tasks-testing', {cancelToken: ourRequest.token})
                const doneTasks = await Axios.get('http://localhost:8000/tasks-done', {cancelToken: ourRequest.token})
                setTaskState(draft => {
                    draft.isLoading = false
                    draft.allTasks = response.data
                    data[0].tasks = backlogTasks.data
                    data[1].tasks = todoTasks.data
                    data[2].tasks = inprogressTasks.data
                    data[3].tasks = testingTasks.data
                    data[4].tasks = doneTasks.data
                    setData(data)
                })
                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        fetchData()
        return () => {
            ourRequest.cancel()
        }
    }, [taskCreated]) 

    function changeStatuss ( statuss, projectId ) {
        const ourRequest = Axios.CancelToken.source()
        async function updateStatuss(){
            try{
                const response = await Axios.post('http://localhost:8000/task-statuss-update',{
                    projectId: projectId,
                    statuss: statuss
                }, {cancelToken: ourRequest.token})
                console.log(response)
                
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        updateStatuss()
        return () => {
            ourRequest.cancel()
        }
    }

    const onDragEnd = result => {
        if (!result.destination) return
        const { source, destination, draggableId } = result

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

            const destinationColStatuss = data[destinationColIndex].title

            changeStatuss( destinationColStatuss, draggableId )

            setData(data)
        }
    }

    if(taskState.isLoading) {
        return (
            <Loader />
        )
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
                                            appState.user.admin ? section.tasks.map((task, index) => (
                                                <Task task={task} index={index} statuss={section.title} key={task._id} />
                                            )) : 
                                            section.tasks.filter(task => task.assignee == appState.user.username).map((task, index) => (
                                                <Task task={task} index={index} statuss={section.title} key={task._id} />
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

export default TaskKanban
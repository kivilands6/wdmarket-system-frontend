import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React, { useState, useEffect} from 'react'
import {useImmer} from 'use-immer'
import Axios from "axios"
import Project from '../Projects-components/Project'

const ProjectsKanban = ({projectCreated}) => {
    const [projectState, setProjectState] = useImmer({
        isLoading: true,
        allProjects: []
    })
    
    const initialDataProjects = [
        {
            id: 'Column-1',
            title: 'New',
            color: 'red',
            projects: []
        },
        {
            id: 'Column-2',
            title: 'In progress',
            color: 'yellow',
            projects: []
        },
        {
            id: 'Column-3',
            title: 'Completed',
            color: 'green',
            projects: []
        }
    ]

    
    const [data, setData] = useState(initialDataProjects)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
    
            async function fetchData(){
                console.log("axios function")
                try{
                    const response = await Axios.get('http://localhost:8000/all-projects', {cancelToken: ourRequest.token})
                    const newProjects = await Axios.get('http://localhost:8000/projects-new', {cancelToken: ourRequest.token})
                    const inProgressProjects = await Axios.get('http://localhost:8000/projects-inprogress', {cancelToken: ourRequest.token})
                    const completedProjects = await Axios.get('http://localhost:8000/projects-completed', {cancelToken: ourRequest.token})
                    console.log(response.data)
                    console.log(projectCreated)
                    setProjectState(draft => {
                        draft.isLoading = false
                        draft.allProjects = response.data
                        data[0].projects = newProjects.data
                        data[1].projects = inProgressProjects.data
                        data[2].projects = completedProjects.data
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
    }, [projectCreated]) 

    function changeStatuss ( statuss, projectId ) {
        const ourRequest = Axios.CancelToken.source()
        async function updateStatuss(){
            try{
                const response = await Axios.post('http://localhost:8000/project-statuss-update',{
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

            const sourceTask = [...sourceCol.projects]
            const destinationTask = [...destinationCol.projects]

            const [removed] = sourceTask.splice(source.index, 1)
            destinationTask.splice(destination.index, 0, removed)

            data[sourceColIndex].projects = sourceTask
            data[destinationColIndex].projects = destinationTask
            
            const destinationColStatuss = data[destinationColIndex].title

            changeStatuss( destinationColStatuss, draggableId )

            setData(data)
            console.log("after setdata ondragend")
        }
    }

    if(projectState.isLoading) {
        return (
            <div>Loading</div>
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
                                    className='w-1/3 mx-3'
                                    ref={provided.innerRef}
                                >
                                    <div className={"border-b-2 pb-3 border-" + section.color + "-500"}>
                                        <div className="section-title border-yellow-500 border-red-500 border-green-500 border-blue-500 border-purple-500">
                                            {section.title}
                                        </div>
                                    </div>
                                    <div className="kanban__section__content">
                                        {
                                            section.projects.map((project, index) => (
                                                <Project project={project} index={index} statuss={section.title} key={project._id} /> 
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
import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'
import {CSSTransition} from 'react-transition-group'

function NewTaskPopup( {newTaskPopup, toggleNewTaskPopup, setTaskCreated} ) {
    const appDispatch = useContext(DispatchContext)
    const [allProjects, setAllProjects] = useState([])
    const [allUsers, setAllUsers] = useState([])

    const initialState = {
        title: {
            value: "",
            hasErrors: false,
            message: "",
        },
        project: {
            value: "",
            hasErrors: false,
            message: "",
        },
        priority: {
          value: "",
          hasErrors: false,
          message: "",
        },
        content: {
          value: "",
          hasErrors: false,
          message: "",
        },
        assignee: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0
        
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "titleImmediately":
            draft.title.hasErrors = false
            draft.title.value = action.value
            if(draft.title.value.length > 30) {
              draft.title.hasErrors = true
              draft.title.message = "Title cannot exceed 30 characters"
            }
            return

            case "titleAfterDelay":
                if(draft.title.value.length < 3) {
                draft.title.hasErrors = true
                draft.title.message = "Title must have at least 3 characters"
                }
        
            case "projectImmediately":
                draft.project.hasErrors = false
                draft.project.value = action.value
                return

            case "checkProject":
                if(draft.project.value === "") {
                    draft.project.hasErrors = true
                    draft.project.message = "Project must be selected"
                }
                return
        
            case "priorityImmediately":
                draft.priority.hasErrors = false
                draft.priority.value = action.value
                return

            case "checkPriority":
                if(draft.priority.value === "") {
                    draft.priority.hasErrors = true
                    draft.priority.message = "Priority must be selected"
                }
                return

            case "contentImmediately":
                draft.content.hasErrors = false
                draft.content.value = action.value
                return

            case "assigneeImmediately":
                draft.assignee.hasErrors = false
                draft.assignee.value = action.value
                return

            case "checkAssignee":
                if(draft.assignee.value === "") {
                    draft.assignee.hasErrors = true
                    draft.assignee.message = "Assignee must be selected"
                }
                return

            case "submitForm":
                if( !draft.title.hasErrors && !draft.project.hasErrors && !draft.content.hasErrors && !draft.priority.hasErrors && !draft.assignee.hasErrors ) {
                    draft.submitCount++
                }
                return
        }
    }
    
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if(state.submitCount) {
            const ourRequest = Axios.CancelToken.source()
            async function createTask() {
                try{
                    const response = await Axios.post('http://localhost:8000/create-task', {
                      title: state.title.value,
                      project: state.project.value,
                      priority: state.priority.value,
                      content: state.content.value,
                      assignee: state.assignee.value
                    }, {cancelToken: ourRequest.token})
                    console.log(response)
                    toggleNewTaskPopup()
                    setTaskCreated(prev => {
                        return prev + 1
                    })
                    appDispatch({type: "flashMessage", value: "New task created successfully"})
                }
                catch(e){
                    console.log("There was a problem or the request was canceled")
                }
            }
            createTask()
            return () => ourRequest.cancel()
        }
    }, [state.submitCount])

    useEffect(() => {
        if(state.title.value) {
          const delay = setTimeout( () => dispatch({type: "titleAfterDelay"}), 800)
          return () => clearTimeout(delay)
        }
      }, [state.title.value])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchAllData() {
            try{
                const allProjects = await Axios.get('http://localhost:8000/all-projects', {cancelToken: ourRequest.token})
                const allUsers = await Axios.get('http://localhost:8000/all-users', {cancelToken: ourRequest.token})
                console.log(allProjects.data)
                setAllProjects(allProjects.data)
                setAllUsers(allUsers.data)
            }
            catch(e){
                console.log("There was a problem or the request was canceled")
            }
        }
        fetchAllData()
        return () => ourRequest.cancel()
    }, [])

    function handleSubmit(e){
        dispatch({type: "titleImmediately", value: state.title.value})
        dispatch({type: "titleAfterDelay", value: state.title.value})
        dispatch({type: "checkProject", value: state.project.value})
        dispatch({type: "checkAssignee", value: state.assignee.value})
        dispatch({type: "checkPriority", value: state.priority.value})
        e.preventDefault()
        dispatch({type: "submitForm"})
        
    } 

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (newTaskPopup ? "" : "hidden")} >
        <div className="popup-content relative w-3/4 max-w-[700px] my-0 mx-auto h-auto bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[80%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    Create a new Task!
                </h2>
                <div className="task-body mt-10 max-w-[400px]">
                    <form onSubmit={handleSubmit} id="create-task-form">

                        <div className="form-group relative">
                            <label htmlFor="title-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Title
                            </label>
                            <input onChange={e => dispatch({type: "titleImmediately", value: e.target.value})} id="title-register" name="title" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Task title" autoComplete="off" />
                            <CSSTransition in={state.title.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.title.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <label htmlFor="project-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Project
                            </label>
                            <select name="project" form="create-task-form" id="project-select" onChange={e => dispatch({type: "projectImmediately", value: e.target.value})} className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative">
                                <option value="" selected disabled hidden>Choose project</option>
                                {allProjects.map((project) => 
                                    (<option value={project.name}>{project.name}</option>)
                                )}
                            </select>
                            <CSSTransition in={state.project.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.project.message}</div>
                            </CSSTransition>
                        </div>

                        <div className="form-group mt-8 relative">
                            <label htmlFor="assignee-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Assignee
                            </label>
                            <select name="assignee-register" form="create-task-form" id="assignee-select" onChange={e => dispatch({type: "assigneeImmediately", value: e.target.value})} className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative">
                                <option value="" selected disabled hidden>Choose assignee</option>
                                {allUsers.map((user) => 
                                    (<option value={user.username}>{user.username}</option>)
                                )}
                            </select>
                            <CSSTransition in={state.assignee.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.assignee.message}</div>
                            </CSSTransition>
                        </div>

                        <div className="form-group mt-8 relative">
                            <label htmlFor="priority-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Priority
                            </label>
                            <select name="assignee-register" form="create-task-form" id="assignee-select" onChange={e => dispatch({type: "assigneeImmediately", value: e.target.value})} className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative">
                                <option value="" selected disabled hidden>Choose assignee</option>
                                <option value="Low">Very Low</option>
                                <option value="Low">Low</option>
                                <option value="Low">Medium</option>
                                <option value="Low">High</option>
                                <option value="Low">Very High</option>
                            </select>
                            <CSSTransition in={state.priority.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.priority.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="content-register" className="text-muted mb-1 font-semibold">
                                Content
                            </label>
                            <textarea onChange={e => dispatch({type: "contentImmediately", value: e.target.value})} id="content-register" name="content" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="date" placeholder="Task description" autoComplete="off" />
                        </div>

                        <button type="submit" className="py-3 px-7 mt-10 bg-[#5932EA] text-white rounded-xl">
                            Create task
                        </button>
                    </form>
                </div>
            </div>

            <div className="task-right-column w-[20%] rounded-tr-xl rounded-br-xl">
                <div className="column-head p-8 pt-5 flex justify-end">
                    <button className="btn-close" onClick={() => {
                            toggleNewTaskPopup()
                        }}>x
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewTaskPopup
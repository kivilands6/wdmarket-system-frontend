import React, {useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'
import {CSSTransition} from 'react-transition-group'

function NewProjectPopup( {newProjectPopup, toggleNewProjectPopup, setProjectCreated} ) {
    const appDispatch = useContext(DispatchContext)

    const initialState = {
        name: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: true,
            checkCount: 0
        },
        price: {
            value: "",
            hasErrors: false,
            message: "",
        },
        link: {
          value: "",
          hasErrors: false,
          message: "",
        },
        startDate: {
          value: "",
          hasErrors: false,
          message: "",
        },
        endDate: {
          value: "",
          hasErrors: false,
          message: "",
        },
        submitCount: 0
        
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "nameImmediately":
            draft.name.hasErrors = false
            draft.name.value = action.value
            if(draft.name.value.length > 30) {
              draft.name.hasErrors = true
              draft.name.message = "name cannot exceed 30 characters."
            }
            if(draft.name.value && !/^([a-zA-Z0-9]+)$/.test(draft.name.value)) {
              draft.name.hasErrors = true
              draft.name.message = "Name can only contain letters and numbers"
            }
            return

            case "nameAfterDelay":
                if(draft.name.value.length < 3) {
                draft.name.hasErrors = true
                draft.name.message = "name must have at least 3 characters"
                }
        
                if(!draft.hasErrors && !action.noRequest) {
                draft.name.checkCount++
                }
                return

            case "nameUniqueResults":
                if(action.value) {
                draft.name.hasErrors = true
                draft.name.isUnique = false
                draft.name.message = "That name is already taken"
                } else {
                draft.name.isUnique = true
                }
                return
        
            case "priceImmediately":
                draft.price.hasErrors = false
                draft.price.value = action.value
                if(draft.price.value.length > 30) {
                    draft.price.hasErrors = true
                    draft.price.message = "Price cannot exceed 30 characters."
                }
                if(draft.price.value && !/^([0-9]+)$/.test(draft.price.value)) {
                    draft.price.hasErrors = true
                    draft.price.message = "Price can only contain numbers"
                }
                return
    
            case "priceAfterDelay":
                if(draft.price.value.length < 3) {
                draft.price.hasErrors = true
                draft.price.message = "Price must have at least 3 digits"
                }
                return
        
            case "linkImmediately":
                draft.link.hasErrors = false
                draft.link.value = action.value
                if(draft.link.value.length > 30) {
                    draft.link.hasErrors = true
                    draft.link.message = "Link cannot exceed 50 characters."
                }
                if(draft.link.value && !/^([a-zA-Z0-9.]+)$/.test(draft.link.value)) {
                    draft.link.hasErrors = true
                    draft.link.message = "Link can only contain letters and numbers and dots"
                }
                return
    
            case "linkAfterDelay":
                if(draft.link.value.length < 3) {
                draft.link.hasErrors = true
                draft.link.message = "Link must have at least 3 characters"
                }
                return

            case "startDateImmediately":
                draft.startDate.hasErrors = false
                draft.startDate.value = action.value
                console.log(draft.startDate.value)
                return

            case "checkStartDate":
                if(draft.startDate.value === "") {
                    draft.startDate.hasErrors = true
                    draft.startDate.message = "Start date must be selected"
                }
                return

            case "endDateImmediately":
                draft.endDate.hasErrors = false
                draft.endDate.value = action.value
                console.log(draft.endDate.value)
                if( draft.startDate.value > draft.endDate.value ) {
                    draft.endDate.hasErrors = true
                    draft.endDate.message = "End date cannot be lower than Start date"
                }
                return

            case "checkEndDate":
                console.log(draft.endDate.value)
                if(draft.endDate.value == "") {
                    draft.endDate.hasErrors = true
                    draft.endDate.message = "End date must be selected"
                }
                return
        
            case "submitForm":
                if(!draft.name.hasErrors && draft.name.isUnique && !draft.price.hasErrors && !draft.endDate.hasErrors && !draft.startDate.hasErrors) {
                draft.submitCount++
                
                }
                return
        }
    }
    
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if(state.submitCount) {
            console.log("starting request")
            const ourRequest = Axios.CancelToken.source()
            async function createProject() {
                try{
                    const response = await Axios.post('/create-project', {
                      name: state.name.value,
                      price: state.price.value,
                      link: state.link.value,
                      startDate: state.startDate.value,
                      endDate: state.endDate.value
                    }, {cancelToken: ourRequest.token})
                    console.log(response)
                    toggleNewProjectPopup()
                    setProjectCreated(prev => {
                        return prev + 1
                    })
                    appDispatch({type: "flashMessage", value: "New project created successfully"})
                }
                catch(e){
                    console.log("There was a problem or the request was canceled")
                }
            }
            createProject()
            return () => ourRequest.cancel()
        }
    }, [state.submitCount])

    useEffect(() => {
        if(state.name.value) {
          const delay = setTimeout( () => dispatch({type: "nameAfterDelay"}), 800)
          return () => clearTimeout(delay)
        }
      }, [state.name.value])

      // check if username is unique
    useEffect(() => {
        if(state.name.checkCount) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try{
                    const response = await Axios.post('/does-projectname-exist', {name: state.name.value}, {cancelToken: ourRequest.token})
                    console.log(response.data)
                    dispatch({type: "nameUniqueResults", value: response.data})
                }
                catch(e){
                    console.log("There was a problem or the request was canceled")
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [state.name.checkCount])

    useEffect(() => {
        if(state.price.value) {
          const delay = setTimeout( () => dispatch({type: "priceAfterDelay"}), 800)
          return () => clearTimeout(delay)
        }
      }, [state.price.value])

      useEffect(() => {
        if(state.link.value) {
          const delay = setTimeout( () => dispatch({type: "linkAfterDelay"}), 800)
          return () => clearTimeout(delay)
        }
      }, [state.link.value])

    function handleSubmit(e){
        e.preventDefault()
        dispatch({type: "nameImmediately", value: state.name.value})
        dispatch({type: "nameAfterDelay", value: state.name.value})
        dispatch({type: "priceImmediately", value: state.price.value})
        dispatch({type: "priceAfterDelay", value: state.price.value})
        dispatch({type: "linkImmediately", value: state.link.value})
        dispatch({type: "linkAfterDelay", value: state.link.value})
        dispatch({type: "checkStartDate", value: state.startDate.value})
        dispatch({type: "startDateImmediately", value: state.startDate.value})
        dispatch({type: "checkEndDate", value: state.endDate.value})
        dispatch({type: "endDateImmediately", value: state.endDate.value})
        console.log(state.endDate.value)
        dispatch({type: "submitForm"})
        
    } 

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (newProjectPopup ? "" : "hidden")} >
        <div className="popup-content relative w-3/4 max-w-[700px] my-0 mx-auto h-auto bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[80%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    Create a new project!
                </h2>
                <div className="task-body mt-10 max-w-[400px]">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group relative">
                            <label htmlFor="name-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Project name
                            </label>
                            <input onChange={e => dispatch({type: "nameImmediately", value: e.target.value})} id="name-register" name="name" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Project name" autoComplete="off" />
                            <CSSTransition in={state.name.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.name.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <label htmlFor="price-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Price
                            </label>
                            <input onChange={e => dispatch({type: "priceImmediately", value: e.target.value})} id="price-register" name="price" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Project price" autoComplete="off" />
                            <CSSTransition in={state.price.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.price.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <label htmlFor="link-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Link
                            </label>
                            <input onChange={e => dispatch({type: "linkImmediately", value: e.target.value})} id="link-register" name="link" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Link to old or new project" />
                            <CSSTransition in={state.link.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.link.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <label htmlFor="start-date-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Start date
                            </label>
                            <input onChange={e => dispatch({type: "startDateImmediately", value: e.target.value})} id="start-date-register" name="start-date" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="date" placeholder="Start Date" autoComplete="off" />
                            <CSSTransition in={state.startDate.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.startDate.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <label htmlFor="end-date-register" className="text-muted mb-1 font-semibold absolute top-[-25px]">
                                Due date
                            </label>
                            <input onChange={e => dispatch({type: "endDateImmediately", value: e.target.value})} id="end-date-register" name="end-date" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="date" placeholder="End date" autoComplete="off" />
                            <CSSTransition in={state.endDate.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.endDate.message}</div>
                            </CSSTransition>
                        </div>

                        <button type="submit" className="py-3 px-7 mt-10 bg-[#5932EA] text-white rounded-xl">
                            Create project
                        </button>
                    </form>
                </div>
            </div>

            <div className="task-right-column w-[20%] rounded-tr-xl rounded-br-xl">
                <div className="column-head p-8 pt-5 flex justify-end">
                    <button className="btn-close" onClick={() => {
                            toggleNewProjectPopup()
                        }}>x
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewProjectPopup
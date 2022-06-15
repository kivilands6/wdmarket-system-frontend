import React, {useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'

function NewProjectPopup( {newProjectPopup, toggleNewProjectPopup, setProjectCreated} ) {
    const appDispatch = useContext(DispatchContext)

    const initialState = {
        name: {
            value: "",
            hasErrors: false,
            message: "",
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
                return
        
            case "priceImmediately":
                draft.price.hasErrors = false
                draft.price.value = action.value
                return
        
            case "linkImmediately":
                draft.link.hasErrors = false
                draft.link.value = action.value
                return

            case "startDateImmediately":
                draft.startDate.hasErrors = false
                draft.startDate.value = action.value
                console.log(draft.startDate.value)
                return

            case "endDateImmediately":
                draft.endDate.hasErrors = false
                draft.endDate.value = action.value
                console.log(draft.endDate.value)
                if( draft.startDate.value > draft.endDate.value ) {
                    draft.endDate.hasErrors = true
                }
                return
        
            case "submitForm":
                if(!draft.name.hasErrors && !draft.price.hasErrors && !draft.endDate.hasErrors) {
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
                    const response = await Axios.post('http://localhost:8000/create-project', {
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

    function handleSubmit(e){
        e.preventDefault()
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

                        <div className="form-group">
                            <label htmlFor="name-register" className="text-muted mb-1 font-semibold">
                                Project name
                            </label>
                            <input onChange={e => dispatch({type: "nameImmediately", value: e.target.value})} id="name-register" name="name" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Project name" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="price-register" className="text-muted mb-1 font-semibold">
                                Price
                            </label>
                            <input onChange={e => dispatch({type: "priceImmediately", value: e.target.value})} id="price-register" name="price" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Project price" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="link-register" className="text-muted mb-1 font-semibold">
                                Link
                            </label>
                            <input onChange={e => dispatch({type: "linkImmediately", value: e.target.value})} id="link-register" name="link" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Link to old or new project" />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="start-date-register" className="text-muted mb-1 font-semibold">
                                Start date
                            </label>
                            <input onChange={e => dispatch({type: "startDateImmediately", value: e.target.value})} id="start-date-register" name="start-date" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="date" placeholder="Start Date" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="end-date-register" className="text-muted mb-1 font-semibold">
                                Due date
                            </label>
                            <input onChange={e => dispatch({type: "endDateImmediately", value: e.target.value})} id="end-date-register" name="end-date" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="date" placeholder="End date" autoComplete="off" />
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
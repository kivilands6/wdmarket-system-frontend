import React, {useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'

function UsersPopup( {newUserPopup, toggleNewUserPopup} ) {
    const appDispatch = useContext(DispatchContext)

    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: true,
            checkCount: 0
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: true,
            checkCount: 0
        },
        password: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0
        
    }

    function ourReducer(draft, action) {
        switch (action.type) {
          case "usernameImmediately":
            draft.username.hasErrors = false
            draft.username.value = action.value
            return
    
          case "usernameAfterDelay":
            if(draft.username.value.length < 3) {
              draft.username.hasErrors = true
              draft.username.message = "Username must have at least 3 characters"
            }
    
            if(!draft.hasErrors && !action.noRequest) {
              draft.username.checkCount++
            }
            return
    
          case "usernameUniqueResults":
            if(action.value) {
              draft.username.hasErrors = true
              draft.username.isUnique = false
              draft.username.message = "That username is already taken"
            } else {
              draft.username.isUnique = true
            }
            return
    
          case "emailImmediately":
            draft.email.hasErrors = false
            draft.email.value = action.value
            return
    
          case "emailAfterDelay":
            if(!/^\S+@\S+$/.test(draft.email.value)) {
              draft.email.hasErrors = true
              draft.email.message = "You must provide a valid email address"
            }
            if(!draft.email.hasErrors && !action.noRequest) {
              draft.email.checkCount++
            }
            return
    
          case "emailUniqueResults":
            if(action.value) {
              draft.email.hasErrors = true
              draft.email.isUnique = false
              draft.email.message = "That email is already taken"
            } else {
              draft.email.isUnique = true
            }
            return
    
          case "passwordImmediately":
            draft.password.hasErrors = false
            draft.password.value = action.value
            if(draft.password.value.length > 50) {
              draft.password.hasErrors = true
              draft.password.message = "Password cannot exceed 50 characters"
            }
            return
    
          case "passwordAfterDelay":
            if (draft.password.value.length < 12) {
              draft.password.hasErrors = true
              draft.password.message = "Password must be at least 12 characters"
            }
            return
    
          case "submitForm":
            if(!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
              draft.submitCount++
              
            }
            return
        }
    }
    
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if(state.submitCount) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try{
                    const response = await Axios.post('http://localhost:8000/register', {username: state.username.value, email: state.email.value, password: state.password.value}, {cancelToken: ourRequest.token})
                    
                    console.log(response.data)
                }
                catch(e){
                    console.log("There was a problem or the request was canceled")
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
      }, [state.submitCount])
    

    function handleSubmit(e){
        e.preventDefault()
        dispatch({type: "submitForm"})
        
    } 

  return (
    <div className={"popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 " + (newUserPopup ? "" : "hidden")} >
        <div className="popup-content relative w-3/4 my-0 mx-auto h-auto max-h-[70vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[70%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    Create a new user!
                </h2>
                <div className="task-body mt-10">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username-register" className="text-muted mb-1">
                            <small>Username</small>
                        </label>
                        <input onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-register" className="text-muted mb-1">
                            <small>Email</small>
                        </label>
                        <input onChange={e => dispatch({type: "emailImmediately", value: e.target.value})} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-register" className="text-muted mb-1">
                            <small>Password</small>
                        </label>
                        <input onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
                    </div>
                    <button type="submit" className="py-3 px-7 mt-5 bg-[#5932EA] text-white rounded-xl">
                        Create user
                    </button>
                </form>
                </div>
            </div>

            <div className="task-right-column w-[30%] bg-white rounded-tr-xl rounded-br-xl">
                <div className="column-head p-8 pt-5 flex justify-end">
                    <button className="btn-close" onClick={() => {
                            toggleNewUserPopup()
                        }}>x
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UsersPopup
import React, {useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'

function UsersPopup( {newUserPopup, toggleNewUserPopup, setUsersCreated} ) {
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
        name: {
          value: "",
          hasErrors: false,
          message: "",
        },
        surname: {
          value: "",
          hasErrors: false,
          message: "",
        },
        phone: {
          value: "",
          hasErrors: false,
          message: "",
        },
        address: {
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
    
          case "emailImmediately":
            draft.email.hasErrors = false
            draft.email.value = action.value
            return
    
          case "passwordImmediately":
            draft.password.hasErrors = false
            draft.password.value = action.value
            if(draft.password.value.length > 50) {
              draft.password.hasErrors = true
              draft.password.message = "Password cannot exceed 50 characters"
            }
            return
    
          case "submitForm":
            if(!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
              draft.submitCount++
              
            }
            return

            case "clearFields":
              draft.username.value = ''
              draft.email.value = ''
              draft.password.value = ''
              return
            
            case "nameImmediately":
              draft.name.hasErrors = false
              draft.name.value = action.value
              return
            
            case "surnameImmediately":
              draft.surname.hasErrors = false
              draft.surname.value = action.value
              return

            case "phoneImmediately":
              draft.phone.hasErrors = false
              draft.phone.value = action.value
              return

            case "addressImmediately":
              draft.address.hasErrors = false
              draft.address.value = action.value
              return
        }
    }
    
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if(state.submitCount) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try{
                    const response = await Axios.post('http://localhost:8000/register', {
                      username: state.username.value,
                      email: state.email.value,
                      password: state.password.value,
                      name: state.name.value,
                      surname: state.surname.value,
                      phone: state.phone.value,
                      address: state.address.value
                    }, {cancelToken: ourRequest.token})
                    toggleNewUserPopup()
                    setUsersCreated(prev => {
                        return prev + 1
                    })
                    appDispatch({type: "flashMessage", value: "New user created successfully"})
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
        <div className="popup-content relative w-3/4 max-w-[700px] my-0 mx-auto h-auto bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[80%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    Create a new user!
                </h2>
                <div className="task-body mt-10 max-w-[400px]">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <input value={state.username.value} onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})} id="username-register" name="username" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Username" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "emailImmediately", value: e.target.value})} id="email-register" name="email" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="you@example.com" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})} id="password-register" name="password" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="password" placeholder="SuperSecurePassword" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "nameImmediately", value: e.target.value})} id="name-register" name="name" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Name" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "surnameImmediately", value: e.target.value})} id="surname-register" name="surname" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Surname" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "phoneImmediately", value: e.target.value})} id="phone-register" name="phone" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Phone" autoComplete="off" />
                        </div>
                        <div className="form-group mt-3">
                            <input onChange={e => dispatch({type: "addressImmediately", value: e.target.value})} id="address-register" name="address" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1" type="text" placeholder="Address" autoComplete="off" />
                        </div>

                        <button type="submit" className="py-3 px-7 mt-10 bg-[#5932EA] text-white rounded-xl">
                            Create user
                        </button>
                    </form>
                </div>
            </div>

            <div className="task-right-column w-[20%] rounded-tr-xl rounded-br-xl">
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
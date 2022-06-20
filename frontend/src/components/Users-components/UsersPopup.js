import React, {useEffect, useContext} from 'react'
import Axios from 'axios'
import {useImmerReducer} from 'use-immer'
import DispatchContext from '../../DispatchContext'
import {CSSTransition} from 'react-transition-group'

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
            if(draft.username.value.length > 30) {
              draft.username.hasErrors = true
              draft.username.message = "Username cannot exceed 30 characters."
            }
            if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
              draft.username.hasErrors = true
              draft.username.message = "Username can only contain letters and numbers"
            }
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
            
          case "nameImmediately":
            draft.name.hasErrors = false
            draft.name.value = action.value
            if(draft.name.value.length > 30) {
              draft.name.hasErrors = true
              draft.name.message = "Name cannot exceed 30 characters"
            }
            return

          case "nameAfterDelay":
            if (draft.name.value.length < 3) {
              draft.name.hasErrors = true
              draft.name.message = "Name must be at least 3 characters long"
            }
            if (!/^[a-zA-Z]*$/.test(draft.name.value)) {
              draft.name.hasErrors = true
              draft.name.message = "Name can only contain Letters"
            }
            return
          
          case "surnameImmediately":
            draft.surname.hasErrors = false
            draft.surname.value = action.value
            if(draft.surname.value.length > 30) {
              draft.surname.hasErrors = true
              draft.surname.message = "Surname cannot exceed 30 characters"
            }
            return

          case "surnameAfterDelay":
            if (draft.surname.value.length < 3) {
              draft.surname.hasErrors = true
              draft.surname.message = "Surname must be at least 3 characters long"
            }
            if (!/^[a-zA-Z]*$/.test(draft.surname.value)) {
              draft.surname.hasErrors = true
              draft.surname.message = "Surname can only contain Letters"
            }
            return

          case "phoneImmediately":
            draft.phone.hasErrors = false
            draft.phone.value = action.value
            if(draft.phone.value.length > 12) {
              draft.phone.hasErrors = true
              draft.phone.message = "Phone number cannot exceed 12 characters"
            }
            return

          case "phoneAfterDelay":
            if (draft.phone.value.length < 8) {
              draft.phone.hasErrors = true
              draft.phone.message = "Phone number must be at least 8 characters long"
            }
            if (!/^\+[0-9]*$/.test(draft.phone.value)) {
              draft.phone.hasErrors = true
              draft.phone.message = "Phone number can only contain plus sign and numbers"
            }
            return

            case "addressImmediately":
              draft.address.hasErrors = false
              draft.address.value = action.value
              if(draft.address.value.length > 50) {
                draft.address.hasErrors = true
                draft.address.message = "Address cannot exceed 50 characters"
              }
              return

            case "addressAfterDelay":
              if (draft.address.value.length < 10) {
                draft.address.hasErrors = true
                draft.address.message = "Address must be at least 10 characters long"
              }
              if (!/^[A-Za-z0-9'\.\-\s\,]*$/.test(draft.address.value)) {
                draft.address.hasErrors = true
                draft.address.message = "Address cannot contain symbols"
              }
              return


          case "submitForm":
          if(!draft.username.hasErrors && draft.username.isUnique && 
            !draft.email.hasErrors && draft.email.isUnique && 
            !draft.password.hasErrors && !draft.name.hasErrors &&
            !draft.surname.hasErrors && !draft.phone.hasErrors && !draft.address.hasErrors) {
            draft.submitCount++
            
          }
          return
        }
    }
    
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    // form submit request
    useEffect(() => {
        if(state.submitCount) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try{
                    const response = await Axios.post('/register', {
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

    // call reducer function after delay
    useEffect(() => {
      if(state.username.value) {
        const delay = setTimeout( () => dispatch({type: "usernameAfterDelay"}), 800)
        return () => clearTimeout(delay)
      }
    }, [state.username.value])

    // check if username is unique
    useEffect(() => {
      if(state.username.checkCount) {
          const ourRequest = Axios.CancelToken.source()
          async function fetchResults() {
              try{
                  const response = await Axios.post('/does-username-exist', {username: state.username.value}, {cancelToken: ourRequest.token})
                  console.log(response.data)
                  dispatch({type: "usernameUniqueResults", value: response.data})
              }
              catch(e){
                  console.log("There was a problem or the request was canceled")
              }
          }
          fetchResults()
          return () => ourRequest.cancel()
      }
  }, [state.username.checkCount])

  // monitor email change
  useEffect(() => {
    if(state.email.value) {
      const delay = setTimeout( () => dispatch({type: "emailAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  // Check if email is unique
  useEffect(() => {
    if(state.email.checkCount) {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResults() {
            try{
                const response = await Axios.post('/does-email-exist', {email: state.email.value}, {cancelToken: ourRequest.token})
                dispatch({type: "emailUniqueResults", value: response.data})
            }
            catch(e){
                console.log("There was a problem or the request was canceled")
            }
        }
        fetchResults()
        return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  // monitor password change and call reducer function
  useEffect(() => {
    if(state.password.value) {
      const delay = setTimeout( () => dispatch({type: "passwordAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if(state.name.value) {
      const delay = setTimeout( () => dispatch({type: "nameAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.name.value])

  useEffect(() => {
    if(state.surname.value) {
      const delay = setTimeout( () => dispatch({type: "surnameAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.surname.value])

  useEffect(() => {
    if(state.phone.value) {
      const delay = setTimeout( () => dispatch({type: "phoneAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.phone.value])

  useEffect(() => {
    if(state.address.value) {
      const delay = setTimeout( () => dispatch({type: "addressAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.address.value])

  // From submit handler
  function handleSubmit(e){
    e.preventDefault()
    dispatch({type: "usernameImmediately", value: state.username.value})
    dispatch({type: "usernameAfterDelay", value: state.username.value, noRequest: true})
    dispatch({type: "emailImmediately", value: state.email.value, noRequest: true})
    dispatch({type: "emailAfterDelay", value: state.email.value})
    dispatch({type: "passwordImmediately", value: state.password.value})
    dispatch({type: "passwordAfterDelay", value: state.password.value})
    dispatch({type: "nameImmediately", value: state.name.value})
    dispatch({type: "nameAfterDelay", value: state.name.value})
    dispatch({type: "surnameImmediately", value: state.surname.value})
    dispatch({type: "surnameAfterDelay", value: state.surname.value})
    dispatch({type: "phoneImmediately", value: state.phone.value})
    dispatch({type: "phoneAfterDelay", value: state.phone.value})
    dispatch({type: "addressImmediately", value: state.address.value})
    dispatch({type: "addressAfterDelay", value: state.address.value})
    dispatch({type: "submitForm"})
      
  } 

  return (
    <div className={"popup-box absolute top-0 left-0 w-full h-fit z-50 bg-black bg-opacity-50 " + (newUserPopup ? "" : "hidden")} >
        <div className="popup-content relative w-3/4 max-w-[700px] mx-auto h-auto bg-[#F6F9FF] my-[70px] rounded-xl min-h-[500px] flex">

            <div className="task-left-column w-[80%] py-8 pt-5 px-16">
                <h2 className="task-title text-4xl text-bold">
                    Create a new user!
                </h2>
                <div className="task-body mt-10 max-w-[400px]">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group relative">
                            <input value={state.username.value} onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})} id="username-register" name="username" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Username" autoComplete="off" />
                            <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.username.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "emailImmediately", value: e.target.value})} id="email-register" name="email" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="you@example.com" autoComplete="off" />
                            <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.email.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})} id="password-register" name="password" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="password" placeholder="SuperSecurePassword" />
                            <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.password.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "nameImmediately", value: e.target.value})} id="name-register" name="name" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Name" autoComplete="off" />
                            <CSSTransition in={state.name.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.name.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "surnameImmediately", value: e.target.value})} id="surname-register" name="surname" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Surname" autoComplete="off" />
                            <CSSTransition in={state.surname.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.surname.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "phoneImmediately", value: e.target.value})} id="phone-register" name="phone" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Phone" autoComplete="off" />
                            <CSSTransition in={state.phone.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.phone.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group mt-8 relative">
                            <input onChange={e => dispatch({type: "addressImmediately", value: e.target.value})} id="address-register" name="address" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-1 z-10 relative" type="text" placeholder="Address" autoComplete="off" />
                            <CSSTransition in={state.address.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                              <div className="bg-red-400 text-sm liveValidateMessage">{state.address.message}</div>
                            </CSSTransition>
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
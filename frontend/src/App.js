import Axios from 'axios'
import { useState, useEffect } from 'react';
import { useImmerReducer } from 'use-immer'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Header from './components/Header';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import ErrorPage from './components/ErrorPage';
import Users from './components/Users';
import Login from './components/Login';
import Profile from './components/Profile';
import FlashMessages from './components/FlashMessages';

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
Axios.defaults.baseURL = "http://localhost:8000/"


function App() {
  // check for page by link
  function NavItemSort() {
    if(window.location.pathname === '/projects') {
      return "Projects"
    } else if (window.location.pathname === '/tasks') {
      return "Tasks"
    } else if (window.location.pathname === '/users') {
      return "Users"
    } else if (window.location.pathname === '/profile'){
      return "My profile"
    }
  }

  // convert "true" to true and "false" to false from local storage
  function convertLocalStorage() {
    if(localStorage.getItem("userAdmin") == "true") {
      return true
    } else {
      return false
    }
  }

    // User data
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("userToken")),
    isSidebarOpen: Boolean(localStorage.getItem("isSidebarOpen")),
    navItem: NavItemSort(),
    flashMessages: [],
    user: {
      token: localStorage.getItem('userToken'),
      username: localStorage.getItem('userUsername'),
      avatar: localStorage.getItem('userAvatar'),
      email: localStorage.getItem("userEmail"),
      name: localStorage.getItem("userName"),
      surname: localStorage.getItem("userSurname"),
      phone: localStorage.getItem("userPhone"),
      address: localStorage.getItem("userAddress"),
      joinedDate: localStorage.getItem("userJoinedDate"),
      admin: convertLocalStorage(),
    }
  }

    // Main Dispatch reducer 
  function ourReducer(draft, action){
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      
      case "logout":
        draft.loggedIn = false
        return

      case "flashMessage":
        draft.flashMessages.push(action.value)
        return

      case "toggleSidebar":
        draft.isSidebarOpen = !draft.isSidebarOpen
        return

      case 'changeNavItemDashboard':
        draft.navItem = 'Dashboard'
        return
      
      case 'changeNavItemTasks':
        draft.navItem = 'Tasks'
        return

      case 'changeNavItemProjects':
        draft.navItem = 'Projects'
        return
      
      case 'changeNavItemUsers':
        draft.navItem = 'Users'
        return

      case 'changeNavItemProfile':
        draft.navItem = "My profile"
        return
    }
  }

  // initialize reducer
  const [state, dispatch] = useImmerReducer( ourReducer, initialState)

  // When login or logout then set local storage or remove
  useEffect(() => {
    if(state.loggedIn) {
      localStorage.setItem("userToken", state.user.token)
      localStorage.setItem("userUsername", state.user.username)
      localStorage.setItem("userAvatar", state.user.avatar)
      localStorage.setItem("userEmail", state.user.email)
      localStorage.setItem("userName", state.user.name)
      localStorage.setItem("userSurname", state.user.surname)
      localStorage.setItem("userPhone", state.user.phone)
      localStorage.setItem("userAddress", state.user.address)
      localStorage.setItem("userJoinedDate", state.user.joinedDate)
      localStorage.setItem("userAdmin", state.user.admin)
    }else {
      localStorage.removeItem("userToken")
      localStorage.removeItem("userUsername")
      localStorage.removeItem("userAvatar")
      localStorage.removeItem("userEmail", state.user.email)
      localStorage.removeItem("userName", state.user.name)
      localStorage.removeItem("userSurname", state.user.surname)
      localStorage.removeItem("userPhone", state.user.phone)
      localStorage.removeItem("userAddress", state.user.address)
      localStorage.removeItem("userJoinedDate", state.user.joinedDate)
      localStorage.removeItem("userAdmin", state.user.admin)
    }
  }, [state.loggedIn])

    // check if sidebar is open and save in local storage
  useEffect(() => {
    if (state.isSidebarOpen) {
      localStorage.setItem('isSidebarOpen', state.isSidebarOpen)
    } else {
      localStorage.removeItem('isSidebarOpen')
    }
  },[state.isSidebarOpen])

  return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
          <FlashMessages messages={ state.flashMessages } />
            {state.loggedIn ? 
              
            <div className="main-wrapper mx-auto">
              <Sidebar/>
              <div className={'main-content ' + (state.isSidebarOpen ? 'ml-28 ' : 'ml-0 ') + (state.loggedIn ? 'yes' : 'no ')} id='main'>
                <Header />
                <div className={'content min-h-[90vh] bg-[#F6F9FF] pt-16 px-10 pb-10 ' + (state.isSidebarOpen ? 'rounded-tl-[55px]' : '') }>
                  <Routes>
                    <Route path="/" element={state.loggedIn ? <Home /> : <Login />} />
                    <Route path="/projects" element={<Projects/>} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </div>
              </div>
            </div>
            : <Login /> }
          </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
  );
}

export default App;

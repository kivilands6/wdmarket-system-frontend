import './App.css';

import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Header from './components/Header';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import ErrorPage from './components/ErrorPage';
import Kanban from './components/kanban'

import { useState, useEffect } from 'react';
import { useImmerReducer } from 'use-immer'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'


function App() {

  function NavItemSort() {
    if(window.location.pathname === '/projects') {
      return "Projects"
    } else if (window.location.pathname === '/tasks') {
      return "Tasks"
    } else {
      return "Dashboard"
    }
  }

  const initialState = {
    isSidebarOpen: Boolean(localStorage.getItem("isSidebarOpen")),
    navItem: NavItemSort()
  }

  function ourReducer(draft, action){
    switch (action.type) {
    /*case "login":
        draft.loggedIn = true
        draft.user = action.data
        return

      case "logout":
        draft.loggedIn = false
        return

      case "flashMessage":
        draft.flashMessages.push(action.value)
        return */

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
    }
  }

  const [state, dispatch] = useImmerReducer( ourReducer, initialState)

  useEffect(() => {
    if (state.isSidebarOpen) {
      localStorage.setItem('isSidebarOpen', state.isSidebarOpen)
      console.log(localStorage.isSidebarOpen)
    } else {
      localStorage.removeItem('isSidebarOpen')
    }
  },[state.isSidebarOpen])

  return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
            <div className="main-wrapper mx-auto">
            <Sidebar/>
            <div className={'main-content ' + (state.isSidebarOpen ? 'ml-28' : 'ml-0')} id='main'>
              <Header />
              <div className={'content min-h-[90vh] bg-[#F6F9FF] pt-16 px-10 pb-10 ' + (state.isSidebarOpen ? 'rounded-tl-[55px]' : '') }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </div>
            </div>
          </div>
          </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
  );
}

export default App;

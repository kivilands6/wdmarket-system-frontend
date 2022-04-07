import React, { useContext } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import { Link } from "react-router-dom";

import logo from '../img/logo.png'
import dashboard from '../icons/dashboard.svg';
import tasks from '../icons/tasks.svg';
import project from '../icons/project.svg';

const Sidebar = () => {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    return (
        <div id='sideNav' className={"top-0 left-0 fixed h-full text-center ease-in duration-200 " + (appState.isSidebarOpen ? "w-28" : "hidden") }>
            <Link to='/' onClick={() => appDispatch({type: 'changeNavItemDashboard'})}><img src={logo} alt="logo" className='mx-auto my-10'/></Link>
            <Link to='/' onClick={() => appDispatch({type: 'changeNavItemDashboard'})}><img src={dashboard} alt="dashboard" className='mx-auto p-5 hover:bg-[#5932EA] hover:rounded-xl ease-in duration-200' /></Link>
            <Link to='/projects' onClick={() => appDispatch({type: 'changeNavItemProjects'})}><img src={project} alt="project" className='mx-auto p-5 hover:bg-[#5932EA] hover:rounded-xl ease-in duration-200' /></Link>
            <Link to='/tasks' onClick={() => appDispatch({type: 'changeNavItemTasks'})} ><img src={tasks} alt="tasks" className='mx-auto p-5 hover:bg-[#5932EA] hover:rounded-xl ease-in duration-200' /></Link>
        </div>
    )
}

export default Sidebar

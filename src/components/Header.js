import React, { useState, useEffect, useContext } from 'react'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

function Header() {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

  return (
    <div className='main-header h-24 flex mx-10 items-center'>
        <button onClick={() => appDispatch({type: "toggleSidebar"})}>
            <div class="space-y-1 mr-3">
                <div class="w-6 h-0.5 bg-[#242424] rounded"></div>
                <div class="w-6 h-0.5 bg-[#242424] rounded"></div>
                <div class="w-6 h-0.5 bg-[#242424] rounded"></div>
            </div>
        </button>
        <button onClick={() => appDispatch({type: "toggleSidebar"})}>
            {appState.navItem}
        </button>
    </div>
  )
}

export default Header
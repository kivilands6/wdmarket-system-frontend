import React, {useContext} from 'react'
import DispatchContext from '../DispatchContext'

function Profile() {
    const appDispatch = useContext(DispatchContext)

  return (
    <div>
        <button onClick={() => appDispatch({type: "logout"})}>logout</button>
    </div>
  )
}

export default Profile
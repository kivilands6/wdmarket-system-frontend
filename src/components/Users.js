import React, {useState} from 'react'
import UsersPopup from './Users-components/UsersPopup'

function Users() {
    const [newUserPopup, setNewUserPopup] = useState(false)

    function toggleNewUserPopup() {
        setNewUserPopup(!newUserPopup)
    }

  return (
    <div className=''>
      <button className="py-3 px-7 bg-[#5932EA] text-white rounded-xl" onClick={toggleNewUserPopup}>Add new user</button>

      <UsersPopup newUserPopup={newUserPopup} toggleNewUserPopup={toggleNewUserPopup} />
    </div>
  )
}

export default Users
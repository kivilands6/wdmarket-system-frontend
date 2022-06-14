import React, {useState, useEffect, useContext} from 'react'
import UsersPopup from './Users-components/UsersPopup'
import {useImmer} from 'use-immer'
import Axios from "axios"
import StateContext from '../StateContext'
import Loader from './Loader'

function Users() {
    //Some state initialization
    const appState = useContext(StateContext)
    const [state, setState] = useImmer({
        isLoading: true,
        allUsers: []
    })
    const [usersCreated, setUsersCreated] = useState(0)
    const [newUserPopup, setNewUserPopup] = useState(false)

    // toggle new user popup
    function toggleNewUserPopup() {
        setNewUserPopup(!newUserPopup)
    }

    // get all users and store them in state
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
    
            async function fetchData(){
                try{
                    const response = await Axios.get('http://localhost:8000/all-users', {cancelToken: ourRequest.token})
                    setState(draft => {
                        console.log(response.data)
                        draft.isLoading = false
                        draft.allUsers = response.data
                    })
                }
                catch(e){
                    console.log("There was a problem or the request was canceled!")
                }
            }
        fetchData()
        return () => {
            ourRequest.cancel()
        }
    }, [usersCreated])

    if(state.isLoading) {
        return (
            <Loader />
        )
    }

  return (
    <div className=''>
        {appState.user.admin ? <button className="py-3 px-7 mb-10 bg-[#5932EA] text-white rounded-xl" onClick={toggleNewUserPopup}>Add new user</button> : ""}
        <div>
            <h2 className='body-title font-semibold text-xl'>All users</h2>
        </div>
      <div className="main-area mt-5 relative overflow-x-auto shadow-md sm:rounded-xl w-min">
        <table className="table-auto text-left rounded-xl w-full">
            <thead className="bg-gray-200">
                <tr>
                    <th className="px-6 py-3 font-semibold text-white bg-[#5932EA]">Username</th>
                    <th className="px-6 py-3 font-semibold text-white bg-[#5932EA]">Name</th>
                    <th className="px-6 py-3 font-semibold text-white bg-[#5932EA]">Email</th>
                    <th className="px-6 py-3 font-semibold text-white bg-[#5932EA]">Phone</th>
                    <th className="px-6 py-3 font-semibold text-white bg-[#5932EA]">Joined at</th>
                </tr>
            </thead>
            <tbody>

                {state.allUsers.map(user => {
                    return (
                        <tr className="border" key={user.username}>
                            <td className="px-6 py-3">{user.username}</td>
                            <td className="px-6 py-3">{user.name}</td>
                            <td className="px-6 py-3">{user.email}</td>
                            <td className="px-6 py-3">{user.phone}</td>
                            <td className="px-6 py-3">{user.joinedDate}</td>
                        </tr>
                    )
                })}

            </tbody>
        </table>
      </div>
      {appState.user.admin ? <UsersPopup newUserPopup={newUserPopup} toggleNewUserPopup={toggleNewUserPopup} setUsersCreated={setUsersCreated} /> : ""}
    </div>
  )
}

export default Users
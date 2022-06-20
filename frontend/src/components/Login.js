import React, {useContext, useState} from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'

function Login() {
    const appDispatch = useContext(DispatchContext)

    //Some state set
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    // Handle function for login
    async function handleSubmit(e){
        e.preventDefault()
        try{
            const response = await Axios.post('/login', {username, password})
            if(response.data){
                appDispatch({type: 'login', data: response.data}) // set user data
                appDispatch({type: "flashMessage", value: "Welcome back " + username + "!"}) // display a message
            }else{
                appDispatch({type: "flashMessage", value: "Invalid username or password"})
            }
        }catch(e){
            console.log("There was a problem")
        }
    }

  return (
    <div className="popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50">
    <div className="popup-content relative w-[600px] my-0 mx-auto h-auto max-h-[50vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[100px] flex">

        <div className="task-left-column w-full py-8 pt-5 px-16">
            <h2 className="task-title text-4xl text-bold">
                Login
            </h2>
            <div className="task-body mt-5">
                <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
                    <div className="row align-items-center">
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input onChange={e => setUsername(e.target.value)} name="username" className="py-2 px-5 border-gray-200 border rounded-xl w-full" type="text" placeholder="Username" autoComplete="off" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input onChange={e => setPassword(e.target.value)} name="password" className="py-2 px-5 border-gray-200 border rounded-xl w-full" type="password" placeholder="Password" />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="py-3 px-7 mt-5 bg-[#5932EA] text-white rounded-xl">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
)
}

export default Login
import React, {useContext, useState} from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'

function Login() {
    const appDispatch = useContext(DispatchContext)

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    async function handleSubmit(e){
        e.preventDefault()
        try{
            const response = await Axios.post('http://localhost:8000/login', {username, password})
            if(response.data){
                console.log(response.data)
                appDispatch({type: 'login', data: response.data})
                appDispatch({type: "flashMessage", value: "Welcome back " + username + "!"})
            }else{
                console.log("Incorrect username or password")
                appDispatch({type: "flashMessage", value: "Invalid username or password"})
            }
        }catch(e){
            console.log("There was a problem")
        }
    }

  return (
    <div className="popup-box fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50">
    <div className="popup-content relative w-3/4 my-0 mx-auto h-auto max-h-[70vh] bg-[#F6F9FF] mt-[10vh] rounded-xl min-h-[500px] flex">

        <div className="task-left-column w-[70%] py-8 pt-5 px-16">
            <h2 className="task-title text-4xl text-bold">
                login
            </h2>
            <div className="task-body mt-10">
                <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
                    <div className="row align-items-center">
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
                        </div>
                        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                            <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
                        </div>
                        <div className="col-md-auto">
                            <button type="submit" className="py-3 px-7 mt-5 bg-[#5932EA] text-white rounded-xl">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="task-right-column w-[30%] bg-white rounded-tr-xl rounded-br-xl">
        </div>

    </div>
</div>
)
}

export default Login
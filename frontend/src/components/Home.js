import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import TaskNotDraggable from './Tasks-components/TaskNotDraggable'
import ProjectNotDraggable from './Projects-components/ProjectNotDraggable'
import StateContext from '../StateContext'
import Loader from './Loader'

function Home() {
  const [loading, setLoading] = useState(true)
  const appState = useContext(StateContext)
  const [taskDelete, setTaskDelete] = useState(0)
  const [projectDelete, setProjectDelete] = useState(0)
  const [todoTasks, setTodoTasks] = useState([])
  const [progressTasks, setProgressTasks] = useState([])
  const [projects, setProjects] = useState([])
  let projectNames = []
  const [allTasks, setAllTasks] = useState([])

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();

  const montNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData(){
        try{
            const todoTasks = await Axios.get('/tasks-todo', {cancelToken: ourRequest.token})
            const inprogressTasks = await Axios.get('/tasks-inprogress', {cancelToken: ourRequest.token})
            const allProjects = await Axios.get('/all-projects', {cancelToken: ourRequest.token})
            const alltasks = await Axios.get('/all-tasks', {cancelToken: ourRequest.token})
            setTodoTasks(todoTasks.data)
            setProgressTasks(inprogressTasks.data)
            setProjects(allProjects.data)
            setAllTasks(alltasks.data)
            setLoading(false)
        }
        catch(e){
            console.log("There was a problem or the request was canceled!")
        }
    }
    fetchData()
    return () => {
        ourRequest.cancel()
    }
  }, [taskDelete])

  let usertasks = allTasks.filter(task => task.assignee == appState.user.username)
  usertasks.forEach(name => {
    projectNames.push(name.project)
  })
  let customArray = projectNames.filter((x, i, a) => a.indexOf(x) == i)
  console.log(customArray)
  projectNames = customArray
  console.log(projectNames)

  if(loading) {
    return (
        <Loader />
    )
  }

  return (
    <div className='dashboard-container'>
      <div className="dashboard-header">
        <h3 className="font-semibold text-2xl">Today</h3>
        <h3 className="text-xl">{montNames[month] + " " + date + ", " + year}</h3>
      </div>
      <div className="dashboard-body w-full flex py-2 mb-7 mt-10">
        <div className="tasks-todo mr-3 w-1/3">
          <h3 className="font-semibold text-lg">Tasks To Do</h3>
          {todoTasks.filter(task => task.assignee == appState.user.username).map((task, index) => (
            <TaskNotDraggable task={task} index={index} statuss={task.statuss} key={task._id} setTaskDelete={setTaskDelete} taskDelete={taskDelete} />
          ))}
        </div>
        <div className="tasks-in-progress mx-3 w-1/3">
          <h3 className="font-semibold text-lg">Tasks In Progress</h3>
          {progressTasks.filter(task => task.assignee == appState.user.username).map((task, index) => (
            <TaskNotDraggable task={task} index={index} statuss={task.statuss} key={task._id} setTaskDelete={setTaskDelete} taskDelete={taskDelete} />
          ))}
        </div>
        <div className="projects mx-3 w-1/3">
          <h3 className="font-semibold text-lg">Projects working on</h3>
          {projects.filter(project => projectNames.includes(project.name)).map((project, index) => (
            <ProjectNotDraggable project={project} index={index} statuss={project.statuss} key={project._id} projectDelete={projectDelete} setProjectDelete={setProjectDelete} /> 
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
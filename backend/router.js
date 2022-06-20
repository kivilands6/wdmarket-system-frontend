const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const projectController = require('./controllers/projectController')
const taskController = require('./controllers/taskController')
const subtaskController = require('./controllers/subtaskController')
const cors = require("cors")

router.use(cors())
//home route
router.get('/', userController.home)
//fetch all of collection
router.get('/all-users', userController.fetchUsers)
router.get('/all-projects', projectController.fetchProjects)
router.get('/all-tasks', taskController.fetchTasks)
router.get('/all-subtasks', subtaskController.fetchSubtasks)
//project statuses
router.get("/projects-new", projectController.fetchNew)
router.get("/projects-inprogress", projectController.fetchInProgress)
router.get("/projects-completed", projectController.fetchCompleted)
//task statuses
router.get("/tasks-backlog", taskController.fetchBacklog)
router.get("/tasks-todo", taskController.fetchTodo)
router.get("/tasks-inprogress", taskController.fetchInprogress)
router.get("/tasks-testing", taskController.fetchTesting)
router.get("/tasks-done", taskController.fetchDone)


router.post("/checkToken", userController.checkToken)
router.post("/login", userController.apiLogin)
router.post('/register', userController.apiRegister)
router.post("/create-project", projectController.createProject)
router.post("/create-subtask", subtaskController.createSubtask)

router.post("/project-statuss-update", projectController.updateStatuss)
router.post("/project-access-update", projectController.updateAccess)
router.post("/subtask-value-update", subtaskController.updateValue)
router.post("/project-access", projectController.getAccess)

router.post("/create-task", taskController.createTask)
router.post("/task-statuss-update", taskController.updateStatuss)

//delete paths
router.post("/delete-subtask", subtaskController.deleteSubtask)
router.post("/delete-task", taskController.deleteTask)
router.post("/delete-project", projectController.deleteProject)
router.post("/delete-user", userController.deleteUser)

//Exist paths
router.post("/does-username-exist", userController.doesUsernameExist)
router.post("/does-email-exist", userController.doesEmailExist)
router.post("/does-projectname-exist", projectController.doesNameExist)



module.exports = router
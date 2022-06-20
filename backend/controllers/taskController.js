const Task = require('../models/Task')

exports.createTask = function (req, res) {
    let task = new Task(req.body)
    task
      .create()
      .then(() => {
        res.send("Task created successfully")
        console.log("task created")
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.updateStatuss = function (req, res) {
  let task = new Task(req.body)
  task
    .updateStatuss()
    .then(() => {
      res.send("Task updated successfully")
      console.log("task updated")
    })
    .catch(regErrors => {
        console.log("something went wrong")
      res.status(500).send(regErrors)
    })
}

exports.fetchTasks = function(req, res) {
  Task.fetchTasks()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

// FETCHING STATUSSES //

exports.fetchBacklog = function(req, res) {
  Task.fetchBacklog()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

exports.fetchTodo = function(req, res) {
  Task.fetchTodo()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

exports.fetchInprogress = function(req, res) {
  Task.fetchInprogress()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

exports.fetchTesting = function(req, res) {
  Task.fetchTesting()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

exports.fetchDone = function(req, res) {
  Task.fetchDone()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.json([])
    })
}

exports.deleteTask = function(req, res) {
  let task = new Task(req.body)
  task
    .delete()
    .then(() => {
      res.json("Success")
    })
    .catch(e => {
      res.json("You do not have permission to perform that action.")
    })
}
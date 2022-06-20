const Subtask = require('../models/Subtask')

exports.createSubtask = function (req, res) {
  console.log("inside controller")
  let subtask = new Subtask(req.body)
  subtask
    .create()
    .then(() => {
      res.send("Subtask created successfully")
    })
    .catch(regErrors => {
      res.status(500).send(regErrors)
    })
}

exports.fetchSubtasks = function(req, res) {
    console.log("inside fetch")
    Subtask.fetchSubtasks()
      .then(subtasks => {
        res.json(subtasks)
      })
      .catch(e => {
        res.json([])
      })
}

exports.updateValue = function (req, res) {
    console.log(req.body)
    let subtask = new Subtask(req.body)
    subtask
      .updateValue()
      .then(() => {
        res.send("subtask access updated successfully")
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.deleteSubtask = function(req, res) {
  console.log("inside controller")
  let subtask = new Subtask(req.body)
  subtask
    .delete()
    .then(() => {
      res.json("Success")
    })
    .catch(e => {
      res.json("You do not have permission to perform that action.")
    })
}
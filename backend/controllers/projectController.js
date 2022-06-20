const Project = require('../models/Project')

exports.createProject = function (req, res) {
    console.log("inside controller")
    let project = new Project(req.body)
    project
      .create()
      .then(() => {
        res.send("Project created successfully")
        console.log("project created")
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.updateStatuss = function (req, res) {
    console.log(req.body)
    let project = new Project(req.body)
    project
      .updateStatuss()
      .then(() => {
        res.send("Project updated successfully")
        console.log("project updated")
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.updateAccess = function (req, res) {
    console.log(req.body)
    let project = new Project(req.body, req.body.name)
    project
      .updateAccess()
      .then(() => {
        res.send("Project access updated successfully")
        console.log("project access updated")
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.getAccess = function (req, res) {
    let project = new Project(req.body, req.body.name)
    project
      .getAccess()
      .then((project) => {
        res.json(project)
        console.log(project)
      })
      .catch(regErrors => {
          console.log("something went wrong")
        res.status(500).send(regErrors)
      })
}

exports.fetchProjects = function(req, res) {
    console.log("inside fetch")
    Project.fetchProjects()
      .then(projects => {
        res.json(projects)
      })
      .catch(e => {
        res.json([])
      })
}

exports.fetchNew = function(req, res) {
    Project.fetchNew()
      .then(projects => {
        res.json(projects)
      })
      .catch(e => {
        res.json([])
      })
}

exports.fetchInProgress = function(req, res) {
    Project.fetchInProgress()
      .then(projects => {
        res.json(projects)
      })
      .catch(e => {
        res.json([])
      })
}

exports.fetchCompleted = function(req, res) {
    Project.fetchCompleted()
      .then(projects => {
        res.json(projects)
      })
      .catch(e => {
        res.json([])
      })
}

exports.deleteProject = function(req, res) {
  let project = new Project(req.body)
  console.log("inside controller")
  project
    .delete()
    .then(() => {
      res.json("Success")
    })
    .catch(e => {
      res.json("You do not have permission to perform that action.")
    })
}

exports.doesNameExist = async function (req, res) {
  let name = await Project.doesNameExist(req.body.name)
  res.json(name)
}
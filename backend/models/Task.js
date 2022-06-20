const taskCollection = require("../db").collection('tasks')
const validator = require('validator')
const ObjectID = require('mongodb').ObjectID

let Task = function(data) {
    this.data = data
    this.errors = []
}

Task.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {this.data.title = ""}
    if (typeof(this.data.project) != "string") {this.data.project = ""}
    if (typeof(this.data.priority) != "string") {this.data.priority = ""}
    if (typeof(this.data.content) != "string") {this.data.content = ""}
    if (typeof(this.data.assignee) != "string") {this.data.assignee = ""}

    //get rid of any bogus properties

    if(this.data.id) {
      this.data = {
          title: this.data.title.trim(),
          project: this.data.project,
          priority: this.data.priority,
          content: this.data.content,
          statuss: "Backlog",
          assignee: this.data.assignee,
          id: this.data.id,
      }
    } else if(this.data.projectId) {
        this.data = {
            title: this.data.title.trim(),
            project: this.data.project,
            priority: this.data.priority,
            content: this.data.content,
            statuss: "Backlog",
            assignee: this.data.assignee,
            projectId: this.data.projectId,
        }
    } else {
        this.data = {
            title: this.data.title.trim(),
            project: this.data.project,
            priority: this.data.priority,
            content: this.data.content,
            statuss: "Backlog",
            assignee: this.data.assignee,
        }
    }
}

Task.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        console.log(this.errors)
      
        if (!this.errors.length) {
          // hash user password
          await taskCollection.insertOne(this.data)
          resolve()
        } else {
          reject(this.errors)
        }
    })
}

Task.prototype.updateStatuss = function() {
    return new Promise(async (resolve, reject) => {
        if (!this.errors.length) {
            console.log(this.data.projectId)
            console.log(this.data.statuss)
            await taskCollection.updateOne(
                {_id: new ObjectID(this.data.projectId)},
                {$set: {statuss: this.data.statuss}}
            )
            resolve()
          } else {
            reject(this.errors)
          }
    })
}

Task.fetchTasks = function() {
    return new Promise(async (resolve, reject) => {
        let query = {}
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No projects were found")
      }
    })
}


// fetch for task statuss //

Task.fetchBacklog = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "Backlog" }
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No tasks were found")
      }
    })
}

Task.fetchTodo = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "To Do" }
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No tasks were found")
      }
    })
}

Task.fetchInprogress = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "In Progress" }
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No tasks were found")
      }
    })
}

Task.fetchTesting = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "Testing" }
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No tasks were found")
      }
    })
}

Task.fetchDone = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "Done" }
        let tasks = await taskCollection.find(query).toArray()
      if ( tasks ) {
        resolve(tasks)
      } else { 
        reject("No tasks were found")
      }
    })
}

Task.prototype.delete = function() {
  return new Promise(async (resolve, reject) => {
    try {
        await taskCollection.deleteOne({_id: new ObjectID(this.data.id)})
        resolve()
    } catch (e) {
      reject()
    }
  })
}

module.exports = Task
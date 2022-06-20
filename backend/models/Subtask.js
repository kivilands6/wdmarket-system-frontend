const subtaskCollection = require("../db").collection('subtasks')
const ObjectID = require('mongodb').ObjectID

let Subtask = function(data) {
    this.data = data
    this.errors = []
}

Subtask.prototype.cleanUp = function() {
    if (typeof(this.data.content) != "string") {this.data.content = ""}

    //get rid of any bogus properties

    if(this.data.id) {
        this.data = {
            content: this.data.content,
            value: this.data.value,
            taskId: this.data.taskId,
            id: this.data.id
        }
    } else {
        this.data = {
            content: this.data.content,
            value: false,
            taskId: this.data.taskId,
        }
    }
}

Subtask.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        console.log(this.errors)
      
        if (!this.errors.length) {
          await subtaskCollection.insertOne(this.data)
          resolve()
        } else {
          reject(this.errors)
        }
    })
}

Subtask.prototype.updateValue = function() {
    return new Promise(async (resolve, reject) => {
        if (!this.errors.length) {
            await subtaskCollection.updateOne(
                {_id: new ObjectID(this.data.id)},
                {$set: {value: this.data.value}}
            )
            resolve()
          } else {
            reject(this.errors)
          }
    })
}

Subtask.prototype.updateContent = function() {
    return new Promise(async (resolve, reject) => {
        if (!this.errors.length) {
            await subtaskCollection.updateOne(
                {_id: new ObjectID(this.data.id)},
                {$set: {content: this.data.content}}
            )
            resolve()
          } else {
            reject(this.errors)
          }
    })
}

Subtask.fetchSubtasks = function() {
    return new Promise(async (resolve, reject) => {
        let subtasks = await subtaskCollection.find({}).toArray()
      if ( subtasks ) {
        resolve(subtasks)
      } else { 
        reject("No subtasks were found")
      }
    })
}

Subtask.prototype.delete = function() {
  return new Promise(async (resolve, reject) => {
    try {
        await subtaskCollection.deleteOne({_id: new ObjectID(this.data.id)})
        resolve()
    } catch (e) {
      reject()
    }
  })
}

module.exports = Subtask
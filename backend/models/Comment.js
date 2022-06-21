const commentCollection = require("../db").collection('comments')
const ObjectID = require('mongodb').ObjectID

let Comment = function(data) {
    this.data = data
    this.errors = []
}

Comment.prototype.cleanUp = function() {
    if (typeof(this.data.content) != "string") {this.data.content = ""}

    //get rid of any bogus properties
    this.data = {
        content: this.data.content,
        date: new Date().toLocaleDateString("en-GB"),
        taskId: this.data.taskId,
        user: this.data.user
    }
}

Comment.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        console.log(this.errors)
      
        if (!this.errors.length) {
          await commentCollection.insertOne(this.data)
          resolve()
        } else {
          reject(this.errors)
        }
    })
}

Comment.fetchComments = function() {
    return new Promise(async (resolve, reject) => {
        let comments = await commentCollection.find({}).toArray()
      if ( comments ) {
        resolve(comments)
      } else { 
        reject("No comments were found")
      }
    })
}

module.exports = Comment
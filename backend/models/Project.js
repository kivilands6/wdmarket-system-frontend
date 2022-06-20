const projectCollection = require("../db").collection('projects')
const validator = require('validator')
const ObjectID = require('mongodb').ObjectID

let Project = function(data, queryFilterName) {
    this.data = data
    this.errors = []
    this.queryFilter = queryFilterName
}

Project.prototype.cleanUp = function() {
    if (typeof(this.data.name) != "string") {this.data.name = ""}
    if (typeof(this.data.price) != "string") {this.data.price = ""}
    if (typeof(this.data.link) != "string") {this.data.link = ""}
    if (typeof(this.data.startDate) != "string") {this.data.startDate = ""}
    if (typeof(this.data.endDate) != "string") {this.data.endDate = ""}

    //get rid of any bogus properties
    if(this.data.access) {
        this.data = {
            name: this.data.name,
            access: this.data.access,
        }

    } else if(this.data.projectId) {
        this.data = {
            name: this.data.name.trim(),
            price: this.data.price.trim(),
            link: this.data.link.trim(),
            startDate: this.data.startDate,
            endDate: this.data.endDate,
            access: "",
            statuss: "New",
            projectId: this.data.projectId,
        }
    } else {
        this.data = {
            name: this.data.name.trim(),
            price: this.data.price.trim(),
            link: this.data.link.trim(),
            startDate: this.data.startDate,
            endDate: this.data.endDate,
            access: "",
            statuss: "New",
        }
    }
}

Project.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.name == "") {this.errors.push("You must provide a project name.")}
        if (this.data.name != "" && !validator.isAlphanumeric(this.data.name)) {this.errors.push("Project name can only contain letters and numbers.")}
        if (this.data.name.length > 0 && this.data.name.length < 3) {this.errors.push("Project name must be at least 3 characters.")}
        if (this.data.name.length > 50) {this.errors.push("Project name cannot exceed 50 characters.")}
      
        // Only if username is valid then check to see if it's already taken
        if (this.data.name.length > 2 && this.data.name.length < 51 && validator.isAlphanumeric(this.data.name)) {
          let projectExists = await projectCollection.findOne({name: this.data.name})
          if (projectExists) {this.errors.push("That name is already taken.")}
        }
      
        resolve()
      })
}

Project.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        console.log("inside module")
        // Step #1: Validate user data
        this.cleanUp()
        await this.validate()
        console.log(this.errors)
      
        // Step #2: Only if there are no validation errors 
        // then save the project data into a database
        if (!this.errors.length) {
          // hash user password
          await projectCollection.insertOne(this.data)
          resolve()
        } else {
          reject(this.errors)
        }
    })
}

Project.prototype.updateStatuss = function() {
    return new Promise(async (resolve, reject) => {
        if (!this.errors.length) {
            console.log(this.data.projectId)
            console.log(this.data.statuss)
            await projectCollection.updateOne(
                {_id: new ObjectID(this.data.projectId)},
                {$set: {statuss: this.data.statuss}}
            )
            resolve()
          } else {
            reject(this.errors)
          }
    })
}

Project.prototype.updateAccess = function() {
    return new Promise(async (resolve, reject) => {
        if (!this.errors.length) {
            console.log(this.data.name)
            console.log(this.data.access)
            console.log(this.data)
            await projectCollection.updateOne(
                {name: this.queryFilter},
                {$set: {access: this.data.access}}
            )
            console.log("done")
            resolve()
          } else {
            reject(this.errors)
          }
    })
}

Project.prototype.getAccess = function() {
    return new Promise(async (resolve, reject) => {
        let query = {name: this.queryFilter}
        let projects = await projectCollection.find(query).toArray()
      if ( projects ) {
        resolve(projects)
      } else { 
        reject("No projects were found")
      }
    })
}

Project.fetchProjects = function() {
    return new Promise(async (resolve, reject) => {
        let query = {}
        let projects = await projectCollection.find(query).toArray()
      if ( projects ) {
        resolve(projects)
      } else { 
        reject("No projects were found")
      }
    })
}

Project.fetchNew = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "New" }
        let projects = await projectCollection.find(query).toArray()
      if ( projects ) {
        resolve(projects)
      } else { 
        reject("No projects were found")
      }
    })
}

Project.fetchInProgress = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "In progress" }
        let projects = await projectCollection.find(query).toArray()
      if ( projects ) {
        resolve(projects)
      } else { 
        reject("No projects were found")
      }
    })
}

Project.fetchCompleted = function() {
    return new Promise(async (resolve, reject) => {
        let query = { statuss: "Completed" }
        let projects = await projectCollection.find(query).toArray()
      if ( projects ) {
        resolve(projects)
      } else { 
        reject("No projects were found")
      }
    })
}

Project.prototype.delete = function() {
  console.log(this.data.projectId)
  return new Promise(async (resolve, reject) => {
    try {
        await projectCollection.deleteOne({_id: new ObjectID(this.data.projectId)})
        resolve()
    } catch (e) {
      reject()
    }
  })
}

Project.doesNameExist = function(name) {
  return new Promise(async function(resolve, reject) {
    if (typeof(name) != "string") {
      resolve(false)
      return
    }
    console.log("inside module")

    let project = await projectCollection.findOne({name: name})
    if (project) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

module.exports = Project
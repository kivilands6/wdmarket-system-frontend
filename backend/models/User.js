const usersCollection = require("../db").collection('users')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const ObjectID = require('mongodb').ObjectID

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.login = function() {
    console.log("inside login")
    return new Promise( (resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser
                resolve("Congrats!")
            } else {
                console.log("rejected")
            reject("Invalid username / password.")
            }
        }).catch(function(e) {
            console.log("rejected in catch")
            reject("Please try again later.")
        })
    })
}

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}
    if (typeof(this.data.name) != "string") {this.data.name = ""}
    if (typeof(this.data.surname) != "string") {this.data.surname = ""}
    if (typeof(this.data.phone) != "string") {this.data.phone = ""}
    if (typeof(this.data.address) != "string") {this.data.address = ""}

    //get rid of any bogus properties
    if(this.data.id) {
      this.data = {
        id: this.data.id
      }
    } else {
      this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password,
        name: this.data.name,
        surname: this.data.surname,
        admin: false,
        phone: this.data.phone.trim(),
        address: this.data.address,
        joinedDate: new Date().toLocaleDateString("en-GB"),
      }
    }
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {this.errors.push("You must provide a username.")}
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
        if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
        if (this.data.password == "") {this.errors.push("You must provide a password.")}
        if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
        if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
        if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
        if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
      
        // Only if username is valid then check to see if it's already taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
          let usernameExists = await usersCollection.findOne({username: this.data.username})
          if (usernameExists) {this.errors.push("That username is already taken.")}
        }
      
        // Only if email is valid then check to see if it's already taken
        if (validator.isEmail(this.data.email)) {
          let emailExists = await usersCollection.findOne({email: this.data.email})
          if (emailExists) {this.errors.push("That email is already being used.")}
        }
        resolve()
      })
}

User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        // Step #1: Validate user data
        this.cleanUp()
        await this.validate()
      
        // Step #2: Only if there are no validation errors 
        // then save the user data into a database
        if (!this.errors.length) {
          // hash user password
          let salt = bcrypt.genSaltSync(10)
          this.data.password = bcrypt.hashSync(this.data.password, salt)
          await usersCollection.insertOne(this.data)
          resolve()
        } else {
          reject(this.errors)
        }
    })
}

User.fetchUsers = function() {
    return new Promise(async (resolve, reject) => {
        let query = {}
        let users = await usersCollection.find(query).toArray()
      if ( users ) {
        resolve(users)
      } else { 
        reject("No users were found")
      }
    })
}

User.prototype.delete = function() {
  return new Promise(async (resolve, reject) => {
    try {
        await usersCollection.deleteOne({_id: new ObjectID(this.data.id)})
        resolve()
    } catch (e) {
      reject()
    }
  })
}

User.doesUsernameExist = function(username) {
  return new Promise(async function(resolve, reject) {
    if (typeof(username) != "string") {
      resolve(false)
      return
    }

    let user = await usersCollection.findOne({username: username})
    if (user) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

User.doesEmailExist = function(email) {
  return new Promise(async function(resolve, reject) {
    if (typeof(email) != "string") {
      resolve(false)
      return
    }

    let user = await usersCollection.findOne({email: email})
    if (user) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

module.exports = User
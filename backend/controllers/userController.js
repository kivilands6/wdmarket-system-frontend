const User = require('../models/User')
const jwt = require("jsonwebtoken")

// how long a token lasts before expiring
const tokenLasts = "365d"

//Check if web token has expired
exports.checkToken = function (req, res) {
    try {
      req.apiUser = jwt.verify(req.body.token, "secretkeyappearshere")
      res.json(true)
    } catch (e) {
      res.json(false)
    }
}

exports.apiLogin = function (req, res) {
    let user = new User(req.body)
    console.log("alert")
    user
      .login()
      .then(function (result) {
        res.json({
          token: jwt.sign({ _id: user.data._id, username: user.data.username, avatar: user.avatar }, "secretkeyappearshere", { expiresIn: tokenLasts }),
          username: user.data.username,
          avatar: user.avatar,
          email: user.data.email,
          name: user.data.name,
          surname: user.data.surname,
          phone: user.data.phone,
          address: user.data.address,
          joinedDate: user.data.joinedDate,
          admin: user.data.admin
        })
      })
      .catch(function (e) {
        res.json(false)
      })
  }

exports.login = () => {

}

exports.logout = () => {
    
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register()
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congrats there are no errors")
    }
}

exports.apiRegister = function (req, res) {
    let user = new User(req.body)
    user
      .register()
      .then(() => {
        res.json({
          username: user.data.username,
          email: user.data.email,
          password: user.data.password
        })
      })
      .catch(regErrors => {
        res.status(500).send(regErrors)
      })
}

exports.fetchUsers = function(req, res) {
    User.fetchUsers()
      .then(users => {
        res.json(users)
      })
      .catch(e => {
        res.json([])
      })
}

exports.home = (req, res) => {
    res.send('Welcome to the backend of the system :)')
}

exports.deleteUser = function(req, res) {
  let user = new User(req.body)
  user
    .delete()
    .then(() => {
      res.json("Success")
    })
    .catch(e => {
      res.json("There was a problem deleting user")
    })
}

exports.doesUsernameExist = async function (req, res) {
  let userBool = await User.doesUsernameExist(req.body.username)
  res.json(userBool)
}

exports.doesEmailExist = async function (req, res) {
  let emailBool = await User.doesEmailExist(req.body.email)
  res.json(emailBool)
}
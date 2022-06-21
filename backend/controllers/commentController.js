const Comment = require('../models/Comment')

exports.createComment = function (req, res) {
    let comment = new Comment(req.body)
    comment
      .create()
      .then(() => {
        res.send("Comment created successfully")
      })
      .catch(regErrors => {
        res.status(500).send(regErrors)
      })
  }

exports.fetchComments = function(req, res) {
    Comment.fetchComments()
        .then(comments => {
        res.json(comments)
        })
        .catch(e => {
        res.json([])
        })
}
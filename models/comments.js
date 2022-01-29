const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('comment', commentSchema)
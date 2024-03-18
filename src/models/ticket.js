const { model, Schema } = require('mongoose')

module.exports = model("ticket", new Schema({
   
    Guild: String,
    Title: String,
    Description: String,
    Channel: String

}))
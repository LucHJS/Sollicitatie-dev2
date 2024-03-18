const { model, Schema } = require('mongoose')

module.exports = model("ticketsetup", new Schema({
   
    GuildId: String,
    Channel: String,
    Category: String,
    Transcript: String,
    Handlers: String,
    Description: String
}))
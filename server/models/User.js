// Load required packages
var mongoose = require('mongoose');

//Schema
var User_Schema = new mongoose.Schema({
  name: { type: String }
, email: String
, pendingTasks: [String]
, dateCreated: { type: Date, default: Date.now }
});


// Export the Mongoose model
module.exports =  mongoose.model('User', User_Schema);
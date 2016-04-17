// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var Task_Schema = new mongoose.Schema({
  name: { type: String }
, description: String
, deadline: { type: Date }
, completed: {type : Boolean }
, assignedUser: String
, assignedUserName: String
, dateCreated: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('Task', Task_Schema);
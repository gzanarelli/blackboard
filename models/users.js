var mongoose = require('mongoose');


var TaskSchema = mongoose.Schema({
    name : String,
    description: String,
    category: String, // sav, transport, remboursement, question
    owner: String,
    date_insert: Date,
    date_due: Date,
    date_cloture: Date
   });


var MessageSchema = mongoose.Schema({
   title : String,
   content: String,
   date_exp: Date,
   read: Boolean,
   sender: String
  });


var UserSchema = mongoose.Schema({
    firstName : String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    status: String,
    gender: String, // male, female
    date_insert: Date, // New prop
    messages:[MessageSchema],
    tasks:[TaskSchema]
   });

module.exports = mongoose.model('users', UserSchema);

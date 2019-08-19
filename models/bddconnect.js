var mongoose = require('mongoose');

var user = 'admin';
var password = 'azerty1';
var port = 47410;
var bddname = 'blackboardsandbox';

var options = { connectTimeoutMS: 5000, useNewUrlParser: true }

mongoose.connect(
  "mongodb://"+user+":"+password+"@ds2"+port+".mlab.com:"+port+"/"+bddname,
  options,
  function(error){
   console.log(error);
  }
);

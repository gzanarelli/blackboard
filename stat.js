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



var OrderSchema = mongoose.Schema({
    total : Number,
    shipping_cost: Number,
    date_insert: Date,
    status_payment: String, // waiting, valided, refused
    date_payment: Date,
    status_shipment: Boolean,
    date_shipment: Date,
    delivery_address: String,
    delivery_city: String,
    delivery_zipcode: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }]
   });

var OrderModel = mongoose.model('orders', OrderSchema);


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

var UserModel = mongoose.model('users', UserSchema);


// Nombre d'inscrit / mois
// var aggregate = UserModel.aggregate();
// aggregate.group({_id: { year: {$year: '$date_insert'}, month: { $month: '$date_insert'} }, usercount: { $sum: 1 } });
// aggregate.exec(function(err, data) {
//   console.log(data);
// });


// Panier moyen des commandes payées par mois
// var aggregate = OrderModel.aggregate();
// aggregate.match({"status_payment": "valided"})
// aggregate.group({ _id: { year: {$year: '$date_insert'}, month: { $month: '$date_insert'} }, panier_moyen: { $avg: "$total" } });
// aggregate.exec(function(err, data) {
//   console.log(data);
// });


//le nombre et le CA des commandes payées et expédiées par jour
// var aggregate = OrderModel.aggregate();
// aggregate.match({"status_payment": "valided", "status_shipment": true})
// aggregate.group({ _id: { year: {$year: '$date_insert'}, month: { $month: '$date_insert'}, day: { $dayOfMonth: '$date_insert'}  }, ca: { $sum: "$total" }, count: { $sum: 1 } });
// aggregate.exec(function(err, data) {
//   console.log(data);
// });


//Nombre d'inscrit par mois et par sexe
var aggregate = UserModel.aggregate();
aggregate.group({_id: { year: {$year: '$date_insert'}, month: { $month: '$date_insert'} , gender: '$gender'}, usercount: { $sum: 1 }});
aggregate.exec(function(err, data) {
  console.log(data);
});

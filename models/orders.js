var mongoose = require('mongoose');


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

module.exports = mongoose.model('orders', OrderSchema);

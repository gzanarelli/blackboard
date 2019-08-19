var mongoose = require('mongoose');

var ArticlesSchema = mongoose.Schema({
    title : String,
    description: String,
    price: Number,
    stock: Number,
    weight: Number,
    img: String
   });

module.exports = mongoose.model('articles', ArticlesSchema);

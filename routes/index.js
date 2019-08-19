var UserModel     = require('../models/users');
var ArticleModel  = require('../models/articles');
var OrderModel    = require('../models/orders');


var express = require('express');
var router = express.Router();

function dateFormat(date) {
  var date = new Date(date);
  var format = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
  return format;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});


router.get('/users-page', function(req, res, next) {
  UserModel.find(function(err, users){
    res.render('users', {dateFormat, users});
  });

});

router.get('/catalog-page', function(req, res, next) {
  ArticleModel.find(function(err, articles){
    res.render('catalog', {articles});
  });
});


router.get('/order-list-page', function(req, res, next) {
  OrderModel.find(function(err, orders){
    res.render('order-list', { dateFormat, orders });
  });
});

router.get('/order-page', function(req, res, next) {
  OrderModel.findById(req.query.id)
  .populate("user")
  .populate("articles")
  .exec(function(err, order){
    console.log(order)
    res.render('order', { dateFormat, order });
  });
});

router.get('/messages-page', function(req, res, next) {
  // WARNING : YOU NEED HERE TO PUT THE ID OF AN ADMIN USER FROM THE DATABASE
  UserModel.findById("5c52e856abc36cf9293b2175", // select admin ID
  function(err, user){
    res.render('messages', {dateFormat, messagesList : user.messages});
  })
});

router.get('/tasks-page', function(req, res, next) {
  // YOU NEED HERE TO PUT THE ID OF AN ADMIN USER FROM THE DATABASE
  UserModel.findById("5c52e856abc36cf9293b2175", // select admin ID
  function(err, user){
    res.render('tasks', {dateFormat, tasksList : user.tasks});
  })
});


/* POST users route. */
router.post('/user', function(req, res, next) {

  var newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    status: req.body.status,
    gender: req.body.gender,
    date_insert: req.body.date_insert
  });

  newUser.save(
    function(err, user){
      if (err) {
        console.log(err)
      } else {
        console.log("USER SAVED --> ", user )
      }
      res.render('home');
    }
  )
});

/* POST articles route. */
router.post('/article', function(req, res, next) {

  var newArticle = new ArticleModel({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    weight: req.body.weight,
    img: req.body.img
  });

  newArticle.save(
    function(err, article){
      if (err) {
        console.log(err)
      } else {
        console.log("ARTICLE SAVED --> ", article )
      }
      res.render('home');
    }
  )
});

router.post('/message', function(req, res, next) {
  UserModel.findById(req.body.id, function(err, user){
    user.messages.push({
      title : req.body.title,
      content: req.body.content,
      date_exp: req.body.date_exp,
      read: req.body.read,
      sender: req.body.sender
    });
    user.save(function(err, user){
      if(err){
        console.log(err)
      } else {
        console.log("MESSAGE IN USER SAVED --> ", user )
      }
      res.render('home');
    });

  });
});


router.post('/task', function(req, res, next) {
  UserModel.findById(req.body.id, function(err, user){
    user.tasks.push({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      owner: req.body.owner,
      date_insert: req.body.date_insert,
      date_due: req.body.date_due,
      date_cloture: req.body.date_cloture
    });
    user.save(function(err, user){
      if(err){
        console.log(err)
      } else {
        console.log("TASK IN USER SAVED --> ", user)
      }
      res.render('home');
    });

  });

});


router.post('/order', function(req, res, next) {

  var order = new OrderModel({
    total : req.body.total,
    shipping_cost: req.body.shipping_cost,
    date_insert: req.body.date_insert,
    status_payment: req.body.status_payment,
    date_payement: req.body.date_payement,
    status_shipment: req.body.status_shipment,
    date_shipment: req.body.date_shipment,
    delivery_address: req.body.delivery_address,
    delivery_city: req.body.delivery_city,
    delivery_zipcode: req.body.delivery_zipcode,
    user: req.body.user_id,
  });
  order.save(function(err, user){
    console.log(err);
    res.render('home');
  });
});

router.post('/order-article', function(req, res, next) {
  OrderModel.findById(req.body.id, function(err, order){
    order.articles.push(req.body.article_id);
    order.save(function(err, order){
      res.render('home');
    });
  });
});


router.get('/dataviz',  async function(req, res, next) {

    var request = ArticleModel.find();
    request.gt("stock", 0)
    var articlesCount = await request.exec().length;

    // WARNING : YOU NEED HERE TO PUT THE ID OF AN ADMIN USER FROM THE DATABASE
    var request = UserModel.findById("5c52e856abc36cf9293b2175");
    var user = await request.exec();
    var adminCountMessage = 0;
    for(var i=0; i<user.messages.length; i++){
      if(user.messages[i].read == false){
        adminCountMessage++; // adminCountMessage = adminCountMessage + 1;
      }
    }

    var adminCountTask = 0;
    for(var i=0; i<user.tasks.length; i++){
      if(!user.tasks[i].date_cloture){
        adminCountTask++; // adminCountTask = adminCountTask + 1;
      }
    }


    var request = OrderModel.find();
    request.and(([{status_payment : 'valided'} , {status_shipment : false}]))
    var orderValidedNotShip = await request.exec().length;

    var aggregate = UserModel.aggregate();
    aggregate.group({_id: {year_inscription: {$year: "$date_insert"}, month_inscription: {$month: "$date_insert"}}, usercount: { $sum : 1}  })
    aggregate.sort({_id: 1});
    var userCountByMonth = await aggregate.exec();

    var aggregate = UserModel.aggregate();
    aggregate.group({_id: {year_inscription: {$year: "$date_insert"}, month_inscription: {$month: "$date_insert"} , gender: '$gender'  }, usercount: { $sum : 1}  })
    var userGenderCountByMonth = await aggregate.exec();

    var aggregate = OrderModel.aggregate();
    aggregate.group({_id: {year_inscription: {$year: "$date_insert"}, month_inscription: {$month: "$date_insert"}  }, averbasket: { $avg : "$total"}  });
    var ordersAvgByMonth = await aggregate.exec();

    var aggregate = OrderModel.aggregate();
    aggregate.match( {"status_payment": "valided", "status_shipment": true} );
    aggregate.group({_id: {year_order: {$year: "$date_insert"}, month_order: {$month: "$date_insert"}  }, countOrder: {$sum : 1}, totalCA: {$sum : "$total"} });
    var totalCAByMonth = await aggregate.exec();

    var aggregate = OrderModel.aggregate();
    aggregate.group({_id: {year_order: {$year: "$date_insert"}, month_order: {$month: "$date_insert"} , day_order: {$dayOfMonth: "$date_insert"} }, countOrder: {$sum : 1}});
    var totalCmdByMonth = await aggregate.exec();

    res.render("chart", {articlesCount, adminCountMessage, adminCountTask, orderValidedNotShip, userCountByMonth, userGenderCountByMonth, ordersAvgByMonth, ordersAvgByMonth, totalCAByMonth, totalCmdByMonth});

});

module.exports = router;

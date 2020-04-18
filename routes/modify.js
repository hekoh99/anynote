var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var modi = require('../lib/modi');

router.get('/create/:cTopicID', function(request, response){
  var isAuth = auth.check(request, response);
  modi.create(request, response);
})
router.post('/create_process', function(request, response){
  modi.create_process(request, response);
})
router.get('/update/:utargetID', function(request, response){
  var isAuth = auth.check(request, response);
  modi.update(request, response);
})
router.post('/update_process', function(request, response){
  modi.update_process(request, response);
})
router.post('/delete_process', function(request, response){
  modi.delete_process(request, response);
})

module.exports = router;

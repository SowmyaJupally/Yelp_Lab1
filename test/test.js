var app = require('../Backend/index.js');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;
 
var agent = require('chai').request.agent(app);
 
describe('Yelp ', function(){
 
   it('GET /searchrestaurants/_ - searching all restaurants with "_',function(done){
       agent.get('/searchrestaurants/_ ')
           .then(function(res){
               console.log('res',JSON.parse(res.text).length)
               expect((JSON.parse(res.text)).length).to.equal(1);
               done();
           })
           .catch((e) => {
               done(e);
           });
   });
   it('GET /items - Verifying all items for a particular restaurant',function(done){
       agent.get('/items/1')
           .then(function(res){
               //console.log('res',res.text)
               expect(JSON.parse(res.text).length).to.equal(4);
               done();
           })
           .catch((e) => {
               done(e);
           });
   });
   it('GET /pendingorders/4 - Verifying no of pending orders per user',function(done){
       agent.get('/pendingorders/4')
           .then(function(res){
               //console.log('res',res.body)
               expect(JSON.parse(res.text).length).to.equal(1)
               done();
           })
           .catch((e) => {
               done(e);
           });
   });
 
   it('GET /completedorders/4 - Verifying no of completed orders per user',function(done){
       agent.get('/completedorders/3')
           .then(function(res){
               console.log('complted orders',res.text)
               expect(res.text).to.equal("NO_COMPLETED_ORDERS")
               done();
           })
           .catch((e) => {
               done(e);
           });
   });
 
   it('GET /sectionitem - Verifying no of section items for restauarant',function(done){
       agent.get('/sectionitem/1')
           .then(function(res){
               console.log('res section item',JSON.parse(res.text))
               expect(JSON.parse(res.text).menu_section_id).to.equal(1)
               done();
           })
           .catch((e) => {
               done(e);
           });
   });
})

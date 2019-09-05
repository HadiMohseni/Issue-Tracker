/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB; //
mongoose.connect(process.env.DB, {useNewUrlParser: true})
  .then(() => console.log('Connected'))
  .catch(error => console.log(error));


var Schema = mongoose.Schema;

var issue = new Schema({issue_title:{type:String}, issue_text:{type:String}, created_on:{type:Date}, updated_on:{type:Date},
                        created_by:{type:String}, assigned_to:{type:String}, open:{type:Boolean},
                        status_text:{type:String}, project_name:{type:String}});
var Issue = mongoose.model('Issue',issue);
var project;
module.exports = function (app) {

  app.route('/api/issues/:project?')
  
    .get(function (req, res){
      project = req.params.project;
      var fields = req.query;
      fields.project_name = project;
      console.log(fields);
      Issue.find(fields,function (err, data) {
        res.json({data});
      })  
    })
    
    .post(function (req, res){
      //var project = req.params.project;
      console.log(project);
      console.log(req.body.issue_title);
      var newIssue = new Issue({issue_title:req.body.issue_title, issue_text:req.body.issue_text, created_on:new Date(), updated_on:new Date(),
                                created_by:req.body.created_by, assigned_to:req.body.assigned_to, open:true,
                                status_text:req.body.status_text, project_name:project});
      newIssue.save(function (err, newIssue) {
                          if (err) return console.error(err);
                          console.log(newIssue.issue_title+' saved sucessfully.');
                          res.json(newIssue);
                      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      if(req.body._id.length == 24){
          Issue.find({_id:req.body._id},function(err,data){
            var update = false;
            if (err) return console.error(err);
             //console.log(req.body._id.length);
            if(data == []){
              console.log('no data!');
              res.json({status:'could not update '+String(req.body._id)});
            }else{console.log('data isn\'t empty!');}

            if(req.body.issue_title){
             Issue.findOneAndUpdate({_id:req.body._id}, {issue_title:req.body.issue_title, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
              update = true;
            }

            if(req.body.issue_text){
             Issue.findOneAndUpdate({_id:req.body._id}, {issue_text:req.body.issue_text, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
              update = true;
            }

            if(req.body.created_by){
             Issue.findOneAndUpdate({_id:req.body._id}, {created_by:req.body.created_by, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
            update = true;
            }

            if(req.body.assigned_to){
             Issue.findOneAndUpdate({_id:req.body._id}, {assigned_to:req.body.assigned_to, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
            update = true;
            }

            if(req.body.status_text){
             Issue.findOneAndUpdate({_id:req.body._id}, {status_text:req.body.status_text, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
            update = true;
            }

            //console.log(req.body.open == 'false');
            if(req.body.open == 'false'){
             Issue.findOneAndUpdate({_id:req.body._id}, {open:false, updated_on:new Date()},{new:true},function (err,data) {    
                                                                                              if (err) return console.error(err);
                });
            update = true;
            }

            if(update){
                Issue.find({_id:req.body._id},function(err,data){
                                                if (err) return console.error(err);
                                                res.json(data);})
            } else{
              res.json({status:'no updated field sent'})
            }
          })
        }else{
            console.log('could not');
            res.json({status:'could not update '+String(req.body._id)});
        }
    })
    
    .delete(function (req, res){
      console.log('delete is runing...');
      var project = req.params.project;
            if(!req.body._id){
              res.json({status:'no _id'});
            }     
            Issue.findByIdAndRemove({_id:req.body._id},function (err,data) {    
                                                console.log('findByIdAndRemove runs');
                                                if (err){
                                                  res.json({status:'could not delete '+String(req.body._id)});
                                                  return console.error(err);
                                                  }
                                                if(data == []){
                                                        console.log('cloud not delete');
                                                        res.json({status:'could not delete '+String(req.body._id)});
                                                }else{
                                                        console.log('deleted');
                                                        res.json({status:'deleted '+String(req.body._id)});     
                                                }              
                                      })      
    });
    
};
 
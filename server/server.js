// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var bodyParser = require('body-parser');
var router = express.Router();



var user = require('./models/User');
var task = require('./models/Task');


//replace this with your Mongolab URL
mongoose.connect('mongodb://ykim103:1234QWer@ds047325.mlab.com:47325/cs498rk_ykim103');


function isempty(check){
	if ( typeof check !== 'undefined' && check )
	{
 		return check;
	}
	else
	{
		return "{ }";
	}
}



// Create our Express application
var app = express();
var db = mongoose.connection;
// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");


   
    
      next();
    
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route
var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});

//Add more routes here


	var usersRoute = router.route('/users');

	usersRoute.get(function(req, res) {
		var query = req.query;

    	


    	if(JSON.stringify(query) === '{}'){
			 user.find(function(err, users) {
	            if (err){
	                res.status(500).send({message: 'Server ERROR'});
	            }

	            else{


	            var result = {};
	            result.message = 'OK';
	            result.data = users;
	            res.status(200).json(result);
	        }
	        });
		}

		else{
			var where = isempty(query.where); 
			var sort = isempty(query.sort);
			var skip =  query.skip;
			var limit = query.limit;
			var select = isempty(query.select);
		
			var js_where = JSON.parse(where);
			var js_sort = JSON.parse(sort);
			var js_skip = 0 || skip;
			var js_limit = 0 || limit;
			var js_select = JSON.parse(select);
			

			var options = {
			    "limit": js_limit,
			    "skip": js_skip,
			    "sort": js_sort
			};
			user.find(js_where, js_select, options, function(err, data){
				if (err){
                	res.status(404).send({message: 'User Not Found'});
	            }
	            else{
	            	
	            	if(query.count == "true"){

	            		res.json({ message: 'OK' , data: data.length});
	            	}
	            	else{
	           	 		res.json({ message: 'OK' , data: data});
	            	}
	        	}
			});




			
			
		}


	});

	usersRoute.post(function(req, res) {

        var new_user = new user();      
        new_user.name = req.body.name;
        new_user.email = req.body.email;

       	user.find({email : req.body.email}, function(err, docs){
       		if(docs.length){
       			console.log(docs.length);
        		res.json({ message: 'OK', condition : "Already registered", data: new_user});
       		}
       		else{
        
		        new_user.save(function(err, data) {
		            if (err){
		                res.status(500).send({message: 'Server ERROR'});
		            }
		            else{
		            	res.status(201).json({ message: 'OK' , condition : "Adding Succesfully" , data: new_user});
		            }
	        
	        });
		    }
       	});
        
        
    });





    var specific_user = router.route('/users/:user_id');

    specific_user.get(function(req, res, next) {
        user.findById(req.params.user_id, function(err, data) {
            if (err){

                res.status(404).send({message: 'User Not Found'});
            }
            else{
            	if(data==null){
            		res.status(404).send({message: 'User Not Found'});
            	}
            	else{
            		res.json({ message: 'OK' , data: data});
            	}
            	
        	}
        });
    });

    specific_user.put(function(req, res) {
    	user.findById(req.params.user_id, function(err, data) {
            if (err){

                res.status(404).send({message: 'User Not Found'});
            }
            else{     
		        data.name = req.body.name;
		        data.email = req.body.email;
		        data.pendingTasks = req.body.pendingTasks;  

		        data.save(function(err) {
	                if (err){
	                    res.send(err);
	                }
	                else{
	                res.json({ message: 'OK', data : data });

            }
            });

        	}
        });

    });


    specific_user.delete(function(req, res) {
    

        user.findOneAndRemove({
            _id: req.params.user_id
        }, function(err, data) {
           if (err){
                res.status(404).send({message: 'User Not Found'});
            }
            else{


            	if(data != null){
            		var pendinglist = data.pendingTasks;
	            	var i =0;
	            	for(i; i < pendinglist.length; i++){
	            		task.findById(pendinglist[i], function(err, taskdata){

	            			if(err){
	            				console.log(err);
	            			}

	            			else{
	            				if(taskdata){
	            					taskdata.assignedUser = "";
		            				taskdata.assignedUserName = "unassigned";
		            				taskdata.save(function(err, data) {
							            if (err){
							                console.log(err);
							            }
						        });

	            				}
	            				
	            			}
	            			
	            		});	
	            	}

            	user.find(function(err, users) {
	            if (err){
	                res.status(500).send({message: 'Server ERROR'});
	            }

	            else{
		            var result = {};
		            result.message = 'OK';
		            result.data = users;
		            res.status(200).json(result);
	        	}
	        });

            }
            	else{
            		 res.status(404).send({message: 'User Not Found'});
            	}
	            	
        	


        	}
        });
    });


	




	var tasksRoute = router.route('/tasks');

	tasksRoute.get(function(req, res) {
		var query = req.query;
		if(JSON.stringify(query) === '{}'){
		 task.find(function(err, tasks) {
            if (err){
                res.status(500).send({message: 'Server ERROR'});
            }
            else{
	            var result = {};
	            result.message = 'OK';
	            result.data = tasks;

	            res.json(result);
        	}
        });
		}
		else{
				var where = isempty(query.where); 
			var sort = isempty(query.sort);
			var skip =  query.skip;
			var limit = query.limit;
			var select = isempty(query.select);
			var count = query.count;

			var js_where = JSON.parse(where);
			var js_sort = JSON.parse(sort);
			var js_skip = 0 || skip;
			var js_limit = 0 || limit;
			var js_select = JSON.parse(select);

			var options = {
			    "limit": js_limit,
			    "skip": js_skip,
			    "sort": js_sort
			};
			task.find(js_where, js_select, options, function(err, data){
				if (err){
                	res.status(404).send({message: 'task Not Found'});
	            }
	            else{
	            	if(query.count === "true"){
	            		res.json({ message: 'OK' , data: data.length});
	            	}
	            	else{
	            		res.json({ message: 'OK' , data: data});
	            }
	        	}
			});

		}
	});







	/*name” - String
“description” - String
“deadline” - Date
“completed” - Boolean
“assignedUser” - String - The _id field of the user this task is assigned to - default “”
“assignedUserName” - String - The name field of the user this task is assigned to - default “unassigned”*/
	tasksRoute.post(function(req, res) {
        
        var new_task = new task();      
        new_task.name = req.body.name;
        new_task.description = req.body.description;
        new_task.deadline = req.body.deadline;  
        new_task.completed = req.body.completed;
        new_task.assignedUser = req.body.assignedUser;
        new_task.assignedUserName = req.body.assignedUserName;

        var add_new = req.body.add_new;

        if(new_task.assignedUser != ""){


        	new_task.save(function(err, data) {
            if (err){
                res.status(500).send({message: 'Server ERROR', condition : "Add Fail"});
            }
            else{

            	if(add_new == 1){
	            		user.findById(new_task.assignedUser, function(err, userdata) {
		            if (err){

		                res.status(404).send({message: 'User Not Found'});
		            }
		            else{     
				      
				        (userdata.pendingTasks).push(data._id);

				        userdata.save();

				        res.status(201).json({ message: 'OK' , data: data, condition : "Adding Succesfully"});
		        	}
		        	});
            	}
            	else{
            		res.status(201).json({ message: 'OK' , data: data, condition : "Adding Succesfully"});
            	}
            	

            	
        }
        });



        }
        else{
        	 new_task.save(function(err, data) {
            if (err){
                res.status(500).send({message: 'Server ERROR', condition : "Add Fail"});
            }
            else{
            	res.status(201).json({ message: 'OK' , data: data, condition : "Adding Succesfully"});
        }
        });
        }
       
        
    });

    var specific_task = router.route('/tasks/:task_id');

    specific_task.get(function(req, res, next) {
        task.findById(req.params.task_id, function(err, data) {
            if (err){

                res.status(404).send({message: 'task Not Found'});
            }
            else{
            	if(data==null){
            		 res.status(404).send({message: 'task Not Found'});
            	}
            	else{
            			res.json({ message: 'OK' , data: data});
            	}
            
        	}
        });
    });

    specific_task.put(function(req, res) {
    	task.findById(req.params.task_id, function(err, data) {
            if (err){

                res.status(404).send({message: 'task Not Found'});
            }
            else{ 

            	if(data==null){
            		 res.status(404).send({message: 'task Not Found'});
            	}    

            	else{
            		   data.name = req.body.name;
		        data.description = req.body.description;
		        data.deadline = req.body.deadline;  
		        data.completed = req.body.completed;
		        data.assignedUser = req.body.assignedUser;
		        data.assignedUserName = req.body.assignedUserName;
		        data.condition = "";
		        data.user_curr = req.body.current_assign;
		        //assign user currs
		        /****************
					assigned -> unassigned
					unassigned -> assigned
					assigned -> diffrent assigned
					assigned -> same assigne
		        ******************/
		    
		        if((data.assignedUser != data.user_curr)  && (data.assignedUserName != 'unassigned')){
		        	user.findById(data.assignedUser, function(err, userdata1) {
			            if (err){

			                res.status(404).send({message: 'User Not Found'});
			            }
			            else{     
					      	if(data.completed == false){
					        (userdata1.pendingTasks).push(data._id);

					        userdata1.save();
					    }
					    }
					});

		        	if(data.user_curr != ""){

		        		user.findById(data.user_curr, function(err, userdata2) {
			            if (err){

			                res.status(404).send({message: 'User Not Found'});
			            }
			            else{     
					      
					      var i = (userdata2.pendingTasks).indexOf(data._id);
					      if(i!=-1){
					      	(userdata2.pendingTasks).splice(i,1);

							
					        userdata2.save();
					      }

					    }
					});

		        	}
					


					data.save(function(err) {
	                if (err){

	                    res.send(err);
	                }
	                else{
	               
	                res.json({ message: "Edit Success", data : data });

		            }
		            });

		        }
		        else{
		        	if(data.completed == "true" && data.assignedUserName != "unassigned"){
		        		user.findById(data.assignedUser, function(err, userdata3) {
			            if (err){

			                res.status(404).send({message: 'User Not Found'});
			            }
			            else{     
					      
					      var i = (userdata3.pendingTasks).indexOf(data._id);
					      if(i!=-1){
					      	(userdata3.pendingTasks).splice(i,1);

							
					        userdata3.save();
					      }

					    }
						});
		        	}

		        	if(data.user_curr != ""){
		        		user.findById(data.user_curr, function(err, userdata4) {
			            if (err){

			                res.status(404).send({message: 'User Not Found'});
			            }
			            else{     
					      
					      var i = (userdata4.pendingTasks).indexOf(data._id);
					      if(i!=-1){
					      	(userdata4.pendingTasks).splice(i,1);

							
					        userdata4.save();
					      }

					    }
						});
		        	}
		        	


		        data.save(function(err) {
	                if (err){

	                    res.send(err);
	                }
	                else{
	            
	                res.json({ message: 'Edit Success', data : data});

		            }
		            });
		        }
		    

        	}

            	}
		     
        });

    });


    specific_task.delete(function(req, res) {
        task.remove({
            _id: req.params.task_id
        }, function(err, data) {
           if (err){
                res.status(404).send({message: 'task Not Found'});
            }
            else{
            	
            	 task.find(function(err, tasks) {
		            if (err){
		                res.status(500).send({message: 'Server ERROR'});
		            }
		            else{
			            var result = {};
			            result.message = 'OK';
			            result.data = tasks;

			            res.json(result);
		        	}
		        });
        	}
        });
    });
















// Start the server
app.listen(port);
console.log('Server running on port ' + port);

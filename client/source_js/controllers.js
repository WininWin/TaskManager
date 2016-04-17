var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UserListController', ['$scope', '$routeParams','$http', 'Users', 'Tasks', '$window' , function($scope, $routeParams, $http,  Users, Tasks, $window) {

  Users.get().success(function(result){
    $scope.users = result.data;
  });

   Tasks.get().success(function(result){
    $scope.tasks = result.data;
  });


  $scope.useremail = $routeParams.useremail;

  $scope.movetodetails = function(email){

    window.location = "#/userlist/" + email;
  };

  $scope.delete_user = function(userid){
     Users.delete(userid).success(function(result){
             Users.get().success(function(curr){
                $scope.users = curr.data;
              });
            
      });

  };

  $scope.move_to_add = function(){
      window.location = '#/adduser';

  };

  $scope.movetoCompleted = function(taskid, data_task, data_user){
    var completed = {};
    completed.name = data_task.name;
    completed.description = data_task.description;
    completed.deadline = data_task.deadline;  
    completed.completed = true;
    completed.assignedUser = data_task.assignedUser;
    completed.assignedUserName = data_task.assignedUserName;
    completed.current_assign = data_task.assignedUser;
      Tasks.put(taskid, completed).success(function(result){
        console.log("movetocompleted");
      });

    var user_update = {};
    user_update.name = data_user.name;
    user_update.email= data_user.email;
    user_update.pendingTasks = data_user.pendingTasks;
    var index =user_update.pendingTasks.indexOf(taskid);
    if (index > -1) {
        user_update.pendingTasks.splice(index, 1);
    }

    Users.put(data_user._id, user_update).success(function(result){
        Tasks.get().success(function(result){
            $scope.tasks = result.data;
          });
    });
  };



  $scope.add_user = function(){
    var data = {};
    data.name = $scope.newuser.name;
    data.email = $scope.newuser.email;
    Users.post(data).success(function(result){
      var message = result.condition;
      $("#message").text(message);
    });
  }


}]);

mp4Controllers.controller('TaskListController', ['$scope', '$http', 'Users', 'Tasks', '$window' , function($scope, $http, Users, Tasks, $window) {


 Users.get().success(function(result){
    $scope.users = result.data;
  });



 $scope.units = [
        {'id': "name", 'label':  "name"},
        {'id': "assignedUserName", 'label': "username"},
        {'id': "dateCreated", 'label': 'dateCreated'},
          {'id': "deadline", 'label': 'deadline'}
    ];

  $scope.data = {
            'id': 1,
            'unit': 'name'
  };

  $scope.unitChanged = function(){
   
    $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
   


      if($scope.condition == 0){
         Tasks.get_limit($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }
    if($scope.condition == 1){
     Tasks.get_pending($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }
    if($scope.condition == 2){
      Tasks.get_completed($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }
  };

   
  $scope.reverse = 1;

  $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";


  $scope.skip = 0;
  $scope.condition = 0;

  Tasks.get_limit(0, $scope.sort).success(function(result){
    $scope.tasks = result.data;
  });

  $scope.call_all = function(){
      $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
     Tasks.get_limit(0, $scope.sort).success(function(result){
        $scope.tasks = result.data;
         $scope.skip = 0;
        $scope.condition = 0;
    });

        $(".optionfield button").removeClass('success');
    $('#All').addClass('success');
  };

  $scope.call_pending = function(){
      $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
    Tasks.get_pending(0, $scope.sort).success(function(result){
        $scope.tasks = result.data;
         $scope.skip = 0;
        $scope.condition = 1;
    });

    $(".optionfield button").removeClass('success');
    $('#Pending').addClass('success');
  };

  $scope.call_completed = function(){
      $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
    Tasks.get_completed(0,$scope.sort).success(function(result){
        $scope.tasks = result.data;
        $scope.skip = 0;
        $scope.condition = 2;
    });

       $(".optionfield button").removeClass('success');
    $('#Completed').addClass('success');
  };

  $scope.movetoprev = function(){
      $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
    $scope.skip = $scope.skip - 10;
    if($scope.skip < 0){
      $scope.skip = 0;
    }
    if($scope.condition == 0){
      Tasks.get_limit($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
    });
    }
    if($scope.condition == 1){
      Tasks.get_pending($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
    });
    }
    if($scope.condition == 2){
      Tasks.get_completed($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
    });
    }


  };

  $scope.movetonext = function(){
      $scope.data.unit = $scope.data.unit;
    $scope.reverse =$scope.reverse;
    $scope.sort = "{ \"" + $scope.data.unit + "\" :" + $scope.reverse + "}";
     $scope.skip = $scope.skip + 10;
    if($scope.condition == 0){
         Tasks.get_limit($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }
    if($scope.condition == 1){
     Tasks.get_pending($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }
    if($scope.condition == 2){
      Tasks.get_completed($scope.skip, $scope.sort).success(function(result){
        $scope.tasks = result.data;
      });
    }

  };

  $scope.delete_task = function(taskid){
    Tasks.delete(taskid).success(function(result){
             if($scope.condition == 0){
      Tasks.get_limit($scope.skip, $scope.sort).success(function(curr){
        $scope.tasks = curr.data;
        });
        }
        if($scope.condition == 1){
          Tasks.get_pending($scope.skip, $scope.sort).success(function(curr){
            $scope.tasks = curr.data;
        });
        }
        if($scope.condition == 2){
          Tasks.get_completed($scope.skip, $scope.sort).success(function(curr){
            $scope.tasks = curr.data;
        });
        }
      });
  };

  $scope.move_to_add = function(){
     window.location = '#/addtask';

  }


 $scope.add_task = function(){
    var data = {};
    data.name = $scope.newtask.name;
    data.description = $scope.newtask.desc;
    data.deadline = $scope.newtask.date;
     if(typeof $scope.newtask.assignuser !== 'undefined' && $scope.newtask.assignuser ){
        var str = ($scope.newtask.assignuser).split(",");
        data.assignedUserName = str[0];
        data.assignedUser = str[1];
    }
    else{
      data.assignedUserName = "unassigned";
      data.assignedUser ="";
    }
    data.completed = false;

    data.add_new = 1;

    console.log($scope.newtask.assignuser);
  
    Tasks.post(data).success(function(result){
      var message = result.condition;
      console.log(result.data);
        $("#message").text(message);
        console.log(message);
    });
  }

  $scope.movetotaskdetails = function(taskid){

    window.location = "#/tasklist/" + taskid;


  }





}]);

mp4Controllers.controller('TaskDetailsController', ['$scope', '$routeParams', '$http', 'Users', 'Tasks', '$window' , function($scope,  $routeParams, $http, Users, Tasks, $window) {

  $scope.taskid = $routeParams.taskid;
  Tasks.get_one_task($scope.taskid).success(function(result){
        $scope.task = result.data;

    });

  Users.get().success(function(result){
    $scope.users = result.data;


  });


  $scope.edit_task = function(taskid){
    window.location = '#/edittask/' + taskid;
  };

function isempty(check, data){
  if ( typeof check !== 'undefined' && check )
  {
    return check;
  }
  else
  {
    return data;
  }
}

   $scope.edit = function(){
    var data = {};

    $scope.edittask = isempty($scope.edittask, data);

    data.name = isempty($scope.edittask.name, $scope.task.name);
    data.description = isempty($scope.edittask.desc, $scope.task.description);
    data.deadline = isempty($scope.edittask.date, $scope.task.deadline);
    data.completed = isempty($scope.edittask.completed, $scope.task.completed);
    console.log(data.deadline);
    if(typeof $scope.edittask.assignuser !== 'undefined' && $scope.edittask.assignuser ){
        var str = ($scope.edittask.assignuser).split(",");
        data.assignedUserName = str[0];
        data.assignedUser = str[1];
    }
    else{
      data.assignedUserName = $scope.task.assignedUserName;
      data.assignedUser =$scope.task.assignedUser;
    }
  
    data.current_assign = $scope.task.assignedUser;

    data.task_edit = 1;

  
    Tasks.put($scope.taskid, data).success(function(result){
      var message = result.message;
    
        $("#message").text(message);
        window.location = "#/tasklist/" + $scope.taskid;
        
    });
  };


}]);


mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    window.location.reload();
    $scope.displayText = "URL set";

  };

}]);

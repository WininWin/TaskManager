var mp4Services = angular.module('mp4Services', []);


mp4Services.factory('Users', function($http, $window) {
      var baseUrl = $window.sessionStorage.baseurl;
    return {
      
        get : function() {
            return $http.get(baseUrl+'/api/users');
        },
        delete : function(userid) {
            return $http.delete(baseUrl+'/api/users/' + userid);

        },

        post :function(data) {
            console.log(data);
            return $http.post(baseUrl+'/api/users', data);
        },

        put : function(userid, data) {
            return $http.put(baseUrl + '/api/users/' + userid, data);
        }

    }
});

mp4Services.factory('Tasks', function($http, $window) {
     var baseUrl = $window.sessionStorage.baseurl;
    return {
        get : function() {
            return $http.get(baseUrl + '/api/tasks');
        },
        get_limit : function(skip,sort) {
            return $http.get(baseUrl + '/api/tasks?limit=10&skip=' + skip + "&sort=" + sort);
        },

        get_pending : function(skip, sort){
            return $http.get(baseUrl + '/api/tasks?where={"completed": false}&limit=10&skip=' + skip+ "&sort=" + sort);
        },

        get_completed : function(skip, sort){
            return $http.get(baseUrl + '/api/tasks?where={"completed": true}&limit=10&skip=' + skip+ "&sort=" + sort);
        },
        get_one_task : function(taskid){
            return $http.get(baseUrl + '/api/tasks/' + taskid);
        },

        delete : function(taskid) {
            return $http.delete(baseUrl+'/api/tasks/' + taskid);

        },

        post :function(data) {
            console.log(data);
            return $http.post(baseUrl+'/api/tasks', data);
        },

        put : function(taskid, data) {
            return $http.put(baseUrl + '/api/tasks/' + taskid, data);
        }
    }
});

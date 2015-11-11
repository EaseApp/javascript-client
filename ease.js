function Ease(apiToken) {

  // Properties of API object
  this.apiToken = "";
  this.conn = undefined;
  this.binds = [];
  this.username = '';
  this.appName = "";
  this.appToken = "";

  // Methods of API object

  this.connect = function(application) {
    var currentEase = this;
    //currentEase.conn = new WebSocket("ws://localhost:3000/sub");
    currentEase.conn = new WebSocket("ws://localhost:8000/sub");
    currentEase.conn.onclose = function(e) {
      console.log("Connection closed");
    };
    currentEase.conn.onmessage = function(e) {
      //To be refactored
    };
  };
  
  this.close = function() {
    var currentEase = this;
    currentEase.conn.close();
  };

  this.signIn = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    currentEase.username = username;
    $.ajax({
      url: 'http://localhost:3000/users/sign_in',
      type: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      async: false,
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      var response = JSON.parse(data.responseText);
      currentEase.apiToken = response.api_token;
    });
  };

  this.signUp = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    $.ajax({
      url: 'http://localhost:3000/users/sign_up',
      type: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      async: false,
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      var response = JSON.parse(data.responseText);
      currentEase.apiToken = response.api_token;
    });
  };

  this.getApplications = function() {
    var response = "";
    $.ajax({
      url: 'http://localhost:3000/users/applications',
      type: "GET",
      async: false,
      contentType: 'application/json; charset=utf-8;',
      headers: {"Authorization" : this.apiToken},
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      response = JSON.parse(data.responseText);
      console.log(response);
    });
    return response;
  };
  
  this.setApplication = function(token) {
    this.appName = token.name;
    this.appToken = token.app_token;
  };

  this.deleteApplication = function(application) {
	$.ajax({
		url: 'http://localhost:3000/users/applications/' + application,
		type: "DELETE",
		async: false,
		contentType: 'application/json; charset=utf-8;',
		headers: {"Authorization" : this.apiToken},
		beforeSend: function(xhr) {
			xhr.withCredentials = true;
		}
	}).complete(function(data) {
		var resposne = JSON.parse(data.responseText);
	});
  };

  this.createApplication = function(application) {
	  $.ajax({
		  url: 'http://localhost:3000/users/applications/' + application,
		  type: "POST",
		  async: false,
		  contentType: 'application/json; charset=utf-8;',
		  headers: {"Authorization" : this.apiToken},
		  beforeSend: function(xhr) {
			  xhr.withCredentials = true;
		  }
	  }).complete(function(data) {
		  var response = JSON.parse(data.responseText);
	  });
  };

  this.publish = function(data) {
    if(this.conn == undefined) {
      console.error("Please subscribe to an application before sending data");
    }

    this.conn.send(data);
  };

  this.subscribe = function(application) {
    if(this.conn == undefined) {
      this.connect();
    }
    
    if(this.conn.readyState === 1) {  
      this.conn.send(application);
    } else {
      this.setCallback(this.conn.send, application);
    }
  };
  
  this.setCallback = function(argument) {
    if(this.conn.readyState === 1) {
      this.conn.send(argument);
    } else {
      var that = this;
      setTimeout(function () {
        that.setCallback(argument);
      }, 1000);
    }
  };
  
  this.sync = function() {
    for(var i=0; i< this.binds.length; i++) {
      this.conn.send(binds[i].html);
    }
  };
  
  this.save = function(data) {
    $.ajax({
      url: 'http://localhost:3000/data/' + this.username + '/' + this.appName,
      type: "POST",
      async: false,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8;',
      headers: {"Authorization" : this.appToken},
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      var response = JSON.parse(data.responseText);
    }).error(function(error, status, errorThrown) {
      console.log(JSON.stringify(data));
      console.error(error);
      console.error(status);
      console.error(errorThrown);
    });
  };
  
  this.read = function(data) {
    $.ajax({
      url: 'http://localhost:3000/data/' + this.username + '/' + this.appName,
      type: "GET",
      async: false,
      contentType: 'application/json; charset=utf-8;',
      headers: {"Authorization" : this.appToken},
      data: JSON.stringify(data),
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      console.log(data);
      return data;
    }).error(function(error, status, errorThrown) {
      console.log(JSON.stringify(data));
      console.error(error);
      console.error(status);
      console.error(errorThrown);
    });
  };
  
  this.delete = function(data) {
    $.ajax({
      url: 'http://localhost:3000/data/' + this.username + '/' + this.appName,
      type: "DELETE",
      async: false,
      contentType: 'application/json; charset=utf-8;',
      data: JSON.stringify(data),
      headers: {"Authorization" : this.appToken},
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      return data;
    }).error(function(error, status, errorThrown) {
      console.log(JSON.stringify(data));
      console.error(error);
      console.error(status);
      console.error(errorThrown);
    });
  };

}

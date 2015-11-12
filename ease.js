function EaseInternal(apiToken) {

  // Properties of API object
  this.apiToken = "";
  this.conn = undefined;
  this.binds = [];
  this.username = '';
  this.appName = "";
  this.appToken = "";

  // Methods of API object
  
  this.setApplication = function(token) {
    this.appName = token.name;
    this.appToken = token.app_token;
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
    return $.ajax({
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
    return $.ajax({
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

}

function Ease(username, appName, appToken) {
  
  this.appToken = appToken;
  
  this.sendRequest = function(url, type, dataToSend) {
    return $.ajax({
      url: url,
      type: type,
      data: dataToSend,
      contentType: 'application/json; charset=utf-8;',
      headers: {"Authorization" : this.appToken},
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      var response = JSON.parse(data.responseText);
    }).error(function(error, status, errorThrown) {
      console.error(error);
      console.error(status);
      console.error(errorThrown);
    });
  }
  
  this.save = function(path, data) {
    var dataToSend = {
      path : path,
      data : data
    };
    return this.sendRequest("http://localhost:3000/data/"+this.username+"/"+this.appName, "POST", json.stringify(dataToSend));
  };
  
  this.read = function(path) {
    var dataToSend = {
      path : path
    };
    return this.sendRequest("http://localhost:3000/data/"+this.username+"/"+this.appName, "GET", dataToSend);
  };
  
  this.delete = function(path, data) {
    var dataToSend = {
      path : path,
      data : data
    };
    
    return this.sendRequest('http://localhost:3000/data/' + this.username + '/' + this.appName, "DELETE", dataToSend);
  };
  
  this.sync = function() {
    for(var i=0; i< this.binds.length; i++) {
      this.conn.send(binds[i].html);
    }
  };
  
  this.subscribe = function(application) {
    if(this.conn == undefined) {
      this.connect();
    }
    
    if(this.conn.readyState === 1) {  
      var dataToSend = {
          username: ease.username,
          application: application
      }
      this.conn.send(dataToSend);
    } else {
      this.setCallback(this.conn.send, application);
    }
  };
  
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
}

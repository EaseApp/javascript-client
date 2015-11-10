function Ease(apiToken) {

  // Properties of API object
  this.apiToken = "";
  this.conn = undefined;

  // Methods of API object

  this.connect = function(application) {
    var currentEase = this;
    currentEase.conn = new WebSocket("ws://ease-62q56ueo.cloudapp.net/sub");
    currentEase.conn.onclose = function(e) {
      console.log("Connection closed");
    };
    currentEase.conn.onmessage = function(e) {
      //To be refactored
    };
  }

  this.signIn = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    $.ajax({
      url: 'http://ease-62q56ueo.cloudapp.net/users/sign_in',
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
  }

  this.signUp = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    $.ajax({
      url: 'http://ease-62q56ueo.cloudapp.net/users/sign_up',
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
  }

  this.getApplications = function() {
    $.ajax({
      url: 'http://ease-62q56ueo.cloudapp.net/users/applications',
      type: "GET",
      async: false,
      contentType: 'application/json; charset=utf-8;',
      headers: {"Authorization" : this.apiToken},
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    }).complete(function(data) {
      var response = JSON.parse(data.responseText);
    });
  }

  this.deleteApplication = function(application) {
	$.ajax({
		url: 'http://ease-62q56ueo.cloudapp.net/users/applications/' + application,
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
  }

  this.createApplication = function(application) {
	  $.ajax({
		  url: 'http://ease-62q56ueo.cloudapp.net/users/applications/' + application,
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
  }

  this.publish = function(data) {
    if(this.conn == undefined) {
      console.error("Please subscribe to an application before sending data");
    }

    this.conn.send(data);
  }

  this.subscribe = function(application) {
    if(this.conn == undefined) {
      this.connect();
    }

    this.conn.send(application);
  }

}

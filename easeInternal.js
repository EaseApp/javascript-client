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
      url: 'http://ease-62q56ueo.cloudapp.net/users/applications',
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
  };

  this.signUp = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    return $.ajax({
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
  };

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
  };

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
  };

}

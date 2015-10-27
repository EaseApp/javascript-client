function Ease(apiToken) {

  // Properties of API object
  this.apiToken = "";

  // Methods of API object

  this.signIn = function(username, password) {
    var data = {};
    var currentEase = this;
    data.username = username;
    data.password = password;
    $.ajax({
      url: 'http://localhost:3001/users/sign_in',
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
    console.log(this.apiToken);
    $.ajax({
      url: 'http://localhost:3001/users/applications',
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



}

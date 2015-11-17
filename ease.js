function Ease(username, appName, appToken) {
  var urls = {
    localhost: 'localhost:3000/',
    prod: 'ease-62q56ueo.cloudapp.net/'
  }
  this.baseUrl = urls.localhost;
  this.username = username;
  this.appName = appName;
  this.appToken = appToken;

  this.sendRequest = function(url, type, dataToSend) {
    var xhr = new XMLHttpRequest();
    if(type != "GET") {
      xhr.open(type, url, false);
    } else {
      xhr.open(type, url+"?path="+dataToSend.path, false);
    }
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8;');
    xhr.setRequestHeader('Authorization', this.appToken);
    //xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        return xhr.responseText;
      } else {
        console.error("Request failed. Status " + xhr.status);
      }
    }
    xhr.send(dataToSend);
    return xhr.responseText;
  }

  this.save = function(path, data) {
    var dataToSend = {
      path : path,
      data : data
    };
    return this.sendRequest("http://"+baseUrl +"data/"+this.username+"/"+this.appName, "POST", JSON.stringify(dataToSend));
  };

  this.read = function(path) {
    var dataToSend = {
      path : path
    };
    return this.sendRequest("http://"+baseUrl +"data/"+this.username+"/"+this.appName, "GET", dataToSend);
  };

  this.delete = function(path, data) {
    var dataToSend = {
      path : path,
      data : data
    };

    return this.sendRequest("http://"+baseUrl +'data/' + this.username + '/' + this.appName, "DELETE", JSON.stringify(dataToSend));
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
    currentEase.conn = new WebSocket("ws://"+baseUrl+":8000/sub");
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

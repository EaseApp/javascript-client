function Ease(username, appName, appToken) {
  var urls = {
    localhost: 'localhost:3000/',
    prod: 'ease-62q56ueo.cloudapp.net:3001'
  }
  this.baseUrl = urls.prod;
  this.username = username;
  this.appName = appName;
  this.appToken = appToken;

  this.sendRequest = function(url, type, dataToSend, callback) {
    var xhr = new XMLHttpRequest();
    if(type != "GET") {
      xhr.open(type, url, true);
    } else {
      xhr.open(type, url+"?path="+dataToSend.path, true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8;');
    xhr.setRequestHeader('Authorization', this.appToken);
    //xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
      var err = "";
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          err = null;
          callback(err, JSON.parse(xhr.responseText));
        } else {
          err = xhr.status;
          callback(err, xhr.responseText);
        }
      }
    };
    xhr.send(dataToSend);
    return xhr.responseText;
  }

  this.save = function(path, data, callback) {
    var dataToSend = {
      path : path,
      data : data
    };
    this.sendRequest("http://"+this.baseUrl +"/data/"+this.username+"/"+this.appName, "POST", JSON.stringify(dataToSend), callback);
  };

  this.read = function(path, callback) {
    var dataToSend = {
      path : path
    };
    this.sendRequest("http://"+this.baseUrl +"/data/"+this.username+"/"+this.appName, "GET", dataToSend, callback);
  };

  this.delete = function(path, callback) {
    var dataToSend = {
      path : path
    };

    this.sendRequest("http://"+this.baseUrl +'/data/' + this.username + '/' + this.appName, "DELETE", JSON.stringify(dataToSend), callback);
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

    var dataToSend = {
        username: this.username,
        table_name: application,
        authorization: this.appToken
    };

    if(this.conn.readyState === 1) {
      this.conn.send(JSON.stringify(dataToSend));
    } else {
      this.setCallback(dataToSend);
    }
  };

  this.connect = function(application) {
    var currentEase = this;
    currentEase.conn = new WebSocket("ws://ease-62q56ueo.cloudapp.net:8000/sub");
    currentEase.conn.onclose = function(e) {
      console.log("Connection closed");
    };
    currentEase.conn.onmessage = function(e) {
      console.log(e);
      return e;
    };
  };

  this.setCallback = function(argument) {
    if(this.conn.readyState == 1) {
      this.conn.send(JSON.stringify(argument));
    } else {
      console.log("Not Ready");
      var that = this;
      setTimeout(function () {
        that.setCallback(argument);
      }, 1000);
    }
  };
}

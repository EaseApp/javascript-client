function Ease(username, appName, appToken, prodBoolean) {
  var urls = {
    localhost: 'localhost:3001',
    prod: 'ease-62q56ueo.cloudapp.net:3001',
    localSync: 'ws://localhost:8000',
    prodSync: 'ws://ease-62q56ueo.cloudapp.net:8000'
  }

  if (prodBoolean == true){
    this.baseUrl = urls.prod;
    this.syncUrl = urls.prodSync;
  }
  else{
    this.baseUrl = urls.localhost;
    this.syncUrl = urls.localSync;
  }

  this.username = username;
  this.appName = appName;
  this.appToken = appToken;
  this.prodBoolean = prodBoolean;


  this.sendRequest = function(url, type, dataToSend, callback) {
    console.log(url);
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
    console.log(dataToSend);
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
      this.connect(application);
    }

    var dataToSend = {
        username: this.username,
        appName: application,
        authorization: this.appToken
    };
    console.log("Data to send: " + JSON.stringify(dataToSend))
    if(this.conn.readyState === 1) {
      this.conn.send(JSON.stringify(dataToSend));
    } else {
      this.setCallback(dataToSend);
    }
  };

  this.connect = function(application) {
    var currentEase = this;
    currentEase.conn = new WebSocket(this.syncUrl + "/sub");
    currentEase.conn.onclose = function(e) {
      console.log("Connection closed");
    };
    currentEase.conn.onmessage = function(e) {
      console.log(e.data);
      return e.data;
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

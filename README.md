# javascript-client
JavaScript client for accessing the Ease API.

## Initializing Ease

### Parameters:

The constructor takes four parameters:

`username`: Your username for the ease application
`appName`: The name of your application
`appToken`: The API token for your application
`prod`: true for prod server

Example:
```
var ease = new Ease("username", "password", "apiToken", true);
```

## Save Method

Saves a JSON object to the application

### Parameters:

The save method takes in 3 parameters

`path`: The path for the data to be stored in
`data`: A JSON object of the data to store
`callback`: A callback function that takes in parameters (err, object) where the object is a JSON object with the data if there is no error

Example:
```
ease.save("/home", "{'data': 'data'}", function(err, data) {
  if(!err) {
    // Handle error
  }
  // Do things with data
}
```

## Read Method

Retrieves a JSON object from the application

### Parameters:

The read method takes in 2 parameters

`path`: The path for the data to be read from
`callback`: A callback function that takes in parameters (err, object) where the object is a JSON object with the data if there is no error

Example:
```
ease.read("/home", function(err, data) {
  if(!err) {
    // Handle error
  }
  // Do things with data
}
```

## Delete Method

Deletes a JSON object from the application

### Parameters:

The read method takes in 2 parameters

`path`: The path for the data to be deleted from
`callback`: A callback function that takes in parameters (err, object) where the object is a JSON object with the data if there is no error

Example:
```
ease.delete("/home", function(err, data) {
  if(!err) {
    // Handle error
  }
  // Do things with data
}
```

## Subscribe Method

Subscribes you to the sync service, documentation for the sync service can be found below in the Documentation section

### Parameters:

The read method takes in 1 parameter

`application`: The application you would like to be notified about

Example:
```
ease.subscribe("myApplication");
```

You can then access the websocket connection object via:
```
ease.conn;
```


## Documentation

View the [API Documentation](https://github.com/EaseApp/web-backend#data-api-documentation).

View the [Sync Documentation](https://github.com/EaseApp/web-backend#sync-endpoint-for-realtime).

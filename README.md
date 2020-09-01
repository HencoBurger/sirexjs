# SirexJs
Service layer architecture for Express. Sir-(vice) Ex-(press)

SirexJs was not created to be a new "framework", but more of a way of using Express to build API's.

Like the ExpressJS website says "Express is a fast, un-opinionated, minimalist web framework for Node.js.
SirexJs is an opinion on how to build API's with Express.

#### Inspiration

SirexJs was inspired by the Microservices architecture. 
You can think of a SirexJs <b><u>services</u></b> as a:
Stand-alone feature or grouping of code with its own routing table that connects to one database model.  One service can easily communicate with another service.

##### Updates
Read more about [version updates](CHANGELOG.md).

##### Postman Example
Download a example API routes for Todo app to test in [Postman](postman/todo.postman_collection.json).

## CLI
### Install
Install SirexJs-CLI globally. This will help you set up you API boilerplate.  The SirexJS boilerplate comes with <u>example</u> <b>"Task Service"</b> witch you can plug into a classic "<em>To-Do</em>" app.

```
npm i -g sirexjs-cli
```

### Getting Started

Run "sirex-cli" in you project folder or where ever you want to start your new project.

The below code snippets follow the supplied <b>"Task Service"</b> example.
```
sirexjs-cli
```


<u>Choose from the following options:</u>

- **init - Create new project.**
  Navigate to your project folder or ask SirexJs to create a new project folder structure for you.
- **service - Create new service.**
  Use this option to create the folder structure and initial code to start developing your new service.
- **database - Create a connection to your preferred database.**
  Create a database initialization template. This is not needed to run SirexJs but it helps to know what to connect to.
- **middleware - Create new middleware.**
  Creates a middleware template function in "src/middleware". ExpressJs middleware function.
- **thread - Create new Service Child Process.**
  Creates a thread template function for a Service "src/services/[service_name]/threads/[thread_name]".

###Example

- [Run Development Mode](#run-development-mode)
- [Start Hooks](#start-hooks)
- [Environment File](#environment-file)
- [Databases](#databases)
- [Router](#router)
- [Services](#create-service)
  - [Routes](#service-routes)
  - [Managers](#managers)
  - [Models](#models)
- [Extensions](#extensions)
  - [Logging](#logging)
  - [Validation](#validation)
  - [Threads](#threads)
  - [Exceptions](#exceptions)
  - [API Response](#api-response)

#### Run development Mode
Run your application in development mode by running this command.
```javascript
npm run dev
```

This sets up a nodemon watcher.  The watcher restart your development server
as soon as it detects change in "/src" folder.

For "production", you can use [PM2](https://pm2.keymetrics.io/). But this is up to you.

#### Start Hooks
There are three hooks you can use while your API spins up.
Return a promise in these hook functions.

- <b>beforeLoad</b>
Before anything is loaded, even environment variables
- <b>beforeCreate</b>
After all packages where loaded and before the API spins up.
You also have access to the app API object
- <b>created</b>
API is running
You also have access to the app API object

```javascript
// todo-app/index.js

'use strict';

const {
  Server,
  Databases
} = require('sirexjs');

Server.load({
  beforeLoad: async () => {
    // Before anything is loaded, even environment variables
  },
  beforeCreate: async (app) => {
    // Callback has access to nodejs instance via "app"
  },
  created: async (app) => {
    // Callback has access to nodejs instance via "app"
  }
});
```
#### Environment File
Creating a new application also creates an ".env" file. Its already setup as a development environment.

#### Databases
Creating a new database connection also creates a new folder which contains an example index.js file.

This new file exports a class, you can extend this class or create your own implementation. 

If you want to only start the application when database is loaded, use the event hooks in Root index.js file.

You can connect any database, MongoDB, MySQL, NeDB, CouchDB or you can connect all of them.  It is all up to you.

You can access your databases through:

```javascript
const {
  Services,
  middleware,
  Databases
} = require('sirexjs');

const inMemoryDBInstance = new Databases.inMemory();
```
#### Router
Adding the following route gives you access to the service sub routes.

```javascript

const {
  Services,
  middleware
} = require('sirexjs');

router.use('/tasks', Services.tasks.routes);
```

<b>Example:</b>

```javascript
// src/router/index.js
'use strict';

const express = require('express');
const router = express.Router();

const {
  Services,
  middleware
} = require('sirexjs');

module.exports = (function () {

  router.use('/tasks', Services.tasks.routes);

  router.use('*', (req, res) =>{
    res.status(200).send(`Resource not be found.`);
  });

  return router;
})();
```
#### Services

From the Sirex-CLI Choose the options “service - Create new service” follow prompts and create your new service.

Services can be exposed through the "router" or it can be used internally by other services.

#### service routes
Add routes to a service

```javascript
const {
  Services,
  middleware
} = require('sirexjs');

router.get('/', [Middleware.auth], async (req, res) => {
  try {
    
    const list = await Services.tasks.manager('index')
      .init()
      .list();

    res.restResponse(list);
  } catch (e) {
    Extensions.logger.error(e);
    res.restResponse(e);
  }
});
```
<b>Example:</b>

```javascript
// src/router/services/tasks/routes/index.js

'use strict';

const express = require('express');
const router = express.Router();

const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

module.exports = (function () {

  router.get('/', [Middleware.auth], async (req, res) => {
    try {
      console.log(Services.tasks.manager);
      const list = await Services.tasks.manager('index')
        .init()
        .list();

      res.restResponse(list);
    } catch (e) {
      Extensions.logger.error(e);
      res.restResponse(e);
    }
  });

  router.post('/', [Middleware.auth], async (req, res) => {
    try {
      const created = await Services.tasks.manager('index')
        .init()
        .create(req.body);

      res.restResponse(created);
    } catch (e) {
      Extensions.logger.error(e);
      res.restResponse(e);
    }
  });

  router.put('/:taskId', [Middleware.auth], async (req, res) => {
    try {
      const updated = await Services.tasks.manager('index')
        .init()
        .update(req.params.taskId, req.body);

      res.restResponse(updated);
    } catch (e) {
      Extensions.logger.error(e);
      res.restResponse(e);
    }
  });

  router.delete('/:taskId', [Middleware.auth], async (req, res) => {
    try {
      const deleted = await Services.tasks.manager('index')
        .init()
        .delete(req.params.taskId);

      res.restResponse(deleted);
    } catch (e) {
      Extensions.logger.error(e);
      res.restResponse(e);
    }
  });

  router.use('*', (req, res) => {
    res.status(404).send(`Resource not be found.`);
  });

  return router;
})();
```

#### Managers

Service managers contains logic to manipulate data before you save it to a database or use the manipulated data in other parts of your application.

You can access the manager through "Services".

Example:
```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

const list = await Services.tasks.manager('index')
        .init()
        .list();
```

Example - Task Manager

```javascript
// src/router/services/tasks/managers/index.js

'use strict';

const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

module.exports = class tasksManager {
  static init() {
    return new this();
  }

  list() {
    return [];
  }

  create(data) {

    return {};
  }

  update(taskId, data) {

    return {};
  }

  delete(taskId) {

    return {};
  }
};
```

#### Models
When you create a service a model folder structure is created by default.  You can extend the model class with the database connection you created before.

With that said, its all up to you how you structure your models.

### Extensions
These methods are there to make your development process easier.

##### Logging
Logger is and extension of Winston. For more about how to use logger go [here](https://www.npmjs.com/package/winston).

<b>Examples:</b>

```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

Extensions.logger.info("Info logs here");
Extensions.logger.error("Error logs here");
```

##### Validation
Validation uses [validator](https://www.npmjs.com/package/validator) internally. It was modified to be a bit more "compact".
Validation also has the ability to validate nested properties.

###### Flat validation
```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

const validate = Extensions.validation();

validate.setValidFields({
  'email': {
    'rules': 'required|email',
    'field_name': 'Local email'
  },
  'address': {
    'props': 'required|email',
    'field_name': 'Local email'
  }
});

if (validate.isValid(data)) {
  Extensions.logger.info(validate.fields);
} else {
  throw Extensions.exceptions(404, 'Could not create new user', validate.errors);
}
```

###### Nested validation
```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

const validate = Extensions.validation();

validate.setValidFields({
  'firstName': {
    'rules': 'required',
    field_name: 'Your name'
  },
  'address': {
    'props': {
      'prop_1': {
        'rules': 'required',
        field_name: 'State'
      },
      'prop_2': {
        'rules': 'required|number',
        field_name: 'Postcode'
      },
    }
  }
});

if (validate.isValid(data)) {
  Extensions.logger.info(validate.fields);
} else {
  throw Extensions.exceptions(404, 'Could not create new user', validate.errors);
}
```

Types:

- string
- integer
- float
- boolean
- date
- email

Require a field and type:

```javascript
{
  'userName': {
    'rules': 'string'
  },
  'email': {
    'rules': 'required|email'
  }
}
```
##### Threads
Node is single threaded and because of this any long running processes will block the event loop.  This creates latency in your application.  Using threads you can offload any long running process to a separate Child Process.

Features:
- New threads only spin up when requested.
- Previously created threads are re-used as spinning up a thread takes about 2 seconds.
- Idle threads waits for 5 seconds if not reused in that time it shuts down.
- Max 5 threads can be running at the same time.
- Request are placed in a "thread pool" if more than 5 threads are active.


###### Using it as a extension:
```javascript
// Tread function for "tasks service"
// Threads have to return a function

'use strict';

const {
  Services
} = require('sirexjs');

// createFile Thread function
module.exports = function() {
  // Put some long running code here.
  return 'something'; // Return something when you are done
};
```

```javascript
// Run "tasks service" tread, or thread from another location

'use strict';

const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

  // Run thread attache to service
  let thread = await Services.tasks.thread('createFile', ['arg1','arg2','arg3'])
  .received();
  
  // Run thread function from any location
  let thread = await Extensions.threads('/services/tasks/managers/treadFunction', ['hello'])
  .received();
```

##### Exceptions
API response and exceptions functions work together. Make sure all exceptions caught is eventually passed to the route response of the API end-points to display any error messages to the user.  There are 3 kinds of exceptions that can be thrown.

<u>Exception types:</u>
- Response
- System
- Standard

All exceptions except "Response" will trigger a stack trace error log.

###### <u>Response</u>
Used when you have validation error to handle.

<b>Example:</b>
```javascript
sirexjs.Extensions.exceptions.response(http_response_code, 'Description', collection_of_errors);
```

```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

throw Extensions.exceptions.response(400, 'Could not create new user', validate.errors);
```

```json
// Endpoint Response:
{
    "message": "Following fields are invalid.",
    "endpoint": "/user/sign-up",
    "method": "POST",
    "timestamp": "2019-10-24T14:03:22.780Z",
    "errors": {
        "email": "Email is not a valid email format"
    }
}
```

###### <u>System</u>
Error relating to the API application.

<b>Example:</b>
```javascript
sirexjs.Extensions.exceptions.system('your_message_here');
```

```javascript
const {
  Services,
  Middleware,
  Extensions
} = require('sirexjs');

throw Extensions.exceptions.system('Internal conflict found.');
```



```json
// Endpoint Response:
{
    "message": "Internal conflict found.",
    "endpoint": "/user/sign-up",
    "method": "POST",
    "timestamp": "2019-10-24T13:49:22.388Z"
}
```
###### <u>Standard</u>
Any exceptions thrown by the application. The the API response example is below.  The stack trace error will be logged.

```javascript
// Stack trace reference

"Trace: refId: 3416e49bf1f4758234345cb79d1550ff Timestamp: 2020-08-28T12:42:02Z"

```

```json
// Endpoint Response:
{
    "message": "We seem to have a problem. Please contact support and reference the included information.",
    "endpoint": "/tasks",
    "method": "GET",
    "timestamp": "2020-08-28T12:42:02Z",
    "refId": "3416e49bf1f4758234345cb79d1550ff"
}
```

##### API Response
Display data back to users.

The response function can handle succeeded and exception responses to the user.

```javascript
res.restResponse(responseData);
```

Example:
```javascript
router.post('/sign-up', async (req, res) => {
  try {
    let user = {
      firstName: 'Name'
    };
    res.restResponse(user);
  } catch(e) {
    res.restResponse(e);
  }
});

```

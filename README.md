# SirexJs
Service layer architecture for Express. Sir-(vice) Ex-(press)
</br>
</br>
SirexJs is not a new "framework", but more of a way of using Express to build API's.</br>
Like the Express website says "Express is a fast, unopinionated, minimalist web framework for Node.js.</br>
SirexJs is an opinion on how build API's with Express.

#### Inspiration

SirexJs was inspired by the Microservices architecture. <br/>
You can think of a SirexJs services as a:<br/>
Stand-alone feature or grouping of code with its own routing table that connects to one database model.  Services can also talk to one another through a service gateway.

## CLI
### Install
Install SirexJs globally.

<code>
npm i -g sirexjs
</code>

##### RUN </br>
<code>
sirexjs
</code>

Choose from the following options.

- **init - Create new project.<br/>**
  Navigate to your project folder or ask SirexJs to create a new project folder structure for you.
- **service - Create new service.<br/>**
  Use this option to create the folder structure and initial code to start developing your new service.
- **middleware - Create new middleware.<br/>**
  Creates a middleware template function in "src/middleware".
- **thread - Create new Service Child Process.<br/>**
  Creates a thread template function for a Service "src/services/[service_name]/threads/[thread_name]".

### Getting Started
Create a new service called “user” with an attached API end-point and save data to MongoDB.

- [Environment file](#environment-file)
- [Create Service](#create-service)
- [Service Route](#service-route)
- [Sub Routes](#service-sub-routes)
- [Managers](#managers)
- [Models](#models)
- [Access Mongoose Types](#access-mongoose-types)
- [Extensions](#extensions)
  - [Logging](#logging)
  - [Validation](#validation)
  - [Threads](#threads)
  - [Exceptions](#exceptions)
  - [API Response](#api-response)
- [Threads (Child Process)](#threads)

Inside the project folder run:

<code>
sirexjs
</code>

#### Environment file
Creating a new application also creates an ".env-template" file. Rename this file to ".env" and add your relevant information.

#### Create a Service

Choose the options “service - Create new service” follow prompts and create "user" service.<br/>
After creation is completed you can pretty much use the service for what ever you want.<br/>
It can be used as a service that is attached to a API end-point or you can use for a stand-alone collection of code that can be used inside you API application.

Follow the next steps to attach the service to a API end-point and save data to MongoDB.

#### Service Route
Adding the following route gives you access to the service sub routes.

<code>router.use('/user', serviceGateway.user.routes);</code>

Example:<br/>
project/src/router/index.js
```
'use strict';

const express = require('express');
const router = express.Router();

const middleware = require('middleware');
const serviceGateway = require('services');

module.exports = (function () {

  router.use('/user', serviceGateway.user.routes);

  router.use('*', (req, res) =>{
    res.status(200).send(`Resource not be found.`);
  });

  return router;
})();
```
#### service sub routes
Add sub-routes to a service

```
const sirexjs = require('sirexjs');

router.post('/sign-up', async (req, res) => {
    try {
      const signUp = serviceGateway.user.manager('SignUp');
      const user = await signUp.create(req.body);
      res.restResponse(ussirexjs.Extensions.er);
    } catch(e) {
      sirexjs.Extensions.sirexjs.Extensions.logger.error(`[services][user][routes][sign-up]`);
      sirexjs.Extensions.logger.error(e);
      res.restResponse(e);
    }
  })
```
Example:<br/>
/project/src/services/user/routes

```
'use strict';

const express = require('express');
const router = express.Router();
const sirexjs = require('sirexjs');

// User authentication
const middleware = require('middleware');
const serviceGateway = require('services');

module.exports = (function () {

  router.post('/sign-up', async (req, res) => {
    try {
      const signUp = serviceGateway.user.manager('SignUp');
      const user = await signUp.create(req.body);
      res.restResponse(ussirexjs.Extensions.er);
    } catch(e) {
      sirexjs.Extensions.sirexjs.Extensions.logger.error(`[services][user][routes][sign-up]`);
      sirexjs.Extensions.logger.error(e);
      res.restResponse(e);
    }
  })

  router.use('*', (req, res) =>{
    res.status(200).send(`Resource not be found.`);
  });

  return router;
})();
```

#### Managers

Service manager contains logic to manipulate data before you save it to a database or use the manipulated data in other parts of your application.

You can access the manager through the "serviceGateway".<br/>
<code>serviceGateway.serviceName.manager('managerFileLocation/managerFileName');</code>

Example:
```
const serviceGateway = require('services');

module.exports = (data) => {
  const signUp = serviceGateway.user.manager('SignUp');
  const user = await signUp.create(data);
};
```

Example - User Manager

```
'user strict';

const serviceGateway = require('services');
const sirexjs = require('sirexjs');

module.exports = class SignUp {
  static async create(body) {
    try {

      const validate = validation();
      validate.setValidFields({
        'callsign': {
          'rules': 'required'
        },
        'email': {
          'rules': 'required|email'
        }
      });

      if (validate.isValid(body)) {
        return await serviceGateway.user.model.createUser(validate.fields);
      } else {
        throw sirexjs.Extensions.exceptions(404, 'Could not create new user', validate.errors);
      }
    } catch (e) {
      sirexjs.Extensions.logger.error("[managers][SignUp]", e);
      throw e;
    }
  }
}
```

#### Models
At the moment MongoDB is the default database for SirexJs.<br/>
When you create a service a model folder structure is created by default.

Access model collection:<br/>
<code> let user = await serviceGateway.user.model.collection.find({}); </code>

Or extend the model with your own methods:<br/>
<code> let user = await serviceGateway.user.model.createUser(saveData); </code>

Example - extend models

```
'use strict';

const sirexjs = require('sirexjs');
const schema = require('./schema');

module.exports = class UserModel extends sirexjs.Database.mongodb {

  get collectionName() {
    return 'user';
  }

  get collectionSchema() {
    return schema;
  }

  async createUser(userData) {
    try {
      let user = await this.collection.create(userData);
      user = await this.collection.find({ _id: this.types.ObjectId(user._id) });
      return ussirexjs.Extensions.er;
    } catch (e) {
      sirexjs.Extensions.logger.error("[UserModel][createUser]", e);
      throw e;
    }
  }
}
```

#### Access Mongoose Types
Example - Inside data model file

```
  async updateUser(id, userData) {
    await this.collection.updateOne({ id: this.types.ObjectId(id) }, userData);
  }
```

Example - Outside data model file

```
const serviceGateway = require('services');
const sirexjs = require('sirexjs');

module.exports = (id) => {
  let types = sirexjs.Database.mongodb.types;
  await serviceGateway.user.model.collection.updateOne({ _id: types.ObjectId(id) }, { callsign: 'Boo' });
}
```

#### Extensions
These methods are there to make your development process easier.

##### Logging
Logger is and extension of Winston. For more about how to use logger go [here](https://www.npmjs.com/package/winston).

Examples: <br/>
const sirexjs = require('sirexjs');

```
const sirexjs = require('sirexjs');

sirexjs.Extensions.logger.info("Info logs here");
sirexjs.Extensions.logger.error("Error logs here");
```

##### Validation
Validation uses [validator](https://www.npmjs.com/package/validator) internally. It was modified to be a bit more compact.

```
const sirexjs = require('sirexjs');
const validate = sirexjs.Extensions.validation();

validate.setValidFields({
  'callsign': {
    'rules': 'required'
  },
  'email': {
    'rules': 'required|email'
  }
});

if (validate.isValid(data)) {
  sirexjs.Extensions.logger.info(validate.fields);
} else {
  throw sirexjs.Extensions.exceptions(404, 'Could not create new user', validate.errors);
}
```

Types:

- string
- integer
- float
- boolean
- date

You can pipe types. Require a field and type:

```
  'userName': {
    'rules': 'string'
  },
  'email': {
    'rules': 'required|email'
  }
```
##### Threads
Node is single threaded and because of this any long running processes will block the event loop.  This creates latency in your application.  Using threads you can offload any long running process to a separate Child Process.

Features:
- New threads only spin up when requested.
- Previously created threads are re-used as spinning up a thread takes about 2 seconds.
- Idle threads waits for 5 seconds to be reused and then shuts down.
- Max 5 threads can be running at the same time.
- Request are placed in a "thread pool" if more than 5 threads are active.


###### Using it as a extension:
```
  const sirexjs = require('sirexjs');

  let thread = await sirexjs.Extensions.threads('location_of_function', ['arg1','arg2','arg3'])
  .received();
  // ex.
  let thread = await sirexjs.Extensions.threads('/services/user/managers/test', ['hello'])
  .received();
```
###### Using it through service gateway:
```
const serviceGateway = require('services');

  let thread = await serviceGateway.user.thread('thread_in_service_threads_folder',  ['arg1','arg2','arg3'])
  .received();

  //ex.
  let thread = await serviceGateway.user.thread('test', ['arg1','arg2','arg3'])
  .received();
```

##### Exceptions
API response and exceptions work together. Make sure all exceptions caught is eventually passed to the route response for API end-points to display any error messages.

Example: <br/>
exception(http_response_code, 'Description', colleciton_of_errors); <br/>

<code> throw exceptions(400, 'Could not create new user', validate.errors); </code>

##### API Response
Display data back to users.
<br/>Data displayed
<code>res.restResponse(responseData);</code>

Example:
```
try {
  res.restResponse(user);
} catch(e) {
  res.restResponse(e);
}
```

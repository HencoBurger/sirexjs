# SirexJs
Service layer architecture for Express. Sir-(vice) Ex-(press)
</br>
</br>
SirexJs is not a new "framework", but more of a way of using Express to build API's.</br>
Like the Express website says "Express is a fast, unopinionated, minimalist web framework for Node.js.</br>
SirexJs is my opinion on how to use Express.

#### What is a service?

SirexJs was inspired by the Microservice architecture. <br/>
You can think of a SirexJs service as a stand-alone:
feature or grouping of code
with its own routing table
that connects to one database model.

## CLI
### Install
Install Sirexjs globally.

<code>
npm i -g sirexjs
</code>

##### RUN </br>
<code>
sirexjs
</code>

Choose from the following options.

- **init - Create new project.<br/>**
  Navigate to your project folder or ask Sirex to create a new project folder structure for you.
- **service - Create new service.<br/>**
  Use this option to create the folder structure and initial code to start developing your new service.
- **middleware - Create new middleware.<br/>**
  Creates a middleware template function in "src/middleware".

### Creating a new project
This option creates and new express application with predefined folder structure.  The creation process also pre-installs all the packages you would need to get an API up and running.

### Services
Creating a new feature is sometimes a tedious process, using the CLI “service” options creates a new service in the main services folder also with a predefined folder structure.

### Getting started
Create a new service called “user” with an attached API end-point and save data to MongoDB.

- [Create Service](#create-service)
- [Service Route](#service-route)
- [Sub Routes](#service-sub-routes)
- [Managers](#managers)
- [Models](#models)
- [Access Mongoose Types](#access-mongoose-types)

Inside the project folder run:

#### Create Service

<code>
sirexjs
</code>

Choose the options “service - Create new service” follow prompts and create user service.<br/>
After the service is completed you can pretty much use ther service for what ever you want.<br/>
It can be used as a service that is attached to a API end-point or you can use for a stand-alone collection of code that can be used in you API application.

Follow the next steps to attach the service to a API end-point and save data to MongoDB.

#### Service Route
Add the following router to a service.

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
router.post('/sign-up', async (req, res) => {
    try {
      const signUp = serviceGateway.user.manager('SignUp');
      const user = await signUp.create(req.body);
      res.restResponse(user);
    } catch(e) {
      logger.error(`[services][user][routes][sign-up]`);
      logger.error(e);
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

// User authentication
const middleware = require('middleware');
const serviceGateway = require('services');

module.exports = (function () {

  router.post('/sign-up', async (req, res) => {
    try {
      const signUp = serviceGateway.user.manager('SignUp');
      const user = await signUp.create(req.body);
      res.restResponse(user);
    } catch(e) {
      logger.error(`[services][user][routes][sign-up]`);
      logger.error(e);
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

You can access to the manager through the "serviceGateway".<br/>
<code>serviceGateway.serviceName.manager('managerName');</code>

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
        console.log(validate.fields);
        return await serviceGateway.user.model.createUser(validate.fields);
      } else {
        throw exceptions(404, 'Could not create new user', validate.errors);
      }
    } catch (e) {
      logger.error("[managers][SignUp]", e);
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

  /**
   * Create new user
   * @param  {Object}  userData User data
   * @return {Promise}          Response
   */
  async createUser(userData) {
    try {
      let user = await this.collection.create(userData);
      user = await this.collection.find({ _id: this.types.ObjectId(user._id) });
      console.log(user);
      return user;
    } catch (e) {
      logger.error("[UserModel][createUser]", e);
      throw e;
    }
  }
}
```

#### Access Mongoose Types
Example - Inside models

```
  async updateUser(id, userData) {
    try {
      return await this.collection.updateOne({ _id: this.types.ObjectId(id) }, userData);
    } catch (e) {
      logger.error("[UserModel][updateUser]", e);
      throw e;
    }
  }
```

Example - Outside model

```
const serviceGateway = require('services');
const sirexjs = require('sirexjs');

module.exports = (id) => {
  let types = sirexjs.Database.mongodb.types;
  await serviceGateway.user.model.collection.updateOne({ _id: types.ObjectId(id) }, { callsign: 'Boo' });
}
```

#### Global extensions
These methods are globally accessible and are there to make your development process easier.

##### Logging
Logger is and extension of [Winston](https://www.npmjs.com/package/winston) for more about how to use Winston go the the previous link.

<code>logger.info("Info logs here");</code><br/>
<code>logger.error("Error logs here");</code>

##### Validation
Valodation was built using [validator](https://www.npmjs.com/package/validator). It was modified to by a bit more compaced.

```
const validate = validation();
validate.setValidFields({
  'callsign': {
    'rules': 'required'
  },
  'email': {
    'rules': 'required|email'
  }
});

if (validate.isValid(data)) {
  logger.info(validate.fields);
} else {
  throw exceptions(404, 'Could not create new user', validate.errors);
}
```

Types:

- required
- string
- integer
- float
- boolean
- date

You can pipe types. Require a field and type:

```
  'email': {
    'rules': 'required|email'
  }
```

##### Exceptions
API response and exceptions work together. Make sure all exceptions caught is eventually passed to the route response.

Example: <br/>
exception(response_cde, 'Description', colleciton_of_errors); <br/>

<code> throw exceptions(404, 'Could not create new user', validate.errors); </code>

##### API response
Display data back to users.
<br/>Data displayed
<code>res.restResponse(responseData);</code>

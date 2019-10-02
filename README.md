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
### Install globally
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
Creating a new feature is sometimes a tedious process, using the CLI “service” options creates a new service in the main services folder with a predefined folder structure.

### Getting started
Create a new service called “user” with an attached API end-point.

Inside the project folder run:

<code>
sirexjs
</code>

Choose the options “service - Create new service” follow prompts and create user service.

#### service route
Add the following router to a service.

<code>router.use('/user', serviceGateway.user.routes);</code>

Example:
```
# project/src/router/index.js

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

Add sub-routes to a service

```
router.post('/sign-up', async (req, res) => {
    try {
      const signUp = serviceGateway.user.manager('SignUp', 'init');
      const user = await signUp.create(req.body);
      res.restResponse(user);
    } catch(e) {
      logger.error(`[services][user][routes][sign-up]`);
      logger.error(e);
      res.restResponse(e);
    }
  })
```

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
      const signUp = serviceGateway.user.manager('SignUp', 'init');
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

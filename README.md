# node-server
This repo is recap via Nodejs anything method and knowledge to create app, server, api, etc.

## nodejs-server-native
- Spin up a Node.js-driven Server (on port 3000)
- Handle two Routes: '/' and 'users'
  - Return some greeting text on '/'
  - Return a list of dummy users
- Add a form with a 'username' `<input>` to the '/' page and submit a POST request to '/create-user' upon a button click
- Add the '/create-user' route and parse the incoming data (i.e this username) and simply log it to the console

## express-middleware
- Create an Express.js app which funnels the request through 2 middleware functions that log something to the console and return one response.
- Handle requests to "/" and "/users" such that each request only has one handler/ middleware that does something with it.

## express-app
- Create an Express.js app witch severs two HTML files for '/' and '/users'.
- Add some static files to this project that should be require by at least one of HTML files.
- Use template engine to apply two route, and output filed data to index page.
# simple-shopping-cart

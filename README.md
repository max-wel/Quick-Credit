# Quick-Credit
Online lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

[![Build Status](https://travis-ci.com/sneakymaxy/Quick-Credit.svg?branch=develop)](https://travis-ci.com/sneakymaxy/Quick-Credit)
[![Coverage Status](https://coveralls.io/repos/github/sneakymaxy/Quick-Credit/badge.svg?branch=develop)](https://coveralls.io/github/sneakymaxy/Quick-Credit?branch=develop)

## Required Features
* User (client) can sign up
* User (client) can login 
* User (client) can request for ​only​ one loan at a time. 
* User (client) can view loan repayment history, to keep track of his/her liability or  responsibilities
* Admin can mark a client as ​verified​, after confirming his/her home and work address
* Admin can view a specific loan application.  
* Admin can approve or reject a client’s loan application.
* Admin can post loan repayment transaction in favour of a client.  
* Admin can view all loan applications.  
* Admin can view all current loans (not fully repaid)
* Admin can view all repaid loans. 

## Optional Features
* User can reset password
* Integrate real time email notification upon approval or           rejection of a loan request. 

## Project Management
Project is managed [here](https://www.pivotaltracker.com/n/projects/2326742) using the project management tool, [Pivotal Tracker](https://www.pivotaltracker.com)

## Templates
UI templates are hosted on Github pages [here](https://sneakymaxy.github.io/Quick-Credit/)

## Technologies Used
* [Node.js](https://nodejs.org) - A runtime environment based off of Chrome's V8 Engine for writing Javascript code on the server
* [Express.js](https://expressjs.com) - Web framework based on Node.js.
* [Babel](https://babeljs.io) - Javascript transpiler
* [Eslint](https://eslint.org/) - Javascript linter
* [Airbnb](https://github.com/airbnb/javascript) - Style guide

### Testing tools
* [Mocha](https://mochajs.org/) - A Javascript test framework
* [Chai](http://chaijs.com) - Assertion library
* [nyc](https://github.com/istanbuljs/nyc) - Code coverage tool

## Getting Started

### Installation
* Install [NodeJs](https://nodejs.org/en/download/)
* Clone this repository using `git clone https://github.com/sneakymaxy/Quick-Credit.git`
* Run `npm install` to install dependencies in package.json
* Run `npm start:dev` to start the server

### Testing
Run `npm test`

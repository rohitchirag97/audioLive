const express = require('express');
require('dotenv').config(); // Load .env file
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors'); // For colorizing console output
const schema = require('./schema/schema');
const connectDB = require('./config/db'); // connect to database

const port = process.env.PORT || 5000; // process.env.PORT is a variable that is set by Heroku

const app = express(); // create express app

connectDB(); // connect to database

app.use(
    '/graphql',
    graphqlHTTP({
        schema, // schema: schema,
        graphiql: process.env.NODE_ENV === 'development' // if we are in development mode, we want to show the graphiql interface
    })
);

app.listen(port, console.log(`Server running on Port ${port}`)); // listen on port 


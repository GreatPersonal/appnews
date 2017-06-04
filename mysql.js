"use strict";
const mysql = require('mysql');
const config = require('./config');
let pool = mysql.createPool(config);
module.exports = pool;
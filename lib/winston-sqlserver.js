/**
 * Module dependencies
 */
var util = require('util');
var winston = require('winston');
var sql = require('node-sqlserver');

/**
 * Expose 'SQLServer'
 */
 module.exports = SQLServer;

 /**
  * Expose the name of this transport on the prototype
  */
 SQLServer.prototype.name = 'sqlserver';

 /**
  * Initialize a 'SQLServer' transport object with the given 'options'.
  *
  * Events:
  *
  *
  * @param {Object} options
  * @api private
  */
 function SQLServer(options) {
 	options = options || {};

 	winston.Transport.call(this, options);

 	this.name = 'sqlserver';
 	this.connectionString = options.connectionString || 'Driver={SQL Server Native Client 11.0};Server=(local);Trusted_Connection={Yes};Database={winston}';
 }

 /**
  * Inherits from 'winston.Transport'
  */
 util.Inherits(SQLServer, winston.Transport);

 /**
  * Define a getter so that 'winston.transports.SQLServer' is available and thus backwards compatible
  */
 winston.transports.SQLServer = SQLServer;

 
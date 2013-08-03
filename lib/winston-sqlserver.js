/**
 * Module dependencies
 */
var util = require('util');
var winston = require('winston');
var sql = require('msnodesql');
var moment = require('moment');

 /**
  * @constructs SQLServer
  * @param {Object} options
  * @api private
  */
var SQLServer = exports.SQLServer = function(options) {
	winston.Transport.call(this, options);

	options = options || {};

	this.name = 'sqlserver';
	this.connectionString = options.connectionString || 'Driver={SQL Server Native Client 11.0};Server=(local);Trusted_Connection=Yes;Database=winston';
	this.table = options.table || 'dbo.NodeLogs';
}

 /**
  * @extends winston.Transport
  */
util.inherits(SQLServer, winston.Transport);

/**
* Define a getter so that `winston.transports.SQLServer`
* is available and thus backwards compatible.
*/
winston.transports.SQLServer = SQLServer;

 /**
  * Expose the name of this transport on the prototype
  */
SQLServer.prototype.name = 'sqlserver';

/**
 * Core Winston logging method
 *
 * @level {String} level to log at
 * @msg {String} message to log
 * @meta {object} metadata to attach to the messages
 * @callback {Function} callback to respond to when complete
 * @api public
 */
SQLServer.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback && callback(null, true);
    };

    var self = this;

    var currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    var query = 'INSERT INTO ' + this.table + ' (LogDate, Level, Message) VALUES (?, ?, ?)';
    var values = [currentDate, level, msg];
    sql.queryRaw(this.connectionString, query, values, function(err, results) {
		if (err) {
			self.emit('error', err);
		}

		self.emit('logged', results.rowcount);
		callback(null, true);
	});
};

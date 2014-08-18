/**
 * Module dependencies
 */
var util = require('util'),
    winston = require('winston'),
    tedious = require('tedious'),
    moment = require('moment');

/**
 * @constructs SQLServer
 * @param {Object} options
 * @api private
 */
var SQLServer = exports.SQLServer = function(options) {
    winston.Transport.call(this, options);

    options = options || {};

    this.name = 'sqlserver';
    this.connectionConfig = options.connectionConfig || {
        server: 'localhost',
        options: {
            database: 'winston'
        }
    };
    this.table = options.table || 'dbo.NodeLogs';
    this.connection = new tedious.Connection(this.connectionConfig)
        .on('connect', function (err) {
            if(err)
                winston.log('error', err);
            else
                winston.log('info', 'connection ready');
        })
        .on('error', function (err) {
            winston.log('error', err);
        });
    this.query = 'INSERT INTO ' + this.table + ' (LogDate, Level, Message) VALUES (@LogDate, @Level, @Message)';
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
 */
SQLServer.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback && callback(null, true);
    };

//    var self = this;
//    if(!this.connection.loggedIn){
//        if( this.connection.closed) {
//            return callback(null, false);
//        }
//        return setTimeout(function () {
//            self.log(level, msg, meta, callback);
//        }, 1000);
//    } else if(this.connection.closed){
//        return callback(null, false);
//    }

    if(!this.connection.loggedIn  || this.connection.closed){
        return callback(null, false);
    }

    var request = new tedious.Request(this.query, function(err, results) {
        if (err) {
            self.emit('error', err);
            return callback(err, false);
        }
        callback(null, true);
    });

    request.addParameter('LogDate', tedious.TYPES.VarChar, moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
    request.addParameter('Level', tedious.TYPES.NVarChar, level);
    request.addParameter('Message', tedious.TYPES.NVarChar, msg);

    this.connection.execSql(request);
};

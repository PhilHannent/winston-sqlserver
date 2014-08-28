var util = require('util'),
    winston = require('winston'),
    tedious = require('tedious'),
    moment = require('moment'),
    genericPool = require('generic-pool');

var SQLServer = exports.SQLServer = function (options) {
    winston.Transport.call(this, options);

    options = options || {};
    var self = this;
    self.name = 'sqlserver';
    self.connectionConfig = options.connectionConfig || {
        server: 'localhost',
        options: {
            database: 'winston'
        }
    };
    self.table = options.table || 'dbo.NodeLogs';
    self.poll = genericPool.Pool({
        min: 1,
        max: 5,
        refreshIdle: false,
        idleTimeoutMillis: 30000,
        create: function (callback) {
            var connection = new tedious.Connection(self.connectionConfig).on('connect', function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, connection);
                }
            });
        },
        destroy: function (connection) {
            connection.close();
        },
        validator: function() {
            return !this.connection.loggedIn || this.connection.closed;
        }
    });
    this.query = 'INSERT INTO ' + this.table + ' (LogDate, Level, Message) VALUES (@LogDate, @Level, @Message)';
};

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
    }

    var self = this;
    self.poll.acquire(function (err, connection) {
        if (err) {
            return callback(err, false);
        }

        var request = new tedious.Request(self.query, function (err) {
            self.poll.release(connection);
            if (err) {
                self.emit('error', err);
                return callback(err, false);
            }
            callback(null, true);
        });

        request.addParameter('LogDate', tedious.TYPES.VarChar, moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
        request.addParameter('Level', tedious.TYPES.NVarChar, level);
        request.addParameter('Message', tedious.TYPES.NVarChar, msg);
        connection.execSql(request);
    });
};

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
        max: 50,
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
            if (!this.connection.loggedIn || this.connection.closed) {
                return true;
            } else {
                return false;
            }
        }
    });
    this.query = 'INSERT INTO ' + this.table + ' (LogDate, Level, Message) VALUES (@LogDate, @Level, @Message)';
}


util.inherits(SQLServer, winston.Transport);
winston.transports.SQLServer = SQLServer;
SQLServer.prototype.name = 'sqlserver';

SQLServer.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback && callback(null, true);
    }

    var self = this;
    self.poll.acquire(function (err, connection) {
        if (err) {
            throw err;
        }

        var request = new tedious.Request(self.query, function (err, rowCount, results) {
            if (err) {
                console.log(err.message);
                self.emit('error', err);
                return callback(err, false);
            }
            callback(null, true);

            self.poll.release(connection);
        });

        request.addParameter('LogDate', tedious.TYPES.VarChar, moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
        request.addParameter('Level', tedious.TYPES.NVarChar, level);
        request.addParameter('Message', tedious.TYPES.NVarChar, msg);

        connection.execSql(request);
    });
};

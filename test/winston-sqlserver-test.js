require('mocha');
var should = require('should'),
    sql = require('tedious'),
    config = require('./test-config'),
    tedious = require('tedious'),
    winston = require('winston');
require('../lib/winston-sqlserver.js');

describe('winston-sqlserver init', function () {
    it('should expose SQLServer transport', function () {
        should.exist(winston.transports.SQLServer);
    });
//		it('should have default options', function() {
//			winston.transports.SQLServer.should.have.property(name);
//			winston.transports.SQLServer.name.should.equal('sqlserver');
//			winston.transports.SQLServer.should.have.property(connectionString);
//			winston.transports.SQLServer.connectionString.should.match(/^Driver.+/);
//		});
});

winston.remove(winston.transports.Console);

var connection;
describe('winston-sqlserver log', function () {
    before(function (done) {
        winston.add(winston.transports.SQLServer, {connectionConfig: config.connectionConfig});

        connection = new tedious.Connection(config.connectionConfig)
            .on('connect', function (err) {
                if (err) {
                    winston.error(err);
                } else {
                    winston.info('connection ready');
                }

                done(err);
            })
            .on('error', function (err) {
                winston.log('error', err);
                done(err);
            });
    });

    it('should log an info message', function (done) {
        var message = 'Test info log ' + Math.random(),
            querySuffix = 'FROM ' + config.table + ' WHERE Message LIKE \'' + message + '\'';
        winston.info(message);

        setTimeout(function () {
            var requestSelect = new tedious.Request('SELECT * ' + querySuffix, function (err, rowCount, results) {
                if (err) {
                    throw err;
                }

                results.should.have.length(1);

                var row = rowToObj(results[0]);
                row.should.have.property('Level');
                row.Level.should.equal('info');
                row.should.have.property('Message');
                row.Message.should.equal(message);

                done();
                /*var requestDelete = new tedious.Request('DELETE ' + querySuffix, function (err, rowCount, results) {
                    if (err) {
                        throw err;
                    }

                    done();
                });
                connection.execSql(requestDelete);*/
            });
            connection.execSql(requestSelect);
        }, 5000);
    });

    it('should log an error message', function (done) {
        var message = 'Test error log ' + Math.random(),
            querySuffix = 'FROM ' + config.table + ' WHERE Message LIKE \'' + message + '\'';
        winston.error(message);

        setTimeout(function () {
            var requestSelect = new tedious.Request('SELECT * ' + querySuffix, function (err, rowCount, results) {
                if (err) {
                    throw err;
                }

                results.should.have.length(1);

                var row = rowToObj(results[0]);
                row.should.have.property('Level');
                row.Level.should.equal('error');
                row.should.have.property('Message');
                row.Message.should.equal(message);

                done();
                /*var requestDelete = new tedious.Request('DELETE ' + querySuffix, function (err, rowCount, results) {
                    if (err) {
                        throw err;
                    }

                    done();
                });
                connection.execSql(requestDelete);*/
            });
            connection.execSql(requestSelect);
        }, 5000);
    });

    it('should log an warn message', function (done) {
        var message = 'Test warn log ' + Math.random(),
            querySuffix = 'FROM ' + config.table + ' WHERE Message LIKE \'' + message + '\'';
        winston.warn(message);

        setTimeout(function () {
            var requestSelect = new tedious.Request('SELECT * ' + querySuffix, function (err, rowCount, results) {
                if (err) {
                    throw err;
                }

                results.should.have.length(1);

                var row = rowToObj(results[0]);
                row.should.have.property('Level');
                row.Level.should.equal('warn');
                row.should.have.property('Message');
                row.Message.should.equal(message);

                done();
                /*var requestDelete = new tedious.Request('DELETE ' + querySuffix, function (err, rowCount, results) {
                    if (err) {
                        throw err;
                    }

                    done();
                });
                connection.execSql(requestDelete);*/
            });
            connection.execSql(requestSelect);
        }, 5000);
    });
});

function rowToObj(row) {
    var ret = {};
    for (var i in row) {
        ret[row[i].metadata.colName] = row[i].value;
    }
    return ret;
}
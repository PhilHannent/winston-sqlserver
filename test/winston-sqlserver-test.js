require('mocha');
var should = require('should'),
    sql = require('tedious'),
    config = require('./test-config'),
    tedious = require('tedious'),
    winston = require('winston');
require('../lib/winston-sqlserver.js');

describe('winston-sqlserver init', function() {
    it('should expose SQLServer transport', function() {
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
describe('winston-sqlserver log', function() {

    before(function(done) {
        winston.add(winston.transports.SQLServer, {connectionConfig: config.connectionConfig});
        connection = new tedious.Connection(config.connectionConfig)
            .on('connect', function (err) {
                if(err)
                    winston.log('error', err);
                else
                    winston.log('info', 'connection ready');

                done(err);
            })
            .on('error', function (err) {
                winston.log('error', err);
                done(err);
            });
    });


    it('should log an info message', function(done) {

        var message = 'Test info log ' + Math.random(),
            querySuffix = " FROM " + config.table + " WHERE Message LIKE '" + message + "'";
        winston.log('info', message);

        var request = new tedious.Request("SELECT *" + querySuffix, function(err, rowCount, results) {
            if (err) throw err;

            results.should.have.length(1);
            results[0].should.have.property('Level');
            results[0].Level.should.equal('info');
            results[0].should.have.property('Message');
            results[0].Message.should.equal(message);
            sql.query(connectionString, "DELETE FROM" + querySuffix);
            done();
        });
        connection.execSql(request);
    });

    it('should log an error message', function(done) {
        setTimeout(function () {
            var message = 'Test error log ' + Math.random(),
                querySuffix = " FROM " + config.table + " WHERE Message LIKE '" + message + "'";
            winston.error(message);
            var request = new tedious.Request( "SELECT *" + querySuffix, function(err, rowCount, results) {
                if (err) throw err;

                results.should.have.length(1);
                results[0].should.have.property('Level');
                results[0].Level.should.equal('error');
                results[0].should.have.property('Message');
                results[0].Message.should.equal(message);
                sql.query(connectionString, "DELETE FROM" + querySuffix);
                done();
            });
            connection.execSql(request);
        }, 10000);
    });

    it('should not log when silent', function(done) {
        var message = 'Test info log ' + Math.random(),
            query = "SELECT * FROM " + config.table + " WHERE Message LIKE '" + message + "'";
        winston.log('info', message);
        var request = new tedious.Request( query, function(err, rowCount, results) {
            if (err) throw err;

            results.should.have.length(0);
            done();
        });
        connection.execSql(request);
    });

    it('should use table option', function(done) {
        var message = 'Test info log ' + Math.random(),
            querySuffix = " FROM " + config.table2 + " WHERE Message LIKE '" + message + "'";
        winston.log('info', message);
        var request = new tedious.Request( "SELECT *" + querySuffix, function(err, rowCount, results) {
            if (err) throw err;

            results.should.have.length(1);
            results[0].should.have.property('Level');
            results[0].Level.should.equal('info');
            results[0].should.have.property('Message');
            results[0].Message.should.equal(message);
            sql.query(connectionString, "DELETE FROM" + querySuffix);
            done();
        });
        connection.execSql(request);
    });
});

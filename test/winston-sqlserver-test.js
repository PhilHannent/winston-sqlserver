require('mocha');
var should = require('should');
var sql = require('msnodesql');
var config = require('./test-config');
var winston = require('winston');
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

describe('winston-sqlserver log', function() {

	it('should log an info message', function(done) {
		winston.add(winston.transports.SQLServer, {connectionString: config.connectionString});
		var connectionString = config.connectionString,
			message = 'Test info log ' + Math.random(),
			querySuffix = " FROM " + config.table + " WHERE Message LIKE '" + message + "'";
		winston.log('info', message);
		sql.query(connectionString, "SELECT *" + querySuffix, function(err, results) {
			if (err) throw err;

			results.should.have.length(1);
			results[0].should.have.property('Level');
			results[0].Level.should.equal('info');
			results[0].should.have.property('Message');
			results[0].Message.should.equal(message);
			sql.query(connectionString, "DELETE FROM" + querySuffix);
			done();
		});
		winston.remove(winston.transports.SQLServer);
	});

	it('should log an error message', function(done) {
		winston.add(winston.transports.SQLServer, {connectionString: config.connectionString});
		var connectionString = config.connectionString,
			message = 'Test error log ' + Math.random(),
			querySuffix = " FROM " + config.table + " WHERE Message LIKE '" + message + "'";
		winston.error(message);
		sql.query(connectionString, "SELECT *" + querySuffix, function(err, results) {
			if (err) throw err;

			results.should.have.length(1);
			results[0].should.have.property('Level');
			results[0].Level.should.equal('error');
			results[0].should.have.property('Message');
			results[0].Message.should.equal(message);
			sql.query(connectionString, "DELETE FROM" + querySuffix);
			done();
		});
		winston.remove(winston.transports.SQLServer);
	});

	it('should not log when silent', function(done) {
		winston.add(winston.transports.SQLServer, {connectionString: config.connectionString, silent: true});
		var connectionString = config.connectionString,
			message = 'Test info log ' + Math.random(),
			query = "SELECT * FROM " + config.table + " WHERE Message LIKE '" + message + "'";
		winston.log('info', message);
		sql.query(connectionString, query, function(err, results) {
			if (err) throw err;

			results.should.have.length(0);
			done();
		});
		winston.remove(winston.transports.SQLServer);
	});

	it('should use table option', function(done) {
		winston.add(winston.transports.SQLServer, {connectionString: config.connectionString, table: config.table2});
		var connectionString = config.connectionString,
			message = 'Test info log ' + Math.random(),
			querySuffix = " FROM " + config.table2 + " WHERE Message LIKE '" + message + "'";
		winston.log('info', message);
		sql.query(connectionString, "SELECT *" + querySuffix, function(err, results) {
			if (err) throw err;

			results.should.have.length(1);
			results[0].should.have.property('Level');
			results[0].Level.should.equal('info');
			results[0].should.have.property('Message');
			results[0].Message.should.equal(message);
			sql.query(connectionString, "DELETE FROM" + querySuffix);
			done();
		});
		winston.remove(winston.transports.SQLServer);
	});
});

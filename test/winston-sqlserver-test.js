require('mocha');
var should = require('should');
var sql = require('node-sqlserver');
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

winston.add(winston.transports.SQLServer, {connectionString: config.connectionString})
.remove(winston.transports.Console);

describe('winston-sqlserver log', function() {
	it('should log an info message', function(done) {
		var connectionString = config.connectionString,
			message = 'Test info log ' + Math.random(),
			query = 'SELECT * FROM ' + config.table + ' WHERE Message LIKE \'' + message + '\'';
		winston.log('info', 'message');
		sql.query(connectionString, query, function(err, results) {
			if (err) throw err;

			results.should.have.length(1);
			results[0].should.have.property('Level');
			results[0].Level.should.equal('info');
			results[0].should.have.property('Message');
			results[0].Message.should.equal(message);
			done();
		});
	});
});

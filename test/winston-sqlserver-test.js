require('mocha');
require('should');
var sql = require('node-sqlserver');
var config = require('./test-config');
var winston = require('winston');
require('../lib/winston-sqlserver.js');

describe('winston-sqlserver init', function() {
		it('should expose SQLServer transport', function() {
			winston.transports.should.have.property('SQLServer');
//			winston.transports.SQLServer.should.have.property('log');
//			should.exist(winston.transports.SQLServer);
//			should.exist(winston.transports.SQLServer.log);
		});
});

/*
winston
	.add(winston.transports.SQLServer, options)
	.remove(winston.transports.Console);
*/

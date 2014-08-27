// Update the below values with your settings
var driver = 'SQL Server Native Client 11.0';
var server = '.\\SQLEXPRESS';
var userId = '';
var password = '';
var database = 'winston';
var trustedConnection = true;
var table = 'dbo.NodeLogs';

exports.driver = driver;
exports.server = server;
exports.userId = userId;
exports.password = password;
exports.database = database;
exports.trustedConnection = trustedConnection;
exports.connectionConfig = {
    "userName": "*",
    "password": "*",
    "server": "*",
    "options": {
        "encrypt": true,
        "database": "*",
        "port": 1433,
        "rowCollectionOnRequestCompletion": true
    }
};
exports.table = table;
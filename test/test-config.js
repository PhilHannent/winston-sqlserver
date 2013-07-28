// Update the below values with your settings
var driver = 'SQL Server Native Client 11.0';
var server = '.\\SQLEXPRESS';
var userId = '';
var password = '';
var database = 'winston';
var trustedConnection = true;
var table = 'dbo.NodeLogs';
var table2 = 'dbo.NodeLogs2';



// Generate connection string and exports
var connectionString =
	"Driver={" + driver + "};" +
	"Server=" + server + ";" +
	"Database=" + database + ";" +
	(trustedConnection === true ?
		"Trusted_Connection=Yes;" :
		"Uid=" + userId + ";Pwd=" + password + ";");
exports.driver = driver;
exports.server = server;
exports.userId = userId;
exports.password = password;
exports.database = database;
exports.trustedConnection = trustedConnection;
exports.connectionString = connectionString;
exports.table = table;
exports.table2 = table2;

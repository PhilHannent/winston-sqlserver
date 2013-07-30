# winston-sqlserver

This module allows you to log your [winston](//github.com/flatiron/winston/) messages to any SQL Server database supported by [node-sqlserver](//github.com/WindowsAzure/node-sqlserver/).

## Installation

1. Follow the steps in [How to Access Windows Azure SQL Database from Node.js](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/sql-database/) to get the [node-sqlserver](//github.com/WindowsAzure/node-sqlserver/) package installed.
2. Run `npm install winston-sqlserver`.
3. In the database you will use for logging, execute `CreateLogTable.sql` to create a table of the form necessary for this package.

## Usage

```js
var winston = require('winston');
require('winston-sqlserver');
winston.add(winston.transports.SQLServer, options);
```

### Options

This transport takes the following options:

* __connectionString:__ Connection string that this transport should use (default 'Driver={SQL Server Native Client 11.0};Server=(local);Trusted_Connection=Yes;Database=winston').
* __table:__ Table name to log to (default 'dbo.NodeLogs').

## Testing

Unit tests can be found in the `test` directory and executed with `npm test`.
They are driven by [mocha](//github.com/visionmedia/mocha) and [should](//github.com/visionmedia/should.js).
The default settings assume SQL Express has been installed and `CreateLogTable.sql` has been run in a database called **winston** (connection string: `Driver={SQL Server Native Client 11.0};Server=.\SQLEXPRESS;Database=winston;Trusted_Connection=Yes;`).
You can change this by editing the variables in `test/test-config.js`.

# winston-sqlserver

This module allows you to log your [winston](//github.com/flatiron/winston/) messages to a SQL Server database using [node-sqlserver](//github.com/WindowsAzure/node-sqlserver/).

## Installation

1. Follow the steps in [How to Access Windows Azure SQL Database from Node.js](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/sql-database/) to get the [node-sqlserver](//github.com/WindowsAzure/node-sqlserver/) package installed.
2. Run `npm install winston-sqlserver`.
3. In the database you will use for logging, execute `CreateLogTable.sql` to create a table of the form necessary for this package.

## Usage

```js
var winston = require('winston');

// Requiring `winston-sqlserver` will expose `winston.transports.SQLServer`
require('winston-sqlserver');

winston.add(winston.transports.SQLServer, options);
```

## Testing

Unit tests can be found in the `test` directory.
They require [mocha](//github.com/visionmedia/mocha) and [should](//github.com/visionmedia/should.js) to be installed via npm.
Testing can be configured with variables in test-config.js.
The default settings assume SQL Express has been installed and `CreateLogTable.sql` has been run in a database called **winston**.

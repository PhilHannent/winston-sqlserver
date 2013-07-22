# winston-sqlserver

This module allows you to log your [winston](//github.com/flatiron/winston/) messages to a SQL Server database using [node-sqlserver](//github.com/WindowsAzure/node-sqlserver/).

## Installation

Coming soon.

## Usage

```js
var winston = require('winston');

// Requiring `winston-sqlserver` will expose `winston.transports.SQLServer`
require('winston-sqlserver');

winston.add(winston.transports.SQLServer, options);
```

## Thanks

Developed based on the [winston-sqlite](//github.com/floatingLomas/winston-sqlite/) and [winston-mail](//github.com/wavded/winston-mail/) projects.

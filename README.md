# HAR Generator

[![npm version](https://badge.fury.io/js/har-generator.svg)](https://badge.fury.io/js/har-generator)

Simple har scrapper by headless chrome

## Requirements

[NodeJs 8.0 up](https://nodejs.org/en/download/)

## Getting Start

### Install package

```bash
npm install har-generator
```

### Example

```javascript
const HarGenerator = require('har-generator');
const options = {
    url: 'https://github.com/Asing1001/har-generator',
    harFolder: 'dist',
    prettify: false,
    jobInterval: 1
}
const harGen = new HarGenerator(options);
harGen.start();
```

### Options

- `Tasks`: it is an array, you could add more task to run in parallel
- `url`: target url for har
- `harFolder`: destination for saving har files
- `prettify`: default `false`, set to `true` for human read
- `jobInterval`: interval in minute for trigger next run

### Others

- If chrome memory high or could not connect

```javascript
const { cleanup } = require('./lib/harGenerator');
cleanup()
```
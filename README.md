# HAR Generator

[![npm version](https://badge.fury.io/js/har-generator.svg)](https://badge.fury.io/js/har-generator)

This project help you create simple job for saving har by headless chrome.

## Requirements

[NodeJs 8.0 up](https://nodejs.org/en/download/)

## Getting Start

### Install package

```bash
npm install
```

### Modify Configuration

Go to [config.js](config.js) to change configuration.

- `Tasks`: it is an array, you could add more task to run in parallel
- `url`: target url for har
- `harFolder`: destination for saving har files
- `prettify`: default `false`, set to `true` for human read
- `jobInterval`: interval in minute for trigger next run

### Start Program

```bash
npm start
```

## Example

```javascript
const { tasks } = require('./config');
const HarGenerator = require('./harGenerator');

tasks.forEach(options => {
    const harGen = new HarGenerator(options);
    harGen.start();
})
```

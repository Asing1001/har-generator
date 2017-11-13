const { tasks } = require('./config');
const HarGenerator = require('.');

tasks.forEach(options => {
    const harGen = new HarGenerator(options);
    harGen.start();
})
const { tasks } = require('./config');
const HarGenerator = require('../lib/harGenerator');

tasks.forEach(options => {
    const harGen = new HarGenerator(options);
    harGen.start();
})
const { tasks } = require('./config');
const HarGenerator = require('../index');

tasks.forEach(options => {
    const harGen = new HarGenerator(options);
    harGen.start();
})
const { tasks } = require('./config');
const HarGenerator = require('./harGenerator');

tasks.forEach(options => {
    const harGen = new HarGenerator(options);
    harGen.start();
})
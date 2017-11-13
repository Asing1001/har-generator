const { runChromeHeadless, killChrome } = require('./lib/command');

killChrome().then(runChromeHeadless)

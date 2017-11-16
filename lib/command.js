const { exec } = require('child_process');
const { logger } = require('./logger');

async function runChromeHeadless(chromePath) {
    return new Promise(resolve => {
        const cmd = `"${chromePath}" --remote-debugging-port=9222 --disable-gpu --headless`;
        const option = {
            timeout: 2000
        }
        exec(cmd, option, (err, stdout, stderr) => {
            if (err)
                logger.error('reInitChrome throw error', err);

            if (stderr)
                logger.error('stderr:', stderr);

            if (stdout)
                logger.info('stdout:', stdout);

            resolve();
        })
    })
}

async function killChrome() {
    return new Promise(resolve => {
        exec('taskkill /F /IM chrome.exe', (err, stdout, stderr) => {
            if (err)
                logger.error('killChrome throw error', err);

            if (stderr)
                logger.error('stderr:', stderr);

            if (stdout)
                logger.info('stdout:', stdout);

            resolve();
        })
    })
}

module.exports = { runChromeHeadless, killChrome }

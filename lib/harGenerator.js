const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const chromeHar = require('chrome-har-capturer');
const moment = require('moment');
const { ensureDir } = require('./util');
const { logger } = require('./logger');
const { runChromeHeadless, killChrome } = require('./command');

module.exports = class HarGenerator {
    constructor({ url, prettify, jobInterval, harFolder, fileDateFormat = 'MM-DD_HH-mm-ss', chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' }) {
        this.url = url
        this.prettify = prettify
        this.harFolder = harFolder
        this.jobInterval = jobInterval
        this.fileDateFormat = fileDateFormat
        this.chromePath = chromePath
    }

    async start() {
        this.ip = await this.getMyIp();
        logger.info(`Current externalip : ${this.ip}`);
        this.filePrefix = this.getFilePrefix(this.url)
        ensureDir(this.harFolder);
        this.fetchHar(this.url);
        setInterval(() => this.fetchHar(this.url), this.jobInterval * 60 * 1000)
    }

    fetchHar(url) {
        chromeHar.run([url])
            .on('har', this.saveHar.bind(this))
            .on('fail', (url, err) => {
                if (err.code === 'ECONNREFUSED') {
                    HarGenerator.cleanup({ chromePath: this.chromePath })
                }
                logger.error(`${url} got error, error : ${err}`)
            })
            .on('load', (url) => logger.info(`loading ${url} ...`))
            .on('done', (url) => logger.info(`${url} done.`))
    }

    saveHar(har) {
        har.ip = this.ip;
        const json = JSON.stringify(har, null, this.prettify ? 2 : 0);
        const dateFileName = moment().format(this.fileDateFormat);
        const fileName = `${this.harFolder}/${this.filePrefix}_${dateFileName}.har`;
        fs.writeFile(fileName, json, (err) => {
            if (err) logger.error(err)
            logger.info(`complete save har to ${fileName}`)
        });
    }

    getFilePrefix(url) {
        const urlPart = new URL(url)
        return (urlPart.host + urlPart.pathname).replace(/\//g, '_')
    }

    async getMyIp() {
        let ip = '';
        return new Promise(resolve => {
            http.get('http://bot.whatismyipaddress.com', res => {
                res.on('data', chunk => ip += chunk);
                res.on('error', err => {
                    logger.info(`can not get ip, error: ${err} `);
                    resolve('not available')
                });
                res.on('end', () => resolve(ip));
            })
        })
    }

    static async cleanup({chromePath}) {
        await killChrome()
        await runChromeHeadless(chromePath)
    }
}

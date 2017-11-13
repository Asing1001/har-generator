const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const chromeHar = require('chrome-har-capturer');
const moment = require('moment');
const { ensureDir } = require('./util');
const { logger } = require('./logger');

module.exports = class HarGenerator {
    constructor({ url, prettify, jobInterval, harFolder }) {
        this.ip = ''
        this.url = url
        this.urlPart = new URL(this.url)
        this.prettify = prettify
        this.harFolder = harFolder
        this.jobInterval = jobInterval
    }

    async start() {
        this.ip = await this.getMyIp();
        logger.info(`Current externalip : ${this.ip}`);
        ensureDir(this.harFolder);
        this.fetchHar(this.url);
        setInterval(() => this.fetchHar(this.url), this.jobInterval * 60 * 1000)
    }

    fetchHar(url) {
        chromeHar.run([url])
            .on('har', this.saveHar.bind(this))
            .on('fail', (url, err) => logger.error(`${url} got error, error : ${err}`))
            .on('load', (url) => logger.info(`loading ${url} ...`))
            .on('done', (url) => logger.info(`${url} done.`))
    }

    saveHar(har) {
        har.ip = this.ip;
        const json = JSON.stringify(har, null, this.prettify ? 2 : 0);
        const dateFileName = `${this.harFolder}/${this.urlPart.host}_${moment().format('MM-DD_HH-MM-ss')}.json`;
        fs.writeFile(dateFileName, json, (err) => {
            if (err) logger.error(err)
            logger.info(`complete save har to ${dateFileName}`)
        });
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
}

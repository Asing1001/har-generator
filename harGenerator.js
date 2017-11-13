const chromeHar = require('chrome-har-capturer');
const { requestUrls, indentJson, jobInterval, harFolder } = require('./config');
const moment = require('moment');
const { ensureDir } = require('./util');
const fs = require('fs');
const http = require('http');

module.exports = class HarGenerator {
    constructor({ url, prettify, jobInterval, harFolder }) {
        this.url = url
        this.prettify = prettify
        this.harFolder = harFolder
        this.jobInterval = jobInterval
        this.ip = ''
    }

    async start() {
        this.ip = await this.getMyIp();
        console.log(`Current externalip : ${this.ip}`);
        ensureDir(this.harFolder);
        this.fetchHar(this.url);
        setInterval(() => this.fetchHar(this.url), this.jobInterval * 60 * 1000)
    }

    fetchHar(url) {
        chromeHar.run([url])
            .on('har', this.saveHar.bind(this))
            .on('fail', (url, err) => console.error(`${url} got error, error : ${err}`))
            .on('load', (url) => console.log(`${url} is loading...`))
            .on('done', (url) => console.log(`${url} is done.`))
    }

    saveHar(har) {
        har.ip = this.ip;
        const json = JSON.stringify(har, null, this.prettify ? 2 : 0);
        const dateFileName = `${this.harFolder}/${moment().format('MM-DD_HH-MM-ss')}.json`;
        fs.writeFile(dateFileName, json, (err) => {
            if (err) console.error(err)
            console.log(`complete save har to ${dateFileName}`)
        });
    }

    async getMyIp() {
        let ip = '';
        return new Promise(resolve => {
            http.get('http://bot.whatismyipaddress.com', res => {
                res.on('data', chunk => ip += chunk);
                res.on('error', err => {
                    console.log(`can not get ip, error: ${err} `);
                    resolve('not available')
                });
                res.on('end', () => resolve(ip));
            })
        })
    }
}

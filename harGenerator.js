const chromeHar = require('chrome-har-capturer');
const { requestUrls, indentJson, jobInterval, harFolder } = require('./config');
const moment = require('moment');
const { ensureDir } = require('./util');
const fs = require('fs');


module.exports = class HarGenerator {
    constructor({ url, prettify, jobInterval, harFolder }) {
        this.url = url
        this.prettify = prettify
        this.harFolder = harFolder
        this.jobInterval = jobInterval
    }

    start() {
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
        const json = JSON.stringify(har, null, this.prettify ? 2 : 0);
        const dateFileName = `${this.harFolder}/${moment().format('MM-DD_HH-MM-SS')}.json`;
        fs.writeFile(dateFileName, json, (err) => {
            if (err) console.error(err)
            console.log(`complete save har to ${dateFileName}`)
        });
    }
}

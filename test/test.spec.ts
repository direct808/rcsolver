import rcsolver from "../src/rcsolver";
// import * as puppeteer from "puppeteer";
import * as hp from "http-proxy";
import * as delay from "delay";
import * as childProcess from "child_process";

let portProxy = 8501;

describe("test", function () {

    this.timeout(Infinity);

    it('rcsolver', async () => {
        let result = await rcsolver("6LcJ7I0UAAAAAMHlziCMWU_ued-Q0g4VGJW_dgxZ");
        console.log(result);
    });


    it('proxy', (done) => {
        const proxy = hp.createServer({
            target: 'http://localhost:' + 8500,
        });
        proxy.listen(portProxy);
    });

    it('redbird', async () => {
        const redbird = require('redbird')({
            port: portProxy,
            secure: false,
            ssl: {
                port: 4431,
                key: "./certs/dev-key.pem",
                cert: "./certs/dev-cert.pem",
            }
        });
        // redbird.register("sharesome.com", url, {ssl: false});
        redbird.register("www.google.com", "http://www.google.com/", {
            ssl: false,
            // ssl: {
            //     key: "./certs/dev-key.pem",
            //     cert: "./certs/dev-cert.pem",
            // }
        });
    });


    it('puppeteer', async () => {
        const puppeteer = require("puppeteer-extra");
        const pluginStealth = require("puppeteer-extra-plugin-stealth");
        const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
        puppeteer.use(pluginStealth());
        puppeteer.use(
            RecaptchaPlugin({
                provider: {id: '2captcha', token: 'XXXXXXX'},
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        );
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                `--proxy-server=127.0.0.1:` + portProxy,
                '--proxy-bypass-list=www.google.com,www.gstatic.com,fonts.gstatic.com',
                // '--proxy-bypass-list=-sharesome.com',
            ],
        });
        const page = await browser.newPage();
        page.goto('http://sharesome.com/').catch((e: Error) => console.log(e.message));
        await delay(500000);
    });


    it('native_chrome', async () => {
        let path = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";

        childProcess.spawn(path, [
            "--profile-directory=a123sd111as1d",
            '--incognito',
            `--proxy-server=127.0.0.1:` + portProxy,
            // '--proxy-bypass-list=www.google.com,www.gstatic.com,fonts.gstatic.com',
            "http://sharesome.com",
        ]);
    });


});


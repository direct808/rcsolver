import * as express from "express";
import * as portfinder from "portfinder";
import * as fs from "fs";
import opener = require("opener");
import * as path from "path";
import * as http from "http";
import * as puppeteer from "puppeteer";
import * as hp from 'http-proxy';
import * as ehp from 'express-http-proxy';
import * as requestPromise from "request-promise";

export default function rcsolver(sitekey: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

        let app = express();
        let port = 8500; //await portfinder.getPortPromise();
        let portProxy = 8501;// await portfinder.getPortPromise({startPort: port + 2});
        const proxy = hp.createServer({
            target: 'http://localhost:' + port,
            // secure: true,
            // ssl: {
            //     key: fs.readFileSync(path.resolve(__dirname, "..", "cert.key"), 'utf8'),
            //     cert: fs.readFileSync(path.resolve(__dirname, "..", "cert.pem"), 'utf8')
            // },
        });
        // proxy.on('proxyReq', function (proxyReq, req, res, options) {
        //     res.setHeader("Derp", "1231");
        //     console.log(req.url);
        //     proxy.web(req, res, {target: "http://yandex.ru"});
        // });
        proxy.listen(portProxy);
        let url = "http://localhost:" + port;
        let server = app.listen(port, async () => {
            console.log("Listen");

            // opener(url);

            const browser = await puppeteer.launch({
                headless: false,
                ignoreHTTPSErrors: true,
                args: [
                    `--proxy-server=localhost:` + portProxy,
                    // '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE localhost"',
                    // '--host-resolver-rules="MAP sharesome.com localhost:' + port + ' EXCLUDE *',
                    // `--host-rules="MAP * 127.0.0.1:${port}"`
                ],

            });
            // const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto('http://sharesome.com');
            // await page.screenshot({path: 'example.png'});
            // await browser.close();
        });
        app.get('/', function (req, res) {
            let html = fs.readFileSync(path.resolve(__dirname, "..", "index.html")).toString();
            html = html.replace("%site_key%", sitekey);
            res.send(html);
            // proxy.web(req, res, {target: "http://www.lospollos.com/stats/trackerreport"});
        });
        app.get('/result', function (req: express.Request, res: express.Response) {
            let result = req.query['g-recaptcha-response'];
            res.send("ok");
            server.close();
            resolve(result);
        });

        app.use("*", async function (req, res) {
            if (req.headers.host!.includes("google") || req.headers.host!.includes("gstatic")) {
                let data = await requestPromise.get("http://" + req.headers.host + req.baseUrl);
                data = data.replace(/https/g, "http");
                return res.send(data);
            }
            return res.sendStatus(404);
        });

        // app.use("/recaptcha/api.js", ehp("www.google.com/recaptcha/api.js"));

        app.on("error", reject);
        server.on("error", reject);
    });
}

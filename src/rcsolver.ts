import * as express from "express";
import * as fs from "fs";
import * as path from "path";


export default function rcsolver(sitekey: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

        let app = express();
        let port = 8500; //await portfinder.getPortPromise();

        let server = app.listen(port, async () => {
            // opener(url);
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

        app.on("error", reject);
        server.on("error", reject);
    });
}

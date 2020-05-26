import express from "express";
import bodyParser from "body-parser";
import {getBlindpoolByKey, getBlindpoolStatistics, postCreateBlindpool} from "./api/BlindpoolApi";

const port = process.env.PORT || 8080;

const router = express.Router();
router.get('/pool/stats', getBlindpoolStatistics);
router.post('/pool/', postCreateBlindpool);
router.get('/pool/:key', getBlindpoolByKey);

const app = express();
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(bodyParser.json());
app.use('/api/v2/', router);

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}
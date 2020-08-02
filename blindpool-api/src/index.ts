import express from "express";
import {getBlindpoolByKey, getBlindpoolStatistics, postCreateBlindpool} from "./api/BlindpoolApi";
import cors from "cors";

const port = process.env.PORT || 8080;
const environment = process.env.NODE_ENV || 'development';
const router = express.Router();

// Only allow cors when running locally
if (environment === 'development') {
    router.use(cors());
    router.options('*', cors());
}

router.get('/pool/stats', getBlindpoolStatistics);
router.post('/pool/', postCreateBlindpool);
router.get('/pool/:key', getBlindpoolByKey);

const app = express();

app.use(express.json());
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
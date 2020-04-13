import express from "express";
import {getBlindpoolByKey} from "./api/BlindpoolApi";

const port = process.env.PORT || 8080;

const router = express.Router();
router.get('/:key', getBlindpoolByKey);

const app = express();
app.use('/api/v2/pool', router);

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
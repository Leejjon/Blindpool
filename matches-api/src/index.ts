import express from "express";
import cors from "cors";

import {fetchAndSaveScheduledMatches, getMatchByKey, getTenScheduledMatches} from "./api/MatchesApi";

const PORT = process.env.PORT || 8082;
const environment = process.env.NODE_ENV || 'development';
const router = express.Router();

// Only allow cors when running locally
if (environment === 'development') {
    router.use(cors());
    router.options('*', cors());
}

router.get('/matches/update', fetchAndSaveScheduledMatches);
router.get('/matches/upcoming', getTenScheduledMatches);
router.get('/matches/:key', getMatchByKey);

const app = express();

app.use('/api/v2/', router);

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

/**
 * Webpack HMR Activation
 */

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
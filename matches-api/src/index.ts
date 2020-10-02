import express from "express";

import { fetchAndSaveScheduledMatches, getTenScheduledMatches } from "./api/MatchesApi";

const PORT = process.env.PORT || 8082;
const app = express();
const router = express.Router();

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

router.get('/matches/update', fetchAndSaveScheduledMatches);
router.get('/matches/upcoming', getTenScheduledMatches);

app.use('/api/v2/', router);

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
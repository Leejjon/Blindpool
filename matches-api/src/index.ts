import express from "express";

import { getScheduledMatches } from "./actions/getScheduledMatches";

const PORT = 8080;
const app = express();
const router = express.Router();

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

router.get('/scheduled', getScheduledMatches);
router.get('/finished', getScheduledMatches);

app.use('/api/v2/match', router);

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
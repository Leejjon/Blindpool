import express, {NextFunction, Request, Response} from "express";
import {getBlindpoolByKey, getBlindpoolStatistics, postCreateBlindpool} from "./api/BlindpoolApi";
import cors from "cors";

const port = process.env.PORT || '8080';
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

interface SyntaxErrorWithStatusAndBody extends SyntaxError {
    status: number;
    body: string;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if ((err as SyntaxErrorWithStatusAndBody).status === 400 && 'body' in err) {
        const bodyWithInvalidJson = (err as SyntaxErrorWithStatusAndBody).body;
        console.error(`Somebody tried to do a request with invalid json: ${bodyWithInvalidJson}`);
        return res.sendStatus(400); // Bad request
    }
    // If it's another error, let the default handler handle it.
    next();
});

app.use('/api/v2/', router);

export const server = app.listen(port, () => {
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
import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {
    getBlindpoolByKey,
    getBlindpoolStatistics,
    postCreateBlindpool
} from "./api/BlindpoolApi";
import {validate} from "class-validator";
import cors from "cors";
import {plainToClass} from "class-transformer";
import {CreateBlindpoolRequest} from "blindpool-common";

const port = process.env.PORT || '8080';
const environment = process.env.NODE_ENV || 'development';
const router = express.Router();

// Only allow cors when running locally
if (environment === 'development') {
    router.use(cors());
    router.options('*', cors<express.Request>());
}

function validationMiddleware<T>(type: any): RequestHandler {
    return async (req, res, next) => {
        // For some reason the class-transformer and class-validator don't see arrays as a validation error.
        const requestBody: string = JSON.stringify(req.body);

        if (!(requestBody.startsWith('{') && requestBody.endsWith('}'))) {
            console.error(`Somebody tried to do a request with invalid json: ${requestBody}`);
            res.status(400);
            res.send("Invalid request.");
            return;
        }

        let validationErrors = await validate(plainToClass(type, req.body));

        if (validationErrors.length > 0) {
            validationErrors.forEach((validationError) => {
                console.log(validationError);
            });
            res.status(400);
            res.send("Invalid request.");
        } else {
            next();
        }
    };
}

router.get('/v2/pool/stats', getBlindpoolStatistics);
router.post('/v3/pool/', validationMiddleware(CreateBlindpoolRequest), postCreateBlindpool);
router.get('/v2/pool/:key', getBlindpoolByKey);

const app = express();

app.use(express.json() as RequestHandler);

interface SyntaxErrorWithStatusAndBody extends SyntaxError {
    status: number;
    body: string;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Check if this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if ((err as SyntaxErrorWithStatusAndBody).status === 400 && 'body' in err) {
        const bodyWithInvalidJson = (err as SyntaxErrorWithStatusAndBody).body;
        console.error(`Somebody tried to do a request with invalid json: ${bodyWithInvalidJson}`);
        return res.sendStatus(400); // Bad request
    }
    // If it's another error, let the default handler handle it.
    next();
});

app.use('/api/', router);

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

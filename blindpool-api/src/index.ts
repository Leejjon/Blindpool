import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {
    getBlindpoolByKey,
    getBlindpoolStatistics,
    postCreateBlindpool,
    postCreateBlindpoolV2
} from "./api/BlindpoolApi";
import {validate} from "class-validator";
import cors from "cors";
import {plainToClass} from "class-transformer";
import {CreateBlindpoolRequest, Match} from "./models/Blindpool";

const port = process.env.PORT || '8080';
const environment = process.env.NODE_ENV || 'development';
const router = express.Router();

// Only allow cors when running locally
if (environment === 'development') {
    router.use(cors());
    router.options('*', cors());
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
router.post('/v2/pool/', postCreateBlindpool);
router.post('/v3/pool/', validationMiddleware(CreateBlindpoolRequest), postCreateBlindpoolV2);

// router.post('/v3/test/', validationMiddleware(CreateBlindpoolRequest), async (req: Request, res: Response) => {
//     const bar = new Match(undefined, undefined, undefined, 'hoi', 'doei');
//     try {
//         const foo = plainToClass(CreateBlindpoolRequest, req.body);
//         const foo2 = new CreateBlindpoolRequest(['Leon', "Sylvia"], bar);
//         let validationErrors = await validate(foo);
//         let validationErrors2 = await validate(foo2);
//         console.log(`Foo : ${JSON.stringify(foo)} Errors when validating: ${validationErrors.length}`);
//         console.log(`Foo2: ${JSON.stringify(foo2)} Errors when validating: ${validationErrors2.length}`);
//
//         res.status(200);
//         res.send('Ok');
//     } catch (error) {
//         console.log(error);
//         res.status(400);
//         res.send('Too bad');
//     }
// });

router.get('/v2/pool/:key', getBlindpoolByKey);

const app = express();

app.use(express.json());

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
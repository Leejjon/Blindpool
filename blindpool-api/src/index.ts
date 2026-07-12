import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {
    getBlindpoolByKey,
    getBlindpoolStatistics, postCreateBlindpool,
} from "./api/BlindpoolApi";
import cors from "cors";
import {
    CreateBlindpoolRequestSchema, CreateBlindpoolRequestStructureSchema,
} from "blindpool-common/requests/validation/CreateBpRequest";
import {validateParticipants} from "blindpool-common/requests/validation/validation";

const port = process.env.PORT || '8080';
const environment = process.env.NODE_ENV || 'development';
const router = express.Router();

// Only allow cors when running locally
if (environment === 'development') {
    router.use(cors());
    router.options('{*path}', cors<express.Request>());
}

router.get('/v2/pool/stats', getBlindpoolStatistics);

export function tryValidation(req: Request, res: Response, next: NextFunction) {
    const structureResult = CreateBlindpoolRequestStructureSchema.safeParse(req.body);
    if (structureResult.success) {
        const result = CreateBlindpoolRequestSchema.safeParse(req.body);
        if (result.success) {
            next();
        } else {
            res.status(400).json({
                participantValidations: validateParticipants(result, structureResult.data.participants, false),
            });
        }
    } else {
        res.status(400).send("Invalid request.");
    }
}

router.post('/v4/pool/', tryValidation, async (req: Request, res: Response) => {
    await postCreateBlindpool(req, res);
});
router.get('/v2/pool/:key', getBlindpoolByKey);

const app = express();

app.use(express.json() as RequestHandler);
app.use(express.urlencoded({extended: true}));

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

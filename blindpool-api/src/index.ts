import express from "express";
import { blindpoolApi } from "./api/BlindpoolApi";

const PORT = process.env.PORT || 8080;

const app = express();


// app.get('/', (req, res) => res.send('Hello World2!'));
// app.use((req, res) => {
//     console.log(req.url);
//     res.send('Hello World2!');
// });

app.use('/api/v2/pool', blindpoolApi);

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
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
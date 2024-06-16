// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

import {Request, Response} from "express";
import ErrnoException = NodeJS.ErrnoException;
import {dutchPageTitlesAndDescriptions, englishPageTitlesAndDescriptions} from "./locales";

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const environment = process.env.NODE_ENV || 'development';

app.get('/sitemap.xml', function(req: Request, res: Response) {
    switch (String(req.get('host'))) {
        case "blindepool.nl":
        case "www.blindepool.nl":
            res.sendFile(path.join(__dirname, 'build', 'sitemap-nl.xml'));
            break;
        default:
            res.sendFile(path.join(__dirname, 'build', 'sitemap-en.xml'));
            break;
    }
});

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req: Request, res: Response) => {
    if (/(.ico|.js|.css|.jpg|.png|.woff2)$/i.test(req.path)) {
        if (environment === 'development') {
            res.sendFile(path.join(__dirname, 'build', req.path));
        } else {
            res.status(404).send('Not found');
        }
    } else {
        const filePath = path.resolve(__dirname, 'build', 'index.html')
        fs.readFile(filePath, 'utf8', (err: ErrnoException | null, data: string) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal error.');
            }

            const defaultTitle = 'Blindpool';

            let title = englishPageTitlesAndDescriptions[req.path]?.title || defaultTitle;
            let description = englishPageTitlesAndDescriptions[req.path]?.description || defaultTitle;
            let googleAnalyticsId = 'G-8R5VGWKLGN'
            let googleAdsClientId = '';
            let facebookAdsClientId = '';

            switch (String(req.get('host'))) {
                case "blindepool.nl":
                case "www.blindepool.nl":
                    title = dutchPageTitlesAndDescriptions[req.path]?.title || defaultTitle;
                    description = dutchPageTitlesAndDescriptions[req.path]?.description || defaultTitle;
                    googleAnalyticsId = 'G-RLHXCGFX7D';
                    googleAdsClientId = 'ca-pub-8436311764742328';
                    facebookAdsClientId = 'woap2tjubeuc46ufij68ddw21rs97m';
                    break;
                default:
                    break;
            }

            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$OG_DESCRIPTION/g, description);
            data = data.replace(/\$GOOGLE_ANALYTICS_ID/g, googleAnalyticsId);
            data = data.replace(/\$GOOGLE_ADS_CLIENT_ID/g, googleAdsClientId);
            data = data.replace(/\$FACEBOOK_ADS_CLIENT_ID/g, facebookAdsClientId);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.send(data);
        });
    }
});

// Start the server
const PORT = process.env.PORT || 8083;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]

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

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

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/sitemap.xml', function(req, res) {
    switch (String(req.get('host'))) {
        case "blindepool.nl":
        case "www.blindepool.nl":
            res.sendFile(path.join(__dirname, 'blindpool-client/build', 'sitemap-nl.xml'));
            break;
        default:
            res.sendFile(path.join(__dirname, 'blindpool-client/build', 'sitemap-en.xml'));
            break;
    }
});

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use(function(req, res){
    if (/(.ico|.js|.css|.jpg|.png)$/i.test(req.path)) {
        res.status(404).send('Not found');
    } else {
        const filePath = path.resolve(__dirname, 'blindpool-client/build', 'index.html')
        fs.readFile(filePath, 'utf8', function (err,data) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal error.');
            }

            let title = 'Blindpool';
            let description = 'Watching football with friends? Create a blind pool in 30 seconds. Free and no account needed.';

            switch (String(req.get('host'))) {
                case "blindepool.nl":
                case "www.blindepool.nl":
                    title = 'Blindepool';
                    description = 'Voetbal kijken met vrienden? Maak een blindepool in 30 seconden. Gratis en geen account nodig.';
                    break;
                default:
                    break;
            }

            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$OG_DESCRIPTION/g, description);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.send(data);
        });
    }
});

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]

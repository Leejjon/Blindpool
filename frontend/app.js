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
const request = require('request');
const app = express();

// This code makes sure that every request that matches a static file in the
// build folder, it serves that file.
app.use(express.static(path.join(__dirname, 'build')));

app.get('/sitemap.xml', function(req, res) {
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

app.get('/fonts/material-icons', function(req,res) {
    let materialIconsUrl = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    request(materialIconsUrl).pipe(res);
});

app.get('/fonts/archivo', function(req,res) {
    let materialIconsUrl = 'https://fonts.googleapis.com/css?family=Archivo';
    request(materialIconsUrl).pipe(res);
});

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]

#!/bin/sh

export DATASTORE_DATASET=blindepoule
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_EMULATOR_HOST_PATH=localhost:8081/datastore
export DATASTORE_HOST=http://localhost:8081
export DATASTORE_PROJECT_ID=blindepoule

#x-terminal-emulator -T "Google Datastore Emulator" -- "gcloud beta emulators datastore start"
gnome-terminal "Webpack for Matches API" -- sh -c "cd matches-api;npm run webpack"
gnome-terminal "Matches API" -- sh -c "cd matches-api;npm start"
gnome-terminal "Webpack for Blindpool API" -- sh -c "cd blindpool-api;npm run webpack"
gnome-terminal "Blindpool API" -- sh -c "cd blindpool-api;npm start"
gnome-terminal "React Dev Server for Blindpool Client" -- sh -c "cd blindpool-client;npm start"
#gnome-terminal "Run real frontend server instead of react dev server" -- 'sh -c "cd blindpool-frontend;npm run webpack"'


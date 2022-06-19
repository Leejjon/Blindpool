#!/bin/sh

export DATASTORE_DATASET=blindepoule
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_EMULATOR_HOST_PATH=localhost:8081/datastore
export DATASTORE_HOST=http://localhost:8081
export DATASTORE_PROJECT_ID=blindepoule

#x-terminal-emulator -T "Google Datastore Emulator" -e "gcloud beta emulators datastore start"
x-terminal-emulator -T "Webpack for Matches API" -e "cd matches-api;npm run webpack"
x-terminal-emulator -T "Matches API" -e "cd matches-api;npm start"
x-terminal-emulator -T "Webpack for Blindpool API" -e "cd blindpool-api;npm run webpack"
x-terminal-emulator -T "Blindpool API" -e "cd blindpool-api;npm start"
#x-terminal-emulator -T "React Dev Server for Blindpool Client" -e "cd blindpool-client3;npm start"
x-terminal-emulator -e "cd blindpool-frontend;npm run webpack"


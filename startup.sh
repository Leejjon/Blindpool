#!/bin/sh
x-terminal-emulator -e "gcloud beta emulators datastore start"
x-terminal-emulator -e "cd matches-api;npm run webpack"
x-terminal-emulator -e "cd matches-api;$(gcloud beta emulators datastore env-init);npm start"
x-terminal-emulator -e "cd blindpool-api;npm run webpack"
x-terminal-emulator -e "cd blindpool-api;$(gcloud beta emulators datastore env-init);npm start"
x-terminal-emulator -e "cd blindpool-client;npm start"
#x-terminal-emulator -e "cd blindpool-frontend;npm run webpack"
#x-terminal-emulator -e "cd blindpool-frontend;npm start"

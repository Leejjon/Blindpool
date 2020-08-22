# Blindpool
Web application that randomly assigns predicted scores for the number of players.

For the live version:
https://blindpool.com

To run locally, start the emulator (Windows)

```gcloud beta emulators datastore start```

To get the correct environment variables (Windows)

```gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd```

On Linux:
https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu

To install the emulator on Linux:
```sudo apt-get install google-cloud-sdk-datastore-emulator```

To run the back end (node):

```
npm run webpack
npm run start
```

To run the front end:

```npm run start2```

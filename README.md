# Blindpool
Web application that randomly assigns predicted scores for the number of players.

For the live version:
https://blindpool.com

To run locally, start the emulator (Windows)

```gcloud beta emulators datastore start```

To get the correct environment variables (Windows)

```gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd```

To run the back end:

```mvn clean install exec:exec```

To run the back end (node):

```
npm run webpack
npm run start
```

To run the front end:

```npm run start2```
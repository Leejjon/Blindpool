# Blindpool
Web application that randomly assigns predicted scores for the number of players.

For the live version:
https://blindpool.com

# Running Locally
## On Windows
To run locally, start the emulator

```gcloud beta emulators datastore start```

To get the correct environment variables (Windows)

```gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd```

## On Linux:
https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu

To install the emulator on Linux:
```sudo apt-get install google-cloud-sdk-datastore-emulator```

To run the emulator:
```gcloud beta emulators datastore start```

To delete all data in the datastore emulator:
```cd ~/.config/gcloud/emulators/datastore/WEB-INF/appengine-generated/```
```rm -rf local_db.bin```

To run the back ends (node):

```
npm run webpack
$(gcloud beta emulators datastore env-init)
npm start
```

For the matches-api, you need to create a local.key file an put your API key from football-data.org in it

To run the front end in blindpool-client:

```npm start```

To deploy any of the Node.js runtimes run:

```gcloud app deploy --version=X```

To update the dispatch.yaml that manages the routing to different app engine services:

```gcloud app deploy dispatch.yaml```

# Google Datastore indexes
If you are running for the first time, you need to upload the index.yaml file to set the indexes in Google Datastore.
In the root of the project, run:
```
gcloud app deploy index.yaml
```

See https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-datastore-indexes-with-index-yaml

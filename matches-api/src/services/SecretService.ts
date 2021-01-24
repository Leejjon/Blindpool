// Imports the Secret Manager library
// const SecretManager = require('@google-cloud/secret-manager');
import * as SecretManager from '@google-cloud/secret-manager';
import fs from "fs";

// Instantiates a client
const client = new SecretManager.SecretManagerServiceClient();

const environment = process.env.NODE_ENV || 'development';

export const fetchSecret = async (): Promise<string> => {
    if (environment === 'production') {
        const [version] = await client.accessSecretVersion({
            //321048342584
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/football-data-api-key/versions/latest`,
        });

        // Extract the payload as a string.
        return version?.payload?.data?.toString() as string;
    } else {
        return fs.readFileSync('local.key', 'utf8');
    }
};

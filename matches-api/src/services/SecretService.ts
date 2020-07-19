// Imports the Secret Manager library
// const SecretManager = require('@google-cloud/secret-manager');
import * as SecretManager from '@google-cloud/secret-manager';

// Instantiates a client
const client = new SecretManager.SecretManagerServiceClient();

export const accessSecretVersion = async () => {
    const [version] = await client.accessSecretVersion({
        name: 'projects/321048342584/secrets/football-data-api-key/versions/latest',
    });

    // Extract the payload as a string.
    const payload = version?.payload?.data?.toString();

    // WARNING: Do not print the secret in a production environment - this
    // snippet is showing how to access the secret material.
    console.info(`Payload: ${payload}`);
    return payload;
};
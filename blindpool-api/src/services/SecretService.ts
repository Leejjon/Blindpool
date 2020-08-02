// Imports the Secret Manager library
// const SecretManager = require('@google-cloud/secret-manager');
// import * as SecretManager from '@google-cloud/secret-manager';
//
// const projectId =  process.env.GOOGLE_CLOUD_PROJECT;
//
// // Instantiates a client
// const client = new SecretManager.SecretManagerServiceClient();
//
// export const accessSecretVersion = async (projectId: String) => {
//     const [version] = await client.accessSecretVersion({
//         //321048342584
//         name: `projects/${projectId}/secrets/football-data-api-key/versions/latest`,
//     });
//
//     // Extract the payload as a string.
//     const payload = version?.payload?.data?.toString();
//
//     // WARNING: Do not print the secret in a production environment - this
//     // snippet is showing how to access the secret material.
//     console.info(`Payload: ${payload}`);
//     return payload;
// };
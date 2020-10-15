export enum Api {
    pool = 8080,
    matches = 8082
}

export const getHost = (api: Api) => {
    let host = window.location.protocol + "//" + window.location.hostname;

    if (window.location.hostname === 'localhost') {
        host += `:${api.valueOf()}`;
    }
    return host;
};
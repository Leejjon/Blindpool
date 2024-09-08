export enum Api {
    pool = 8080,
    matches = 8082
}

export const getHost = (api: Api) => {
    let host = window.location.protocol + "//" + window.location.hostname;

    if (window.location.hostname === 'localhost' /*|| window.location.hostname === '192.168.2.36'*/) {
        host += `:${api.valueOf()}`;
    }
    return host;
};

export const getHostnameWithPortIfLocal = () => {
    const port = window.location.port;
    let hostnameWithPortIfLocal = window.location.hostname;
    if (port !== '') {
        hostnameWithPortIfLocal += `:${port}`
    }
    return hostnameWithPortIfLocal;
}
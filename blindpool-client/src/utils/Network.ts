export const getHost = () => {
    let host = window.location.protocol + "//" + window.location.hostname;

    if (window.location.hostname === 'localhost') {
        host += ":8080"
    }
    return host;
};
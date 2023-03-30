import { Setting } from '../settings/entities/setting.entity';

export default (settings: Setting) => ({
    APIKEY: settings.accessKey,
    APISECRET: settings.secretKey,
    recvWindow: 60000,
    family: 0,
    urls: {
        base: settings.apiUrl.endsWith('/') ? settings.apiUrl : settings.apiUrl + '/',
        stream: settings.streamUrl.endsWith('/') ? settings.streamUrl : settings.streamUrl + '/'
    },
    // verbose: LOGS
})
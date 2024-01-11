"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
function getBaseUrl() {
    if (process.env.NODE_ENV === 'prod') {
        return process.env.URL_PROD || 'http://localhost:3000';
    }
    else if (process.env.NODE_ENV === 'dev') {
        return process.env.URL_DEV || 'http://localhost:3000';
    }
    else {
        return process.env.URL_LOCAL || 'http://localhost:5000';
    }
}
const env_vars = {
    DB_NAME: process.env.DB_NAME || 'nearstud',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_HOST: process.env.DB_HOST || 'localhost',
    SERVER_PORT: process.env.SERVER_PORT || 5000,
    CLIENT_PORT: process.env.CLIENT_PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    BASE_URL: getBaseUrl(),
    SECRET_KEY: process.env.SECRET_KEy || 'secret',
    KEY_TOKEN: process.env.KEY_TOKEN || 'token',
    KEY_TOKEN_REFRESH: process.env.KEY_TOKEN_REFRESH || 'token_refresh',
    EMAIL: process.env.EMAIL || 'nearstuds@zohomail.eu',
    E_PASS: process.env.E_PASS || 'nearstuds',
    MAIL_SERVICE: process.env.MAIL_SERVICE || 'smtp.zoho.eu',
};
exports.default = env_vars;
//# sourceMappingURL=environment.js.map
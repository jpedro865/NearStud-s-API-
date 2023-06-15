"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.db = void 0;
const mongodb_1 = require("mongodb");
require('dotenv').config();
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${user}:${password}@cluster0.amzseaz.mongodb.net/?retryWrites=true&w=majority`;
const client = new mongodb_1.MongoClient(uri);
exports.client = client;
function connectdb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log('Connected successfully to Database');
        }
        catch (err) {
            console.log('Connection to Database refused/failed');
            console.log('Error de connection:\n', err);
        }
        finally {
            client.close();
        }
    });
}
if (process.argv[2] === 'dbcheck') {
    connectdb();
}
const db = client.db(process.env.DB_NAME);
exports.db = db;
//# sourceMappingURL=instance.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const resto_route_1 = __importDefault(require("./routes/resto.route"));
const environment_1 = __importDefault(require("./utils/environment"));
// init app/middleware
const port = environment_1.default.SERVER_PORT;
const app = (0, express_1.default)();
// cookie Parser setup
app.use((0, cookie_parser_1.default)());
// Cors setup
app.use((0, cors_1.default)({
    origin: `http://localhost:${environment_1.default.CLIENT_PORT}`,
    credentials: true,
}));
// teeling express to use json
app.use(express_1.default.json());
// routers here
app.use('/users', users_route_1.default);
app.use('/restos', resto_route_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        "this": "NearStud's APi",
        "Welcome": true
    });
});
app.listen(port, () => {
    console.log(`Your API is now listening on port ${port}`);
});
//# sourceMappingURL=server.js.map
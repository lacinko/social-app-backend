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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const client_1 = require("@prisma/client");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const appError_1 = __importDefault(require("./utils/appError"));
(0, validateEnv_1.default)();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // TEMPLATE ENGINE
        app.set('view engine', 'pug');
        app.set('views', `${__dirname}/views`);
        // MIDDLEWARE
        // 1.Body Parser
        app.use(express_1.default.json({ limit: '10kb' }));
        // 2. Cookie Parser
        app.use((0, cookie_parser_1.default)());
        // 2. Cors
        app.use((0, cors_1.default)({
            origin: [config_1.default.get('origin')],
            credentials: true,
        }));
        // 3. Logger
        if (process.env.NODE_ENV === 'development')
            app.use((0, morgan_1.default)('dev'));
        // ROUTES
        app.use('/api/auth', auth_routes_1.default);
        app.use('/api/users', user_routes_1.default);
        // Testing
        app.get('/api/healthchecker', (_, res) => {
            res.status(200).json({
                status: 'success',
                message: 'Welcome to NodeJs with Prisma and PostgreSQL',
            });
        });
        // UNHANDLED ROUTES
        app.all('*', (req, res, next) => {
            next(new appError_1.default(404, `Route ${req.originalUrl} not found`));
        });
        // GLOBAL ERROR HANDLER
        app.use((err, req, res, next) => {
            err.status = err.status || 'error';
            err.statusCode = err.statusCode || 500;
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        });
        const port = config_1.default.get('port');
        app.listen(port, () => {
            console.log(`Server on port: ${port}`);
        });
    });
}
bootstrap()
    .catch((err) => {
    throw err;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

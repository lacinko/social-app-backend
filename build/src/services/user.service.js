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
exports.updateUser = exports.signTokens = exports.findUniqueUser = exports.createUser = exports.excludedFields = void 0;
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("config"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const jwt_1 = require("../utils/jwt");
exports.excludedFields = ['password', 'verified', 'verificationCode'];
const prisma = new client_1.PrismaClient();
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.create({
        data: input,
    }));
});
exports.createUser = createUser;
const findUniqueUser = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findUnique({
        where,
        select,
    }));
});
exports.findUniqueUser = findUniqueUser;
const signTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Create Session
    connectRedis_1.default.set(`${user.id}`, JSON.stringify(user), {
        EX: config_1.default.get('redisCacheExpiresIn') * 60,
    });
    // 2. Create Access and Refresh tokens
    const access_token = (0, jwt_1.signJwt)({ sub: user.id }, 'accessTokenPrivateKey', {
        expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
    });
    const refresh_token = (0, jwt_1.signJwt)({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config_1.default.get('refreshTokenExpiresIn')}m`,
    });
    return { access_token, refresh_token };
});
exports.signTokens = signTokens;
const updateUser = (where /*Partial<Prisma.UserCreateInput>*/, data, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.update({ where, data, select }));
});
exports.updateUser = updateUser;

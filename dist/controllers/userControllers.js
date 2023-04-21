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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const register = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const new_hash = yield bcrypt_1.default.hash(request.body.password, salt);
        const doc = new user_1.default({
            fullName: request.body.fullName,
            email: request.body.email,
            passwordHash: new_hash,
        });
        const user = yield doc.save();
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, process.env.JWT_KEY, {
            expiresIn: '7d',
        });
        const _a = user._doc, { passwordHash } = _a, userData = __rest(_a, ["passwordHash"]);
        utils_1.logger.info('new user registered', { id: user._id });
        response.json(Object.assign(Object.assign({ success: true }, userData), { token }));
    }
    catch (err) {
        response.status(500).json({
            message: 'Registratoin failed',
            error: err,
        });
    }
});
exports.register = register;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: request.body.email });
        if (!user) {
            return response.status(404).json({
                message: 'User not found',
            });
        }
        const isValidPass = yield bcrypt_1.default.compare(request.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return response.status(404).json({
                message: 'Invalid credentials',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, process.env.JWT_KEY, {
            expiresIn: '7d',
        });
        const _b = user._doc, { passwordHash } = _b, userData = __rest(_b, ["passwordHash"]);
        utils_1.logger.info('user logged in', { id: user._id });
        response.json(Object.assign(Object.assign({ success: true }, userData), { token }));
    }
    catch (err) {
        response.status(500).json({
            message: 'Login failed',
            error: err,
        });
    }
});
exports.login = login;
const getMe = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(request.userId);
        if (!user) {
            return response.status(404).json({
                message: 'User not found',
            });
        }
        const _c = user._doc, { passwordHash } = _c, userData = __rest(_c, ["passwordHash"]);
        response.json(Object.assign({ success: true }, userData));
    }
    catch (err) {
        response.json({
            message: 'Forbidden',
        });
    }
});
exports.getMe = getMe;
//# sourceMappingURL=userControllers.js.map
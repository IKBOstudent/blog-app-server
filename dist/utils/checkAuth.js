"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (request, response, next) => {
    const token = (request.headers.authorization || '').replace(/Bearer\s/, '');
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            request.userId = decoded._id;
            next();
        }
        catch (err) {
            return response.status(403).json({
                message: 'Forbidden',
            });
        }
    }
    else {
        return response.status(403).json({
            message: 'Forbidden',
        });
    }
};
//# sourceMappingURL=checkAuth.js.map
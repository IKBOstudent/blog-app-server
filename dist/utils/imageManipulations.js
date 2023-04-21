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
exports.resizeImage = exports.createBlurHash = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const blurhash_1 = require("blurhash");
const createBlurHash = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(res.data, 'binary');
        (0, sharp_1.default)(buffer)
            .raw()
            .ensureAlpha()
            .toBuffer((err, buffer, { width, height }) => {
            if (err)
                return reject(err);
            resolve((0, blurhash_1.encode)(buffer, width, height, 4, 4));
        });
    }));
});
exports.createBlurHash = createBlurHash;
const resizeImage = (buffer) => new Promise((resolve, reject) => {
    (0, sharp_1.default)(buffer)
        .resize({ width: 1200 })
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toBuffer((err, buffer) => {
        if (err)
            return reject(err);
        resolve(buffer);
    });
});
exports.resizeImage = resizeImage;
//# sourceMappingURL=imageManipulations.js.map
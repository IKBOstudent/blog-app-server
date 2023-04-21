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
exports.imageUpload = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const imageUpload = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.IMAGE_API_KEY) {
            console.log('ERROR No api key provided');
            throw new Error('Internal server error');
        }
        const { buffer, originalname } = request.file;
        const resizedImageBuffer = yield (0, utils_1.resizeImage)(buffer);
        const formData = new form_data_1.default();
        formData.append('image', resizedImageBuffer, { filename: originalname });
        const res_upload = yield axios_1.default.post(`https://api.imgbb.com/1/upload?key=${process.env.IMAGE_API_KEY}`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            },
        });
        utils_1.logger.info('new image upload', { url: res_upload.data.data.image.url });
        response.json(res_upload.data.data);
    }
    catch (e) {
        console.warn(e);
        response.status(500).json({
            message: 'Upload failed',
            error: e,
        });
    }
});
exports.imageUpload = imageUpload;
//# sourceMappingURL=imageUpload.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (request, response, next) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            message: 'Invalid request fields',
            errors: errors.array(),
        });
    }
    next();
};
//# sourceMappingURL=handleValidationErrors.js.map
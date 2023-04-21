import { validationResult } from 'express-validator';

export default (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({
            message: 'Invalid request fields',
            errors: errors.array(),
        });
    }
    next();
};

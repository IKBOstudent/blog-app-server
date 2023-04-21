import jwt from 'jsonwebtoken';

export default (request, response, next) => {
    const token = (request.headers.authorization || '').replace(/Bearer\s/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            request.userId = decoded._id;

            next();
        } catch (err) {
            return response.status(403).json({
                message: 'Forbidden',
            });
        }
    } else {
        return response.status(403).json({
            message: 'Forbidden',
        });
    }
};

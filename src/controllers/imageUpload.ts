import FormData from 'form-data';
import axios from 'axios';

import { logger, resizeImage } from '../utils';

export const imageUpload = async (request, response) => {
    try {
        if (!process.env.IMAGE_API_KEY) {
            console.log('ERROR No api key provided');
            throw new Error('Internal server error');
        }
        const { buffer, originalname } = request.file;

        const resizedImageBuffer = await resizeImage(buffer);

        const formData = new FormData();
        formData.append('image', resizedImageBuffer, { filename: originalname });

        const res_upload = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_API_KEY}`,
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                },
            },
        );

        logger.info('new image upload', { url: res_upload.data.data.image.url });
        response.json(res_upload.data.data);
    } catch (e) {
        console.warn(e);
        response.status(500).json({
            message: 'Upload failed',
            error: e,
        });
    }
};

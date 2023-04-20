import sharp from 'sharp';
import axios from 'axios';
import { encode } from 'blurhash';

export const createBlurHash = async (imageUrl) =>
    new Promise(async (resolve, reject) => {
        const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        // console.log(res);
        const buffer = Buffer.from(res.data, 'binary');

        sharp(buffer)
            .raw()
            .ensureAlpha()
            // .resize(32, 32, { fit: 'inside' })
            .toBuffer((err, buffer, { width, height }) => {
                if (err) return reject(err);
                resolve(encode(buffer, width, height, 4, 4));
            });
    });

export const resizeImage = (buffer) =>
    new Promise((resolve, reject) => {
        sharp(buffer)
            .resize({ width: 1200 })
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toBuffer((err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
    });

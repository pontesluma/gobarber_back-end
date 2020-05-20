import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmp = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmp,

  storage: multer.diskStorage({
    destination: tmp,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

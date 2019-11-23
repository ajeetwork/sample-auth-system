const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const CustomError = require('../helpers/customError');
const { ASSETS_PATH } = require('../initialize');

const avatarsPath = path.join(ASSETS_PATH, 'uploads/avatars');

fs.mkdir(avatarsPath, { recursive: true }, (err, res) => {
  if (err && err.code !== 'EEXIST') console.error(err);
});

const storage = multer.diskStorage({
  destination: avatarsPath,
  filename(req, file, cb) {
    const [ext] = file.originalname.split('.').reverse();
    cb(null, `${uuidv1()}${ext ? `.${ext}` : ''}`);
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new CustomError(422,
        'ValidationError',
        'User validation failed',
        [{
          name: file.fieldname,
          type: 'invalid_content_type',
        }]));
    }
    cb(null, true);
  },
});

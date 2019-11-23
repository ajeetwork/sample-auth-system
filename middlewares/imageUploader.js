const multer = require('multer');
const fs = require('fs');
const path = require('path');
const CustomError = require('../helpers/customError');

const avatarsPath = path.resolve('uploads/avatars');

fs.mkdir(avatarsPath, { recursive: true }, (err, res) => {
  if (err && err.code !== 'EEXIST') console.error(err);
});

module.exports = multer({
  dest: avatarsPath,
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

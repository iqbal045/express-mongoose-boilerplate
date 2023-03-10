const path = require('path');
const multer = require('multer');

const imageFolder = './uploads/images/';
const documentFolder = './uploads/documents/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image' || file.fieldname === 'gallery') {
      cb(null, imageFolder);
    } else if (file.fieldname === 'doc' || file.fieldname === 'documents') {
      cb(null, documentFolder);
    } else {
      cb(null, './uploads/');
    }
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.originalname
      .replace(fileExtension, '')
      .toLowerCase()
      .split(' ')
      .join('-')}-${Date.now()}.${fileExtension}`;

    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2000000, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' || file.fieldname === 'gallery') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .jpeg, and .png formate are allowed.'));
      }
    } else if (file.fieldname === 'doc' || file.fieldname === 'documents') {
      if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/doc' ||
        file.mimetype === 'application/docx' ||
        file.mimetype === 'application/xls' ||
        file.mimetype === 'application/xlsx'
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            'Only .doc, .docx, .xls, .xlsx and .pdf formate are allowed.',
          ),
        );
      }
    } else {
      cb(new Error('There was an unknown error!'));
    }
  },
});

module.exports = upload;

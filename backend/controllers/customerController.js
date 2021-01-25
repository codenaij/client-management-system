const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const Customer = require('../models/customerModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// exports.uploadContributorImages = upload.fields([
//   { name: 'passportPhoto', maxCount: 1 },
//   { name: 'investmentFormPhoto', maxCount: 1 },
//   { name: 'meansIdentificationPhoto', maxCount: 1 },
// ]);

// exports.resizeContributorImages = catchAsync(async (req, res, next) => {
//   if (
//     !req.files.passportPhoto ||
//     !req.files.investmentFormPhoto ||
//     !req.files.meansIdentificationPhoto
//   )
//     return next();

//   // 1) Cover image
//   req.body.passportPhoto = `passport-${req.params.id}-${Date.now()}-photo.jpeg`;
//   await sharp(req.files.passportPhoto[0].buffer)
//     .resize(600, 600)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`src/img/passports/${req.body.passportPhoto}`);

//   // 2) Images
//   req.body.investmentFormPhoto = `investment-${
//     req.params.id
//   }-${Date.now()}-form.jpeg`;
//   await sharp(req.files.investmentFormPhoto[0].buffer)
//     .resize(3508, 2480)
//     .toFormat('jpeg')
//     .jpeg({ quality: 70 })
//     .toFile(`src/img/investmentForm/${req.body.investmentFormPhoto}`);

//   req.body.meansIdentificationPhoto = `investment-${
//     req.params.id
//   }-${Date.now()}-form.jpeg`;
//   await sharp(req.files.meansIdentificationPhoto[0].buffer)
//     .resize(3508, 2480)
//     .toFormat('jpeg')
//     .jpeg({ quality: 70 })
//     .toFile(`src/img/identification/${req.body.meansIdentificationPhoto}`);

//   next();
// });

exports.getAllCustomers = factory.getAll(Customer, { path: 'investments' });
exports.getCustomer = factory.getOne(Customer, { path: 'investments' });
exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);

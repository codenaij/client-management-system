const Staff = require('../models/staffModel');
const factory = require('./handlerFactory');

exports.getAllStaff = factory.getAll(Staff);
exports.getStaff = factory.getOne(Staff);
exports.createStaff = factory.createOne(Staff);
exports.updateStaff = factory.updateOne(Staff);
exports.deleteStaff = factory.deleteOne(Staff);

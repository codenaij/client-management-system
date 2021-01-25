const Branch = require('../models/branchModel');
const factory = require('./handlerFactory');

exports.getAllBranches = factory.getAll(Branch);
exports.getBranch = factory.getOne(Branch);
exports.createBranch = factory.createOne(Branch);
exports.updateBranch = factory.updateOne(Branch);
exports.deleteBranch = factory.deleteOne(Branch);

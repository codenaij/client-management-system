const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Branch should have a unique name"],
    unique: true,
  },
  coopName: {
    type: String,
    required: [true, "Branch should have a unique name"],
  },
  code: {
    type: Number,
    required: [true, "Branch should have a code"],
    maxlength: [3, "Code should be less than 3 characters"],
    unique: true,
  },
  address: {
    type: String,
    trim: true,
  },
  region: {
    type: String,
    required: [true, "Branch should belong to a region"],
    enum: {
      values: ["North", "South-West", "South-South", "Mid-West"],
      message:
        "Region can either be North, South-West, South-South or Mid-West",
    },
  },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;

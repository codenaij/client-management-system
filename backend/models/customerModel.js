const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "Branch",
      required: true,
    },

    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    minor: {
      type: Boolean,
      default: false,
    },
    company: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    // email: {
    //   type: String,
    //   required: [true, "Please provide your email"],
    //   unique: true,
    //   lowercase: true,
    //   validate: [validator.isEmail, "Please provide a valid email"],
    // },

    bankName: {
      type: String,
      required: [true, "Please provide the name of bank"],
      trim: true,
      maxlength: [40, " Bank Name should not exceed 40 characters"],
    },
    accountName: {
      type: String,
      required: [true, "Please provide account name in correct order"],
      trim: true,
      maxlength: [40, " Account Name should not exceed 40 characters"],
    },
    accountNumber: {
      type: String,
      required: [true, "Account Number is required"],
      unique: [true, "This account number user already exists"],
    },
    baraNumber: { type: String, default: "Not Assigned" },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "branch",
    select: "name region address code coopName",
  });
  next();
});

// customerSchema.pre('save', function (next) {
//   const uniqueNumber = new UniqueNumber(true);
//   this.baraNumber = `BA${uniqueNumber}`;
//   next();
// });

// customerSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName} ${this.otherName || ''}`;
// });

// Virtual Populate combines both models
customerSchema.virtual("investments", {
  ref: "Investment",
  foreignField: "customer",
  localField: "_id",
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

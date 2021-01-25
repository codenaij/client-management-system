const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const authSchema = mongoose.Schema({
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: [true, "Please provide branch of registration"],
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    maxlength: [20, "Name should not be longer than 20 characters"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    maxlength: [20, "Name should not be longer than 20 characters"],
    trim: true,
  },
  otherName: {
    type: String,
    maxlength: [20, "Name should not be longer than 20 characters"],
    trim: true,
  },
  email: {
    type: String,
    // required: [true, 'Please provide your email'],
    unique: [true, "Email already exists. Please log in"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    default: "passwordisencrypted,youcantaccessit.",
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: {
      values: [
        "president",
        "managing-director",
        "admin",
        "regional-manager",
        "hr",
        "super-admin",
        "business-manager",
        "ict",
        "lead-accounts",
        "accounts",
        "special-duties",
        "compliance",
        "documentation",
        "investment",
        "legal",
        "staff",
        "user",
      ],
      message: "Only required roles are allowed",
    },
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

authSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName} ${this.otherName}`;
});

authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Check and compare if password matches
authSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

authSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Populate with branch Name
authSchema.pre(/^find/, function (next) {
  this.populate({
    path: "branch",
    select: `name region`,
  });
  next();
});

authSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;

const mongoose = require("mongoose");
const Investment = require("./investmentModel");

const topUpSchema = new mongoose.Schema(
  {
    investment: {
      type: mongoose.Schema.ObjectId,
      ref: "Investment",
      required: [true, "There should be an already existing investment"],
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: [true, "There should be an already existing Customer"],
    },
    type: {
      type: String,
      default: "Top Up",
    },
    officialBank: {
      type: String,
      // required: [true, 'Please Provide bank customer paid into'],
    },
    topUpAmount: {
      type: Number,
      required: [true, "Top Up amount is required"],
    },
    topUpVerified: {
      type: Boolean,
      default: false,
    },
    topDate: {
      type: Date,
    },
    dateTopUpVerify: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
      required: true,
    },
    // INVOICE DATA
    invoicePreparedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    invoicePrepared: { type: Boolean, default: false },
    dateInvoicePrepared: Date,
    invoice: String,
    receiptGenerateNote: String,

    // MOU DATA
    mouPreparedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    mouPrepared: { type: Boolean, default: false },
    mouGenerateNote: String,
    mou: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

topUpSchema.statics.calcTotalTopup = async function (investmentId) {
  const topUp = await this.aggregate([
    {
      $match: { investment: investmentId },
    },
    {
      $group: {
        _id: "$investment",
        nTopUps: { $sum: 1 },
        totalTopupAmt: { $sum: "$topUpAmount" },
      },
    },
  ]);

  if (topUp.length > 0) {
    await Investment.findByIdAndUpdate(investmentId, {
      topUpAmount: topUp[0].totalTopupAmt,
      ntopUps: topUp[0].nTopUps,
    });
  } else {
    await Investment.findByIdAndUpdate(investmentId, {
      topUpAmount: 0,
      ntopUps: 0,
    });
  }
};

topUpSchema.post("save", function () {
  if (this.topUpVerified === true) {
    this.constructor.calcTotalTopup(this.investment);
  }
});

// findByIdAndUpdate
// findByIdAndDelete
topUpSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

topUpSchema.post(/^findOneAndUpdate/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  const updated = await this.findOne();
  if (updated.topUpVerified === true) {
    await this.r.constructor.calcTotalTopup(this.r.investment);
  }
});
topUpSchema.post(/^findOneAndDelete/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcTotalTopup(this.r.investment);
});

const TopUp = mongoose.model("TopUp", topUpSchema);

module.exports = TopUp;

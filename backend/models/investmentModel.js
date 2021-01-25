const mongoose = require("mongoose");
const moment = require("moment");

const investmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: [true, "Contribution must have a contributor"],
    },
    type: {
      type: String,
      default: "New Investment",
    },
    officialBank: {
      type: String,
      required: [true, "Please Provide bank customer paid into"],
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
      required: [true, "This is required"],
    },
    confirmedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    investmentAmount: {
      type: Number,
      required: [true, "Contribution amount is required"],
      min: [100000, "The minimum contribution is 100,000 naira"],
    },
    investmentDuration: {
      type: Number,
      required: [true, "Duration of Contribution is required"],
    },
    percent: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paymentProof: String,
    investmentVerified: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      required: [true, "This is mandatory"],
    },
    dateInvestVerify: {
      type: Date,
    },
    paymentDates: [Date],
    topUpAmount: {
      type: Number,
      default: 0,
    },

    // topUpDate: {
    //   type: Date,
    // },
    // INVOICE DATA
    invoicePreparedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    invoicePrepared: { type: Boolean, default: true },
    dateInvoicePrepared: Date,
    invoice: String,
    receiptGenerateNote: String,

    // MOU DATA
    mouPreparedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    mouPrepared: { type: Boolean, default: true },
    mouGenerateNote: String,
    mou: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

investmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "investmentOfficer",
    select: "firstName lastName otherName",
  });
  next();
});

investmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: `fullName bankName accountName accountNumber phone address gender company minor baraNumber dob`,
  });
  next();
});

investmentSchema.virtual("topups", {
  ref: "TopUp",
  foreignField: "investment",
  localField: "_id",
});

const calculateROI = function (percent, amount) {
  const roi = Math.trunc((percent / 100) * amount);
  return roi;
};

investmentSchema.virtual("totalAmountInvested").get(function () {
  return this.investmentAmount + this.topUpAmount;
});

investmentSchema.index({ customer: 1 }, { unique: true });

// Generate ROI when Investment verification is true
investmentSchema.virtual("roi").get(function () {
  if (this.investmentVerified === false) {
    return 0;
  }
  let investmentROI = 0;
  let topupROI = 0;
  const implementDate = moment("2021-01-01").format("YYYY-MM-DD");
  const totalInvestmentAmount = this.investmentAmount + this.topUpAmount;

  if (moment(this.dateInvestVerify).format("YYYY-MM-DD") >= implementDate) {
    if (this.investmentDuration === 6) {
      if (totalInvestmentAmount <= 5000000) {
        investmentROI = calculateROI(10, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        investmentROI = calculateROI(5, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        investmentROI = calculateROI(2, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        investmentROI = calculateROI(1, this.investmentAmount);
      }
    } else if (this.investmentDuration === 12) {
      if (totalInvestmentAmount <= 5000000) {
        investmentROI = calculateROI(12, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        investmentROI = calculateROI(7, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        investmentROI = calculateROI(4, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        investmentROI = calculateROI(2, this.investmentAmount);
      }
    } else if (this.investmentDuration === 24) {
      if (totalInvestmentAmount <= 5000000) {
        investmentROI = calculateROI(15, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        investmentROI = calculateROI(10, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        investmentROI = calculateROI(5, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        investmentROI = calculateROI(3, this.investmentAmount);
      }
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (this.investmentDuration === 6) {
      if (totalInvestmentAmount <= 4900000) {
        investmentROI = calculateROI(15, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 4900001 &&
        totalInvestmentAmount <= 49000000
      ) {
        investmentROI = calculateROI(10, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 49000001 &&
        totalInvestmentAmount <= 99000000
      ) {
        investmentROI = calculateROI(5, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 99000001) {
        investmentROI = calculateROI(3, this.investmentAmount);
      }
    } else if (this.investmentDuration === 12) {
      if (totalInvestmentAmount <= 4900000) {
        investmentROI = calculateROI(17, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 4900001 &&
        totalInvestmentAmount <= 49000000
      ) {
        investmentROI = calculateROI(12, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 49000001 &&
        totalInvestmentAmount <= 99000000
      ) {
        investmentROI = calculateROI(7, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 99000001) {
        investmentROI = calculateROI(5, this.investmentAmount);
      }
    } else if (this.investmentDuration === 24) {
      if (totalInvestmentAmount <= 4900000) {
        investmentROI = calculateROI(20, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 4900001 &&
        totalInvestmentAmount <= 49000000
      ) {
        investmentROI = calculateROI(15, this.investmentAmount);
      }
      if (
        totalInvestmentAmount >= 49000001 &&
        totalInvestmentAmount <= 99000000
      ) {
        investmentROI = calculateROI(10, this.investmentAmount);
      }
      if (totalInvestmentAmount >= 99000001) {
        investmentROI = calculateROI(5, this.investmentAmount);
      }
    }
  }
  if (this.topUpAmount !== 0) {
    if (this.investmentDuration === 6) {
      if (totalInvestmentAmount <= 5000000) {
        topupROI = calculateROI(10, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        topupROI = calculateROI(5, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        topupROI = calculateROI(2, this.topUpAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        topupROI = calculateROI(1, this.topUpAmount);
      }
    } else if (this.investmentDuration === 12) {
      if (totalInvestmentAmount <= 5000000) {
        topupROI = calculateROI(12, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        topupROI = calculateROI(7, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        topupROI = calculateROI(4, this.topUpAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        topupROI = calculateROI(2, this.topUpAmount);
      }
    } else if (this.investmentDuration === 24) {
      if (totalInvestmentAmount <= 5000000) {
        topupROI = calculateROI(15, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 5000001 &&
        totalInvestmentAmount <= 50000000
      ) {
        topupROI = calculateROI(10, this.topUpAmount);
      }
      if (
        totalInvestmentAmount >= 50000001 &&
        totalInvestmentAmount <= 100000000
      ) {
        topupROI = calculateROI(5, this.topUpAmount);
      }
      if (totalInvestmentAmount >= 100000001) {
        topupROI = calculateROI(3, this.topUpAmount);
      }
    }
  }
  return investmentROI + topupROI;
  // const totalInvestmentAmount = this.investmentAmount + this.topUpAmount;
});

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;

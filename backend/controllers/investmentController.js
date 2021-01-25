const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const multer = require("multer");
const sharp = require("sharp");
const converter = require("number-to-words");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Investment = require("../models/investmentModel");
const factory = require("./handlerFactory");
const Email = require("../utils/email");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProofPhoto = upload.single("photo");

exports.resizeProofPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `proof-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(3508, 2480)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/img/proofPayment/${req.file.filename}`);

  next();
});

exports.setCustomerIds = (req, res, next) => {
  // Allow nested routes
  req.body.customer = req.params.customerId;
  next();
};

exports.getInvoice = catchAsync(async (req, res, next) => {
  const customerId = req.params.investmentId;
  const investment = await Investment.findById(customerId);

  if (!investment) {
    return next(new AppError("No document found with that ID", 404));
  }
  const newDate = Date.now();
  const invoiceName = `${investment.customer.firstName}-${investment.customer.lastName}-invoice-${newDate}.pdf`;

  const invoicePath = path.join("backend", "public", "invoices", invoiceName);

  await Investment.findByIdAndUpdate(customerId, {
    invoicePrepared: req.body.invoicePrepared,
    invoicePreparedBy: req.body.invoicePreparedBy,
    invoice: invoicePath,
  });

  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + invoiceName + '"'
  );
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // const day = moment(investment.dateInvestVerify).format('d');
  const day = moment(investment.dateInvestVerify).format("d");
  const month = moment(investment.dateInvestVerify).format("MM");
  const year = moment(investment.dateInvestVerify).format("YYYY");
  const investAmountWor = converter.toWords(investment.investmentAmount);
  const investAmountWord = investAmountWor.toUpperCase();
  const ranNum = Math.floor(Math.random() * 100000 + 1);
  let category;
  if (investment.investmentDuration === 6) {
    category = "Diamond";
  } else if (investment.investmentDuration === 12) {
    category = "Gold";
  } else if (investment.investmentDuration === 24) {
    category = "Platinum";
  }

  pdfDoc.image(path.join("frontend", "public", "cc.png"), 20, 0, {
    width: 100,
  });
  pdfDoc.image(path.join("frontend", "public", "cc_transpng.png"), 110, 10, {
    width: 380,
  });

  pdfDoc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(investment.customer.branch.coopName.toUpperCase(), 150, 10, {
      align: "center",
    });
  pdfDoc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(investment.customer.branch.address.toUpperCase(), 150, 50, {
      align: "center",
    });

  pdfDoc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("RECEIPT", 0, 100, { align: "center" });
  pdfDoc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`CUSTOMER COPY`, 0, 100, { align: "right" });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`DATE: ${day}/${month}/${year}`, 20, 130, { align: "left" });
  pdfDoc.fontSize(12).text("TRANSFER / DEPOSIT", 0, 130, { align: "center" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Teller No. BA-${investment.customer.branch.code}${ranNum}`, 0, 130, {
      align: "right",
    });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Name: ${investment.customer.fullName}`, 20, 160, { align: "left" });
  pdfDoc.fontSize(12).text(`Address: ${investment.customer.address}`, 20, 180, {
    align: "left",
  });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Amount: N${numberComma(investment.investmentAmount)}`, 20, 200, {
      align: "left",
    });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Description: ${investment.type}`, 20, 220, { align: "left" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Co-operative Category: ${category}`, 20, 240, { align: "left" });
  pdfDoc.fontSize(12).text(`Balance: `, 20, 260, { align: "left" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Amount in Words: ${investAmountWord} NAIRA ONLY`, 20, 280, {
      align: "left",
    });
  pdfDoc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`For CIACS`, 20, 320, { align: "left" });
  pdfDoc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(`Issued by: ${req.body.issuer}`, 20, 340);
  pdfDoc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Customer's Sign`, 20, 320, { align: "right" });

  pdfDoc.image(path.join("frontend", "public", "cc.png"), 20, 370, {
    width: 100,
  });
  pdfDoc.image(path.join("frontend", "public", "cc_transpng.png"), 110, 380, {
    width: 380,
  });

  pdfDoc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(investment.customer.branch.coopName.toUpperCase(), 150, 380, {
      align: "center",
    });
  pdfDoc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(investment.customer.branch.address.toUpperCase(), 150, 420, {
      align: "center",
    });

  pdfDoc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("RECEIPT", 0, 470, { align: "center" });
  pdfDoc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`OFFICE COPY`, 0, 470, { align: "right" });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`DATE: ${day}-${month}-${year}`, 20, 500, { align: "left" });
  pdfDoc.fontSize(12).text("TRANSFER / DEPOSIT", 0, 500, { align: "center" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Teller No. BA-${investment.customer.branch.code}${ranNum}`, 0, 500, {
      align: "right",
    });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Name: ${investment.customer.fullName}`, 20, 530, { align: "left" });
  pdfDoc.fontSize(12).text(`Address: ${investment.customer.address}`, 20, 550, {
    align: "left",
  });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Amount: N${numberComma(investment.investmentAmount)}`, 20, 570, {
      align: "left",
    });

  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Description: ${investment.type}`, 20, 590, { align: "left" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Co-operative Category: ${category}`, 20, 610, { align: "left" });
  pdfDoc.fontSize(12).text(`Balance: `, 20, 630, { align: "left" });
  pdfDoc
    .fontSize(12)
    .font("Helvetica")
    .text(`Amount in Words: ${investAmountWord} NAIRA ONLY`, 20, 650, {
      align: "left",
    });
  pdfDoc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`For CIACS`, 20, 680, { align: "left" });
  pdfDoc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(`Issued By: ${req.body.issuer}`, 20, 700);
  pdfDoc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Customer's Sign`, 20, 680, { align: "right" });

  pdfDoc.moveTo(0, 370).lineTo(1000, 370).dash(5, { space: 10 }).stroke();

  pdfDoc.end();
});

exports.getAllInvestments = factory.getAll(Investment);
exports.getInvestment = factory.getOne(Investment, { path: "topups" });
exports.createInvestment = factory.createOne(Investment);
exports.updateInvestment = factory.updateOne(Investment);
exports.deleteInvestment = factory.deleteOne(Investment);

exports.confirmPayment = catchAsync(async (req, res, next) => {
  const doc = await Investment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    doc,
  });
});

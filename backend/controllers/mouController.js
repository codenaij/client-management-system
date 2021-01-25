const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const converter = require('number-to-words');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Investment = require('../models/investmentModel');
const TopUp = require('../models/topupModel');

exports.createMou = catchAsync(async (req, res, next) => {
  const customerId = req.params.investmentId;
  const investment = await Investment.findById(customerId);

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!investment) {
    return next(new AppError('No document found with that ID', 404));
  }

  const investAmountWor = converter.toWords(investment.investmentAmount);
  const investAmountWord = investAmountWor.toUpperCase();
  const investAmountNumber = numberComma(investment.investmentAmount);

  let genderDesc;
  if (
    investment.customer.gender === 'male' &&
    investment.customer.company === false
  ) {
    genderDesc = 'his';
  } else if (
    investment.customer.gender === 'female' &&
    investment.customer.company === false
  ) {
    genderDesc = 'her';
  } else if (investment.customer.company === true) {
    genderDesc = 'its';
  }
  let genderDescContd;
  if (investment.customer.gender === 'male') {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'his';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'his';
    }
  } else if (investment.customer.gender === 'female') {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'her';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'her';
    }
  } else if (investment.customer.company === true) {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'its';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'its';
    }
  }

  let minor;
  if (investment.customer.minor === true) {
    minor = '(MINOR)';
  } else {
    minor = '';
  }

  let duration;
  if (investment.investmentDuration === 6) {
    duration = 'six (6) months';
  } else if (investment.investmentDuration === 12) {
    duration = 'one (1) year';
  } else if (investment.investmentDuration === 24) {
    duration = 'two (2) years';
  }

  let percent;
  if (investment.investmentDuration === 6) {
    if (investment.investmentAmount <= 4900000) {
      percent = '15%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '10%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '5%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '3%';
    }
  } else if (investment.investmentDuration === 12) {
    if (investment.investmentAmount <= 4900000) {
      percent = '17%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '12%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '7%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '5%';
    }
  } else if (investment.investmentDuration === 24) {
    if (investment.investmentAmount <= 4900000) {
      percent = '20%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '15%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '10%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '5%';
    }
  }
  let notice;
  if (investment.investmentDuration === 6) {
    notice = 'at any time during the duration';
  } else if (investment.investmentDuration === 12) {
    notice = 'from the 9th month';
  } else if (investment.investmentDuration === 24) {
    notice = 'from the 18th month';
  }
  let capitalReturn;
  if (investment.investmentDuration === 6) {
    capitalReturn = '';
  } else if (investment.investmentDuration === 12) {
    capitalReturn = ', which shall be on the 10th month of';
  } else if (investment.investmentDuration === 24) {
    capitalReturn = ', which shall be on the 19th month of';
  }
  let capitalReturnContd;
  if (investment.investmentDuration === 6) {
    capitalReturnContd = '';
  } else if (investment.investmentDuration === 12) {
    capitalReturnContd = 'business term,';
  } else if (investment.investmentDuration === 24) {
    capitalReturnContd = 'business term,';
  }

  const day = moment(investment.dateInvestVerify).format('Do');
  const month = moment(investment.dateInvestVerify).format('MMMM');
  const year = moment(investment.dateInvestVerify).format('YYYY');

  const newDate = Date.now();
  const mouName = `${investment.customer.fullName}-mou-${newDate}.pdf`;

  const mouPath = path.join('backend', 'public', 'agreement', mouName);
  await Investment.findByIdAndUpdate(customerId, {
    mouPrepared: req.body.mouPrepared,
    mouPreparedBy: req.body.mouPreparedBy,
    mouGenerateNote: req.body.mouGenerateNote,
    dateMouPrepared: req.body.dateMouPrepared,
    mou: mouPath,
  });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + mouName + '"');
  doc.pipe(fs.createWriteStream(mouPath));
  doc.pipe(res);

  doc.image(path.join('frontend', 'public', 'cc_transpng.png'), 70, 130, {
    width: 500,
  });
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text('COOPERATIVE AGREEMENT', { align: 'center' });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(30).text('BETWEEN', { align: 'center' });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text('CREATIVE & INNOVATIVE AGRICULTURAL COOPERATIVE SOCIETY LIMITED', {
      align: 'center',
    });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(30).text('AND', {
    align: 'center',
  });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text(investment.customer.fullName.toUpperCase(), {
      align: 'center',
    });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(16).text('Prepared By;', {
    align: 'left',
  });
  doc.moveDown();
  doc.font('Helvetica').fontSize(14).text('C.O Onogwu Esq', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(14).text('Legal Counsel', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc
    .font('Helvetica')
    .fontSize(14)
    .text('Creative & Innovative Agricultural', {
      align: 'left',
    });
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(14).text('Cooperative Society Limited.', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc
    .font('Helvetica')
    .fontSize(14)
    .text('No. 4 Kandi Close by Aminu Kano Crescent, Wuse II ', {
      align: 'left',
    });

  doc.addPage({
    margins: {
      top: 50,
      bottom: 50,
      left: 72,
      right: 72,
    },
  });

  doc.font('Helvetica');
  doc.fontSize(13);
  doc.image(path.join('frontend', 'public', 'cc.png'), 245, 40, { width: 100 });
  // doc.image(path.join('frontend', 'public', 'cc_transpng.png'), 110, 10, { width: 380 });

  doc
    .font('Helvetica-Bold')
    .text('COOPERATIVE AGREEMENT', 60, 150, { align: 'center' });
  doc.moveDown();
  doc
    .font('Helvetica')
    // .text(`This Cooperative Agreement is made this 12th day of October, 2020`, {
    .text(
      `This Cooperative Agreement is made this ${day} day of ${month}, ${year}`,
      {
        align: 'justify',
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('BETWEEN', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .text(
      `${investment.customer.branch.coopName.toUpperCase()}, a Cooperative Society duly registered in accordance with the Cooperative Societies ACT/REGULATIONS 2004 with its registered office at ${investment.customer.branch.address.toUpperCase()} (hereinafter referred to as “The First party, Cooperative”) which expression shall where the context so admits include its Successors-in title, executors, personal representatives and assigns of the ONE PART,`,
      {
        align: 'justify',
      }
    );
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('AND', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .text(
      `${investment.customer.fullName.toUpperCase()} ${minor} of ${investment.customer.address.toUpperCase()}, (hereinafter referred to as the “The Member”) which expression shall where the context so admits include ${genderDesc} successors-in-title, executors, personal representatives and assigns of the OTHER PART.`,
      {
        align: 'justify',
      }
    );
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('WHEREAS:', {
    align: 'left',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        'a. The First Party is a Cooperative Society engaged in creating and sourcing economical viable business opportunities for the benefits of its members.',
        'b. The Member has agreed with the First Party, and is desirous of being a member of the Cooperative by contributing a certain amount in expectation of certain Benefit on Contribution (BOC) monthly.',
        'c. The First party, Cooperative and the member (who shall in this context be referred) to as “The Parties” are desirous of going into a business relationship upon the receipt of payment of an agreed sum, aimed at realizing and maximizing the full benefits and business opportunities offered by the cooperative.',
        'd. The parties have agreed to do the business under the terms and conditions listed hereunder:',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('IT IS AGREED BY THE PARTIES AS FOLLOWS:', {
    align: 'left',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '1.	The member shall pay a registration/membership fee of ONE THOUSAND NAIRA ONLY (N1, 000.00).',
      `2.	The Member has contributed such reasonable capital of ${investAmountWord} NAIRA ONLY (N${investAmountNumber}) into the Cooperative for the purpose of a monthly Benefit on Contribution for the period of ${duration} which is subject to renewal after the stipulated period.`,
      `3.	It is agreed by both parties that each stage of the transaction shall be for a period of ${duration} which entitles the Member to an accrued interest. That upon its expiration, the Member receives payment of ${genderDesc} initial contribution or otherwise roll over to next phase of the contribution if the member is satisfied with the management services rendered by the cooperative.`,
      `4.	The cooperative shall be responsible for the management of all the member’s contribution and keep proper records of all the member’s directives regarding ${genderDesc} contribution.`,
      `5.	The Member shall be entitled to ${percent} of ${genderDesc} contribution capital as ${genderDesc} benefit sum otherwise known as “Benefit on Contribution” which shall be due for maturity after every one month. `,
      `6.	Where the Member desires to increase ${genderDesc} contribution capital, such increase shall be acknowledged by the cooperative which shall accordingly be reflected on ${genderDesc} already existing Contribution on the financial follow up chart, when such increase is made within five (5) days from the date of receipt of BOC. Any payment in respect of the above shall be made by the cooperative into the already existing bank account as furnished by the Member. `,
      '7.	That all losses incurred at the course of/or during the pendency of the business, shall be borne by the cooperative and the cooperative shall indemnify the member where such loss is likely or may have affected the contribution capital.',
      '8.	The statement of account of the member shall be presented to the relevant department of the Cooperative after every six months during the pendency of this Agreement.',
      `9.	Where the Member wishes to rollover ${genderDesc} contribution at the expiration of the first ${duration}, she shall notify the cooperative in writing of ${genderDesc} intention to rollover by submitting to the cooperative a letter delivered by hand, mail or courier services to be submitted at the cooperative’s registered address at least three weeks before the expiration of the ${duration} period.`,
      `10.	At the expiration of the business term of ${duration}, where the member has indicated interest to rollover, she shall make available a print out of ${genderDesc} statement of account for the ${duration} period and hand it over to the cooperative for citing and verification after which the member can rollover ${genderDesc} contribution sum.`,
      `11.	The business shall run for a consecutive period of ${duration} certain. However, where the Member desires to terminate ${genderDesc} business with the cooperative before the expiration of the first ${duration}, she shall notify the cooperative in writing of ${genderDesc} intention to so terminate by:`,
      [
        `a. Giving one month’s notice to the cooperative of ${genderDesc} intention to so terminate. This notice shall be allowed by the cooperative when it is given ${notice} of ${genderDesc} ${duration} period.`,
        'b.	In furtherance of (a) above, the member shall submit to the cooperative a letter delivered by hand, mail or courier services to be submitted at the cooperative’s registered address. ',
        `c.	Such capital shall be returned to the member after one month from the date of receipt of such notice${capitalReturn} ${genderDescContd} ${capitalReturnContd} after the cooperative is satisfied that the member has fulfilled all the requirements for such termination.`,
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      `12.	Where the agreement is terminated at the instance of the member before the expiration of the agreed ${duration} Plan, the Member shall no longer be entitled to ${percent} of ${genderDesc} contribution capital at the expiration of the one months’ notice.`,
      `13.	At the expiration of the business term of ${duration}, a member who wishes to withdraw ${genderDesc} contribution sum, shall before doing same, print out ${genderDesc} statement of account and hand it over to the cooperative for citing and verification after which the member can withdraw ${genderDesc} contribution sum. `,
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('COMMENCEMENT', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '14. This agreement is effective upon the day and date last signed and duly executed by the authorized representatives of the parties and shall remain in full force and effect until either of the following conditions occurs:',
        [
          'a. the execution and completion of the contract agreement.',
          'b. the written agreement of any of the parties to terminate. Such notice shall comply with the requirements for termination as stated in clause (9) to (11) of this business agreement.',
          `c. The expiration of the ${duration} business period (or such later date as the parties may agree in writing).`,
          'd. Upon termination of this agreement, neither party shall have any obligation to the other, except for obligations that had already accrued but remained undischarged before such termination. ',
        ],
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('NON DISCLOSURE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '15. Each party shall keep in strict confidence all financial, Commercial, and technical information belonging to the other party or which was developed jointly by the parties in preparation of the definitive agreement (the confidential information). Without the prior written consent of the other party, neither party shall at any time disclose any confidential information to any third party, save and except where it is necessary.',
        '16. Confidential information shall not include information which: ',
        [
          'i. become public through no fault of the receiving party,',
          'ii. is received on a non-confidential basis from third parties,',
          'iii. is independently developed by the parties with use of confidential information.  ',
        ],
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('LANGUAGE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '17. All agreements, correspondence and other documents relevant to this business agreement shall be in English.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('MODIFICATION', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '18. No provision of this Agreement shall be varied, amended, modified, contradicted or explained by any oral agreement in the course of dealing or performance or any other matter not set forth in an agreement in writing and signed by The Parties or their duly authorized representative.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('DISPUTE RESOLUTION', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '19. The parties recognize that differences sometimes arise in the course of a relationship and wish to avoid litigation. Accordingly, all complaints, claims, disputes and other matters in question between the parties arising out of or relating to this agreement or the breach thereof, shall first be submitted to the complaints committee of the cooperative for resolutions. Where the complaints committee fails to resolve such disputes within a reasonable time, the disputes shall be submitted to negotiation within the cooperative and may, failing resolution, then be subject to arbitration as set forth below; however, in all other cases, all legal and equitable rights and remedies provided at law and equity are reserved.',
      [
        'a. Disputes claimed by either party must be made by written notice promptly upon the recognition of the event giving rise to such claim. Pending final resolution of any dispute, including arbitration in accordance with this provision, the party shall proceed diligently with performance of its obligations to the extent it is unrelated to the dispute and the subject matter of the dispute does not inhibit the progress of the business operations generally.',
        'b. Such performance by party shall not operate to waive or stop either party from pursuing the claim which gave rise to the dispute. ',
        "c. Where the parties so desire, they shall each appoint a representative who shall be privy to this agreement to meet for the purpose of dispute resolution. If the parties' representatives are able to reach an agreement, the dispute will be deemed resolved. ",
        'd. In furtherance of (c) above, the parties may each appoint a Solicitor for the purposes of dispute resolution where all the above stated options are exhausted without success. ',
        "e. lf after 60 days from the date the dispute arose these negotiations prove unsuccessful in whole or in part, the parties may request that any remaining disputes be resolved by arbitration in accordance with the Provisions of the Arbitration and Conciliation Act CAP 19 Laws of the Federation of Nigeria 2004, and such disputes shall be arbitrated. Any award rendered pursuant to arbitration may include reasonable attorneys' fees and costs shall be final and binding upon the parties, and judgment may be entered upon it in a court of competent jurisdiction. All applicable statutes of limitations and the like shall be stayed while the requirements of this provision are pending, but only as to the issues hereby submitted for negotiation or arbitration. ",
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      '20. For the purpose of this contribution, ONLY THE BANK ACCOUNT BEARING THE COOPERATIVE NAME will be used for business. Further note that physical cash is not allowed.',
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('FORCE MAJEURE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '21. The Cooperative shall not be liable for any failure of or delay in the performance of this agreement for the period that such failure or delay is',
      [
        'a. beyond the reasonable control of the cooperative.',
        'b. materially affects the performance of any of its obligations under this agreement and ',
        'c. could not reasonably have foreseen or provided against but ',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      '22. Notwithstanding the foregoing, in the event of such an occurrence, the cooperative agrees to make in good faith, effort to perform its obligations hereunder.',
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('APPLICABLE LAWS', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '23. The laws of the Federal Republic of Nigeria shall govern the construction interpretation and enforcement in this cooperative agreement.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown(5);
  doc.addPage({
    margins: {
      top: 50,
      bottom: 50,
      left: 72,
      right: 72,
    },
  });
  doc
    .font('Helvetica-Bold')
    .text('IN WITNESS THE PARTIES TO THIS COOPERATIVE SIGN AS FOLLOWS', {
      align: 'justify',
    });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .text(
      'THE COMMON SEAL OF CREATIVE AND INNOVATIVE AGRICULTURAL COOPERATIVE SOCIETY LIMITED HAS BEEN AFFIXED IN THE PRESENCE OF',
      {
        align: 'justify',
      }
    );

  doc.image(path.join('frontend', 'public', 'cc.png'), 230, 130, {
    width: 150,
  });
  doc.font('Helvetica-Bold').text('PRESIDENT', 70, 290);
  doc.font('Helvetica-Bold').text('SECRETARY', 430, 290);
  doc.font('Helvetica-Bold').text('_______________', 70, 330);
  doc.font('Helvetica-Bold').text('_______________', 430, 330);
  doc.font('Helvetica-Bold').text('____________________ (Member)', 70, 390);
  doc
    .font('Helvetica-Bold')
    .text(
      `${investment.customer.fullName}                           DATE: ___________`,
      70,
      410
    );
  doc.font('Helvetica-Bold').text('In the presence of (witness)', 300, 460);
  doc.font('Helvetica-Bold').text('Name: ________________________', 300, 480);
  doc.font('Helvetica-Bold').text('Address: ______________________', 300, 500);
  doc.font('Helvetica-Bold').text('Signature: _____________________', 300, 520);
  doc.font('Helvetica-Bold').text('Date: _________________________', 300, 540);
  doc.end();
});

exports.createTopMou = catchAsync(async (req, res, next) => {
  const customerId = req.params.investmentId;
  const investment = await TopUp.findById(customerId);

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!investment) {
    return next(new AppError('No document found with that ID', 404));
  }

  const investAmountWor = converter.toWords(investment.investmentAmount);
  const investAmountWord = investAmountWor.toUpperCase();
  const investAmountNumber = numberComma(investment.investmentAmount);

  let genderDesc;
  if (
    investment.customer.gender === 'male' &&
    investment.customer.company === false
  ) {
    genderDesc = 'his';
  } else if (
    investment.customer.gender === 'female' &&
    investment.customer.company === false
  ) {
    genderDesc = 'her';
  } else if (investment.customer.company === true) {
    genderDesc = 'its';
  }
  let genderDescContd;
  if (investment.customer.gender === 'male') {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'his';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'his';
    }
  } else if (investment.customer.gender === 'female') {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'her';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'her';
    }
  } else if (investment.customer.company === true) {
    if (investment.investmentDuration === 6) {
      genderDescContd = '';
    } else if (investment.investmentDuration === 12) {
      genderDescContd = 'its';
    } else if (investment.investmentDuration === 24) {
      genderDescContd = 'its';
    }
  }

  let minor;
  if (investment.customer.minor === true) {
    minor = '(MINOR)';
  } else {
    minor = '';
  }

  let duration;
  if (investment.investmentDuration === 6) {
    duration = 'six (6) months';
  } else if (investment.investmentDuration === 12) {
    duration = 'one (1) year';
  } else if (investment.investmentDuration === 24) {
    duration = 'two (2) years';
  }

  let percent;
  if (investment.investmentDuration === 6) {
    if (investment.investmentAmount <= 4900000) {
      percent = '15%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '10%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '5%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '3%';
    }
  } else if (investment.investmentDuration === 12) {
    if (investment.investmentAmount <= 4900000) {
      percent = '17%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '12%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '7%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '5%';
    }
  } else if (investment.investmentDuration === 24) {
    if (investment.investmentAmount <= 4900000) {
      percent = '20%';
    }
    if (
      investment.investmentAmount >= 4900001 &&
      investment.investmentAmount <= 49000000
    ) {
      percent = '15%';
    }
    if (
      investment.investmentAmount >= 49000001 &&
      investment.investmentAmount <= 99000000
    ) {
      percent = '10%';
    }
    if (investment.investmentAmount >= 99000001) {
      percent = '5%';
    }
  }
  let notice;
  if (investment.investmentDuration === 6) {
    notice = 'at any time during the duration';
  } else if (investment.investmentDuration === 12) {
    notice = 'from the 9th month';
  } else if (investment.investmentDuration === 24) {
    notice = 'from the 18th month';
  }
  let capitalReturn;
  if (investment.investmentDuration === 6) {
    capitalReturn = '';
  } else if (investment.investmentDuration === 12) {
    capitalReturn = ', which shall be on the 10th month of';
  } else if (investment.investmentDuration === 24) {
    capitalReturn = ', which shall be on the 19th month of';
  }
  let capitalReturnContd;
  if (investment.investmentDuration === 6) {
    capitalReturnContd = '';
  } else if (investment.investmentDuration === 12) {
    capitalReturnContd = 'business term,';
  } else if (investment.investmentDuration === 24) {
    capitalReturnContd = 'business term,';
  }

  const day = moment(investment.dateInvestVerify).format('Do');
  const month = moment(investment.dateInvestVerify).format('MMMM');
  const year = moment(investment.dateInvestVerify).format('YYYY');

  const newDate = Date.now();
  const mouName = `${investment.customer.fullName}-mou-${newDate}.pdf`;

  const mouPath = path.join('backend', 'public', 'agreement', mouName);
  await Investment.findByIdAndUpdate(customerId, {
    mouPrepared: req.body.mouPrepared,
    mouPreparedBy: req.body.mouPreparedBy,
    mouGenerateNote: req.body.mouGenerateNote,
    dateMouPrepared: req.body.dateMouPrepared,
    mou: mouPath,
  });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + mouName + '"');
  doc.pipe(fs.createWriteStream(mouPath));
  doc.pipe(res);

  doc.image(path.join('frontend', 'public', 'cc_transpng.png'), 70, 130, {
    width: 500,
  });
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text('COOPERATIVE AGREEMENT', { align: 'center' });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(30).text('BETWEEN', { align: 'center' });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text('CREATIVE & INNOVATIVE AGRICULTURAL COOPERATIVE SOCIETY LIMITED', {
      align: 'center',
    });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(30).text('AND', {
    align: 'center',
  });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .text(investment.customer.fullName.toUpperCase(), {
      align: 'center',
    });
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(16).text('Prepared By;', {
    align: 'left',
  });
  doc.moveDown();
  doc.font('Helvetica').fontSize(14).text('C.O Onogwu Esq', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(14).text('Legal Counsel', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc
    .font('Helvetica')
    .fontSize(14)
    .text('Creative & Innovative Agricultural', {
      align: 'left',
    });
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(14).text('Cooperative Society Limited.', {
    align: 'left',
  });
  doc.moveDown(0.2);
  doc
    .font('Helvetica')
    .fontSize(14)
    .text('No. 4 Kandi Close by Aminu Kano Crescent, Wuse II ', {
      align: 'left',
    });

  doc.addPage({
    margins: {
      top: 50,
      bottom: 50,
      left: 72,
      right: 72,
    },
  });

  doc.font('Helvetica');
  doc.fontSize(13);
  doc.image(path.join('frontend', 'public', 'cc.png'), 245, 40, { width: 100 });
  // doc.image(path.join('frontend', 'public', 'cc_transpng.png'), 110, 10, { width: 380 });

  doc
    .font('Helvetica-Bold')
    .text('COOPERATIVE AGREEMENT', 60, 150, { align: 'center' });
  doc.moveDown();
  doc
    .font('Helvetica')
    // .text(`This Cooperative Agreement is made this 12th day of October, 2020`, {
    .text(
      `This Cooperative Agreement is made this ${day} day of ${month}, ${year}`,
      {
        align: 'justify',
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('BETWEEN', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .text(
      `${investment.customer.branch.coopName.toUpperCase()}, a Cooperative Society duly registered in accordance with the Cooperative Societies ACT/REGULATIONS 2004 with its registered office at ${investment.customer.branch.address.toUpperCase()} (hereinafter referred to as “The First party, Cooperative”) which expression shall where the context so admits include its Successors-in title, executors, personal representatives and assigns of the ONE PART,`,
      {
        align: 'justify',
      }
    );
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('AND', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .text(
      `${investment.customer.fullName.toUpperCase()} ${minor} of ${investment.customer.address.toUpperCase()}, (hereinafter referred to as the “The Member”) which expression shall where the context so admits include ${genderDesc} successors-in-title, executors, personal representatives and assigns of the OTHER PART.`,
      {
        align: 'justify',
      }
    );
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('WHEREAS:', {
    align: 'left',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        'a. The First Party is a Cooperative Society engaged in creating and sourcing economical viable business opportunities for the benefits of its members.',
        'b. The Member has agreed with the First Party, and is desirous of being a member of the Cooperative by contributing a certain amount in expectation of certain Benefit on Contribution (BOC) monthly.',
        'c. The First party, Cooperative and the member (who shall in this context be referred) to as “The Parties” are desirous of going into a business relationship upon the receipt of payment of an agreed sum, aimed at realizing and maximizing the full benefits and business opportunities offered by the cooperative.',
        'd. The parties have agreed to do the business under the terms and conditions listed hereunder:',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('IT IS AGREED BY THE PARTIES AS FOLLOWS:', {
    align: 'left',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '1.	The member shall pay a registration/membership fee of ONE THOUSAND NAIRA ONLY (N1, 000.00).',
      `2.	The Member has contributed such reasonable capital of ${investAmountWord} NAIRA ONLY (N${investAmountNumber}) into the Cooperative for the purpose of a monthly Benefit on Contribution for the period of ${duration} which is subject to renewal after the stipulated period.`,
      `3.	It is agreed by both parties that each stage of the transaction shall be for a period of ${duration} which entitles the Member to an accrued interest. That upon its expiration, the Member receives payment of ${genderDesc} initial contribution or otherwise roll over to next phase of the contribution if the member is satisfied with the management services rendered by the cooperative.`,
      `4.	The cooperative shall be responsible for the management of all the member’s contribution and keep proper records of all the member’s directives regarding ${genderDesc} contribution.`,
      `5.	The Member shall be entitled to ${percent} of ${genderDesc} contribution capital as ${genderDesc} benefit sum otherwise known as “Benefit on Contribution” which shall be due for maturity after every one month. `,
      `6.	Where the Member desires to increase ${genderDesc} contribution capital, such increase shall be acknowledged by the cooperative which shall accordingly be reflected on ${genderDesc} already existing Contribution on the financial follow up chart, when such increase is made within five (5) days from the date of receipt of BOC. Any payment in respect of the above shall be made by the cooperative into the already existing bank account as furnished by the Member. `,
      '7.	That all losses incurred at the course of/or during the pendency of the business, shall be borne by the cooperative and the cooperative shall indemnify the member where such loss is likely or may have affected the contribution capital.',
      '8.	The statement of account of the member shall be presented to the relevant department of the Cooperative after every six months during the pendency of this Agreement.',
      `9.	Where the Member wishes to rollover ${genderDesc} contribution at the expiration of the first ${duration}, she shall notify the cooperative in writing of ${genderDesc} intention to rollover by submitting to the cooperative a letter delivered by hand, mail or courier services to be submitted at the cooperative’s registered address at least three weeks before the expiration of the ${duration} period.`,
      `10.	At the expiration of the business term of ${duration}, where the member has indicated interest to rollover, she shall make available a print out of ${genderDesc} statement of account for the ${duration} period and hand it over to the cooperative for citing and verification after which the member can rollover ${genderDesc} contribution sum.`,
      `11.	The business shall run for a consecutive period of ${duration} certain. However, where the Member desires to terminate ${genderDesc} business with the cooperative before the expiration of the first ${duration}, she shall notify the cooperative in writing of ${genderDesc} intention to so terminate by:`,
      [
        `a. Giving one month’s notice to the cooperative of ${genderDesc} intention to so terminate. This notice shall be allowed by the cooperative when it is given ${notice} of ${genderDesc} ${duration} period.`,
        'b.	In furtherance of (a) above, the member shall submit to the cooperative a letter delivered by hand, mail or courier services to be submitted at the cooperative’s registered address. ',
        `c.	Such capital shall be returned to the member after one month from the date of receipt of such notice${capitalReturn} ${genderDescContd} ${capitalReturnContd} after the cooperative is satisfied that the member has fulfilled all the requirements for such termination.`,
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      `12.	Where the agreement is terminated at the instance of the member before the expiration of the agreed ${duration} Plan, the Member shall no longer be entitled to ${percent} of ${genderDesc} contribution capital at the expiration of the one months’ notice.`,
      `13.	At the expiration of the business term of ${duration}, a member who wishes to withdraw ${genderDesc} contribution sum, shall before doing same, print out ${genderDesc} statement of account and hand it over to the cooperative for citing and verification after which the member can withdraw ${genderDesc} contribution sum. `,
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('COMMENCEMENT', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '14. This agreement is effective upon the day and date last signed and duly executed by the authorized representatives of the parties and shall remain in full force and effect until either of the following conditions occurs:',
        [
          'a. the execution and completion of the contract agreement.',
          'b. the written agreement of any of the parties to terminate. Such notice shall comply with the requirements for termination as stated in clause (9) to (11) of this business agreement.',
          `c. The expiration of the ${duration} business period (or such later date as the parties may agree in writing).`,
          'd. Upon termination of this agreement, neither party shall have any obligation to the other, except for obligations that had already accrued but remained undischarged before such termination. ',
        ],
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('NON DISCLOSURE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '15. Each party shall keep in strict confidence all financial, Commercial, and technical information belonging to the other party or which was developed jointly by the parties in preparation of the definitive agreement (the confidential information). Without the prior written consent of the other party, neither party shall at any time disclose any confidential information to any third party, save and except where it is necessary.',
        '16. Confidential information shall not include information which: ',
        [
          'i. become public through no fault of the receiving party,',
          'ii. is received on a non-confidential basis from third parties,',
          'iii. is independently developed by the parties with use of confidential information.  ',
        ],
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('LANGUAGE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '17. All agreements, correspondence and other documents relevant to this business agreement shall be in English.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('MODIFICATION', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '18. No provision of this Agreement shall be varied, amended, modified, contradicted or explained by any oral agreement in the course of dealing or performance or any other matter not set forth in an agreement in writing and signed by The Parties or their duly authorized representative.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('DISPUTE RESOLUTION', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '19. The parties recognize that differences sometimes arise in the course of a relationship and wish to avoid litigation. Accordingly, all complaints, claims, disputes and other matters in question between the parties arising out of or relating to this agreement or the breach thereof, shall first be submitted to the complaints committee of the cooperative for resolutions. Where the complaints committee fails to resolve such disputes within a reasonable time, the disputes shall be submitted to negotiation within the cooperative and may, failing resolution, then be subject to arbitration as set forth below; however, in all other cases, all legal and equitable rights and remedies provided at law and equity are reserved.',
      [
        'a. Disputes claimed by either party must be made by written notice promptly upon the recognition of the event giving rise to such claim. Pending final resolution of any dispute, including arbitration in accordance with this provision, the party shall proceed diligently with performance of its obligations to the extent it is unrelated to the dispute and the subject matter of the dispute does not inhibit the progress of the business operations generally.',
        'b. Such performance by party shall not operate to waive or stop either party from pursuing the claim which gave rise to the dispute. ',
        "c. Where the parties so desire, they shall each appoint a representative who shall be privy to this agreement to meet for the purpose of dispute resolution. If the parties' representatives are able to reach an agreement, the dispute will be deemed resolved. ",
        'd. In furtherance of (c) above, the parties may each appoint a Solicitor for the purposes of dispute resolution where all the above stated options are exhausted without success. ',
        "e. lf after 60 days from the date the dispute arose these negotiations prove unsuccessful in whole or in part, the parties may request that any remaining disputes be resolved by arbitration in accordance with the Provisions of the Arbitration and Conciliation Act CAP 19 Laws of the Federation of Nigeria 2004, and such disputes shall be arbitrated. Any award rendered pursuant to arbitration may include reasonable attorneys' fees and costs shall be final and binding upon the parties, and judgment may be entered upon it in a court of competent jurisdiction. All applicable statutes of limitations and the like shall be stayed while the requirements of this provision are pending, but only as to the issues hereby submitted for negotiation or arbitration. ",
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      '20. For the purpose of this contribution, ONLY THE BANK ACCOUNT BEARING THE COOPERATIVE NAME will be used for business. Further note that physical cash is not allowed.',
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('FORCE MAJEURE', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').list(
    [
      '21. The Cooperative shall not be liable for any failure of or delay in the performance of this agreement for the period that such failure or delay is',
      [
        'a. beyond the reasonable control of the cooperative.',
        'b. materially affects the performance of any of its obligations under this agreement and ',
        'c. could not reasonably have foreseen or provided against but ',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      },
      '22. Notwithstanding the foregoing, in the event of such an occurrence, the cooperative agrees to make in good faith, effort to perform its obligations hereunder.',
    ],
    {
      align: 'justify',
      bulletRadius: 0.1,
    }
  );
  doc.moveDown();
  doc.font('Helvetica-Bold').text('APPLICABLE LAWS', {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc
    .font('Helvetica')
    .list(
      [
        '23. The laws of the Federal Republic of Nigeria shall govern the construction interpretation and enforcement in this cooperative agreement.',
      ],
      {
        align: 'justify',
        bulletRadius: 0.1,
      }
    );
  doc.moveDown(5);
  doc.addPage({
    margins: {
      top: 50,
      bottom: 50,
      left: 72,
      right: 72,
    },
  });
  doc
    .font('Helvetica-Bold')
    .text('IN WITNESS THE PARTIES TO THIS COOPERATIVE SIGN AS FOLLOWS', {
      align: 'justify',
    });
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .text(
      'THE COMMON SEAL OF CREATIVE AND INNOVATIVE AGRICULTURAL COOPERATIVE SOCIETY LIMITED HAS BEEN AFFIXED IN THE PRESENCE OF',
      {
        align: 'justify',
      }
    );

  doc.image(path.join('frontend', 'public', 'cc.png'), 230, 130, {
    width: 150,
  });
  doc.font('Helvetica-Bold').text('PRESIDENT', 70, 290);
  doc.font('Helvetica-Bold').text('SECRETARY', 430, 290);
  doc.font('Helvetica-Bold').text('_______________', 70, 330);
  doc.font('Helvetica-Bold').text('_______________', 430, 330);
  doc.font('Helvetica-Bold').text('____________________ (Member)', 70, 390);
  doc
    .font('Helvetica-Bold')
    .text(
      `${investment.customer.fullName}                           DATE: ___________`,
      70,
      410
    );
  doc.font('Helvetica-Bold').text('In the presence of (witness)', 300, 460);
  doc.font('Helvetica-Bold').text('Name: ________________________', 300, 480);
  doc.font('Helvetica-Bold').text('Address: ______________________', 300, 500);
  doc.font('Helvetica-Bold').text('Signature: _____________________', 300, 520);
  doc.font('Helvetica-Bold').text('Date: _________________________', 300, 540);
  doc.end();
});

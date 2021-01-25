const nodemailer = require('nodemailer');
const pug = require('pug');
// const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(doc, url, attachment, roiDates) {
    this.to = doc.customer.email;
    this.firstName = doc.customer.fullName.split(' ')[1];
    this.attachment = attachment;
    this.url = url;
    this.roiDates = roiDates;
    this.from = `Creative Cooperative Society <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    // }

    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../public/email/${template.pug}`,
      {
        firstName: this.firstName,
        url: this.url,
        attachment: this.attachment,
        roiDates: this.roiDates,
        subject,
      }
    );

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html)
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendConfirmation() {
    await this.send(
      'paymentConfirm',
      'Your Payment has been confirmed for your Creative and Innovative Agricultural Co-operative Society Limited'
    );
  }

  async sendMou() {
    await this.send(
      'mouMail',
      "Here's your legal agreement for Creative and Innovative Agricultural Co-operative Society Limited"
    );
  }
};

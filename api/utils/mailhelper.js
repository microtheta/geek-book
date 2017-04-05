import nodemailer from 'nodemailer';
import { EmailTemplate } from 'email-templates';
import path from 'path';

const client = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'no-reply@microtheta.com',
    pass: 'micro@theta#1'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = (subject, body, to, cc, bcc, cb) => {
  const email = {
    from: 'no-reply@microtheta.com',
    to,
    cc,
    bcc,
    subject,
    html: body
  };

  client.sendMail(email, (err, info) => {
    if (err) {
      console.log(`Mail send err: ${err}`);
    } else {
      console.log(`Message sent: ${info.response}`);
      if (cb && typeof cb === 'function') {
        cb();
      }
    }
  });
};

const sendHtmlMail = (templateName, data, subject, to, cc, bcc, cb) => {
  const tmplPath = path.join(__dirname, 'templates', templateName);
  const template = new EmailTemplate(tmplPath);
  template.render(data, (err, result) => {
    if (err) {
      console.log('HTML mail err', err);
    } else {
      sendMail(subject, result.html, to, cc, bcc, cb);
    }
  });
};

module.exports = {
  sendHtmlMail,
  sendMail
};

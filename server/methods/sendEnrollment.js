 import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));

Meteor.methods({
 sendEmail(recipient) {
    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();
    Email.send({
    	to: recipient, 
       from: 'admin@IHGscheduling.com',
       subject: 'IHG Scheduling: Copy text in browser to proceed to register as IHG Player',
       html: SSR.render('htmlEmail')
    });
  }
});

Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://postmaster%40sandbox66fb2ccc222b46a3af8f57cefd2a4748.mailgun.org:b03c92c716d14cf3077b62bb948b60c7-8889127d-a0e401e2@smtp.mailgun.org:587";
});

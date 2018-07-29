 import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


Meteor.methods({
 sendEmail(recipient) {
    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();
    Email.send({
    	to: 'ihgscheduling@gmail.com', 
       from: 'admin@IHGscheduling.com',
       subject: 'IHG Scheduling: send player register link',
       text: "send email to " + recipient
    }); 
  } 
}); 

Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://postmaster%40sandbox61b61c2e7b75405a8e977eb43e21d7c2.mailgun.org:b0ecb604d0ca4beffa7a146e0188cca4-8889127d-1716d116@smtp.mailgun.org:587";
});

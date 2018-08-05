import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import '/imports/api/modal.js';
import './modal.html';

Template.modal.onCreated(function() {
  $('body .modals').remove();
  this.autorun(() => {
    this.subscribe('userInfo');
  });
});


Template.modal.events({
  //once click on the submit button
  'click .button': function(event, template) { 
  	$('.ui.basic.modal').modal({
      onApprove : function() {
        console.log("onApprove");
        Session.set('confirmDetails', true);
        Meteor.call('submitConfirmation', {}, function (error) {
          console.log("meteor.call working");
          if (error && error.error === "logged-out") {
          // show a nice error message
          Session.set("errorMessage", "Please log in before submitting your details.");
          } 
        });
      },
      onDeny : function(){
        $('body .modals').remove();
      }
    })
    .modal('show');//modal appears
    $('.ui.dimmer').dimmer('show');
  }
});

Template.modal.helpers({
  buttonText(){
    if (Meteor.user().submitConfirmation ){
      return "Submitted";
    } else{
      return "Submit";
    }
  },
  submitConfirmation(){
    if (Meteor.user().submitConfirmation ){
      return "disabled";
    }
  }
});

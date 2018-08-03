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

Template.modal.onRendered= function() {
  $('.ui.modal')
	.modal({
	  onApprove : function() {
	    Meteor.call('submitConfirmation', {}, function (error) {
	      //console.log("meteor.call working");
	      if (error && error.error === "logged-out") {
	        // show a nice error message
	        Session.set("errorMessage", "Please log in before submitting your details.");
	      } 
	    });
	    if (Meteor.user().submitConfirmation ){ 
	    //if previous meteor.call doesnt hv error
	    	$('.ui.button').state("disabled");
	    }
	  },
    onDeny : function(){
      $('body .modals').remove();
    }
	});

  $('.ui.button')
    .state({
      text: {
        disabled  : 'Submitted'
      }
    });
};

Template.modal.events({
  //once click on the submit button
  'click .button': function(event, template) { 

  	if(!Meteor.user().submitConfirmation){ //ensure it is being submitted for first time
  	  $('.ui.basic.modal').modal('show'); //modal appears
      $('.ui.dimmer').dimmer('show');
  	}
   }
});


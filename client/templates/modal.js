import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.modal.onCreated(function() {
  this.autorun(() => {
    this.subscribe('userInfo');
  });
});

Template.modal.rendered= function() {
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
	    	$('.ui.toggle.button').state("active");
	    }
	  }
	});

  $('.ui.toggle.button')
    .state({
      text: {
        inactive : 'Submit',
        active   : 'Submitted'
      }

    });
};

Template.modal.events({
  //once click on the submit button
  'click .toggle': function(event, template) { 
  	if(!Meteor.user().submitConfirmation){ //ensure it is being submitted for first time
  	  $('.ui.basic.modal').modal('show'); //modal appears
      $('.ui.dimmer').dimmer('show');
  	}
   }
});


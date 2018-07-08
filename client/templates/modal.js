import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.modal.rendered= function() {
  $('.ui.modal')
	.modal({
	  onApprove : function() {
	    Meteor.call('submitBlockOut', {}, function (error) {
	      //console.log("meteor.call working");
	      if (error && error.error === "logged-out") {
	        // show a nice error message
	        Session.set("errorMessage", "Please log in before submitting your details.");
	      } 
	    });
	  }
	})
};

Template.modal.events({
  //once click on the submit button
  'click .button': function(event, template) { 
    $('.ui.basic.modal').modal('show'); //modal appears
    $('.ui.dimmer').dimmer('show');
   }
});

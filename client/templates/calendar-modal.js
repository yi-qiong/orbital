import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import './calendar-modal.html';
import '/imports/api/matches.js'; //meteor methods

Template.calendarModal.onCreated(function() {
  $('body .modals').remove();
});

Template.calendarModal.rendered= function() {
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.checkbox').checkbox();
  this.$('.ui.modal').modal({
     autofocus: false,
     onApprove : function() {
      //probably wont execute since nvr include <actions>
    }
  });
  
  this.$('.ui.form') //validate
    .form({
       fields: {
         sport    : 'empty',
         round    : 'empty',
         halls    : 'minCount[2]',
       },
       onSubmit:function(event){
       	 event.preventDefault();
       },
       onSuccess: function(event, fields){
         $('.ui.modal').modal('hide'); //only hide when all fields are valid
         Bert.alert( 'Match added successfully', 'success' );
         var $form = $('.ui.form');
         var sport = $form.form('get value', 'sport');
         var round = $form.form('get value', 'round');
         var halls = $form.form('get value', 'halls');
         Meteor.call('createMatch', {
          sport: sport,
          round: round,
          halls: halls,
         }, function (error) {
            if (error && error.error === "logged-out") {
              // show a nice error message
              Session.set("errorMessage", "Please log in before submitting your details.");
            } 
         });   
       }
    });
};


Template.edit.events({
  //once click on the addMatch button
  'click #addMatch': function(event, template) { 
      event.preventDefault();
      $('.ui.modal').modal('show'); //modal appears
      $('.ui.dimmer').dimmer('show');
      $(this).blur(); //prevent button focus
  },
  'click #close' : function(event, template){
    $('.ui.form').form('clear'); //clear form before closing modal
  }
});




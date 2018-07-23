import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './calendar-modal.html';
import '/imports/api/matches.js'; //meteor methods

Template.calendarModal.onCreated(function() {
  $('body .modals').remove();
});

Template.calendarModal.rendered= function() {
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.checkbox').checkbox();
  $('.ui.modal').modal({
    centered: true,
     onApprove : function() {
      console.log('onApprove');
      $('.ui.form').form('submit');
    }
  });
  
  this.$('.ui.form') //validate
    .form({
       fields: {
         sport    : 'empty',
         round    : 'empty',
         halls    : 'empty',
       },
    onSuccess: function(event, fields){
      event.preventDefault();
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
  }
});




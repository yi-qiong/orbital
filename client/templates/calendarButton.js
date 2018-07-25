import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import './calendarButton.html';

Template.calendarButton.onCreated(function() {
  $('body .modals').remove();
});

Template.calendarButton.rendered= function() {
  this.$('.ui.modal').modal({
     autofocus: false,
     onApprove : function() {
      //probably wont execute since nvr include <actions>
    }
  });
});

Template.calendarButton.events({
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

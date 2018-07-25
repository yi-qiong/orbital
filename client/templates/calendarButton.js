import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import './calendarButton.html';

Template.calendarButton.onCreated(function() {
  $('body .modals').remove();
});

Template.calendarButton.rendered= function() {
  this.$('.ui.modal').modal({
    inverted: true,
     autofocus: false,
     onApprove : function() {
      //probably wont execute since nvr include <actions>
    }
  });
};

Template.calendarButton.events({
  //once click on the addMatch button
  'click #addMatch': function(event, template) { 
      $('.ui.modal').modal('show'); //modal appears
      $(this).blur(); //prevent button focus
  }
});

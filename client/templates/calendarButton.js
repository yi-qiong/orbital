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
  },
  'click #edit': function(e, t) { 
    $('.ui.modal').modal('show'); //modal appears
    $(this).blur(); //prevent button focus
  },
  'click #delete': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId );
    $("#calendar").fullCalendar('removeEvents', function(event) {
      return true;
    });
    $(this).blur(); //prevent button focus
  },
  'click #view': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId );
    showAvailableSlots(event);  //function
    $(this).blur(); //prevent button focus
  }
});

Template.calendarButton.helpers({
  isEditMode(){
    return Session.get ('isEditMode');
  }
});

Template.calendarButton.onCreated(function() {
  $('.icon.buttons .button')
    .transition({
      animation : 'jiggle',
      duration  : 800,
      interval  : 200
    })
  ;
});
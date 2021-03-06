import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './add-availability.html';
import '/imports/api/availability.js';

$('#availability').checkbox();

Template.addAppointment.onRendered( () => {
  $( '#datepicker' ).datetimepicker({
    timeZone: 'SGT',
    minDate: new Date(), //disable past dates and only show date starting from the current date
    format: 'DD/MM/YYYY'
  }); 

  $('#start_time').datetimepicker({
    stepping: 30, //only allow time selection in intervals of 30 mins
    format: 'hh:mm A'
  });

  $('#end_time').datetimepicker({
    stepping: 30, //only allow time selection in intervals of 30 mins
    format: 'hh:mm A'
  });

  document.getElementById("confirm").style.display="none"; //hide confirm edit button when first rendered
  document.getElementById("cancel").style.display="none"; //hide cancel button when first rendered
}); 


Template.addAppointment.onCreated(function() {
  
  this.autorun(() => {
    this.subscribe('availability');
    this.subscribe('userInfo');
  });
  this.autorun( () =>  { 
    var isEdit = Session.get('selectedBlockOut');
    if (isEdit != null) {//only executed if someone clicks #edit
      document.getElementById("blockout").style.display="none";
      document.getElementById("confirm").style.display="block";
      document.getElementById("cancel").style.display="block";
     var date = Session.get('selectedBlockOut').date;
    $('#datepicker').data('DateTimePicker').date(date);
    var start = Session.get('selectedBlockOut').start;
    $('#start_time').data('DateTimePicker').date(start);
    var end = Session.get('selectedBlockOut').end;
    $('#end_time').data('DateTimePicker').date(end);
    }
  });
});

Template.addAppointment.helpers({
  disabled: function() {
    if (Meteor.user().submitConfirmation) {
      return 'disabled';
    }
  }
});

Template.addAppointment.events({

  'click #cancel': function() { //when player do not want to edit schedule
    document.getElementById("blockout").style.display="block"; //show blockout button
    document.getElementById("confirm").style.display="none"; //hide confirm edit button
    document.getElementById("cancel").style.display="none"; //hide cancel button
    $('#datepicker').data('DateTimePicker').date(null);
    $('#start_time').data('DateTimePicker').date(null); 
    $('#end_time').data('DateTimePicker').date(null); //set to placeholder value
    Session.set('selectedBlockOut', null);
  },

  'click #availability': function() { //toggle button events
    if ($('#availability').checkbox('is checked')) {
      event.preventDefault();
      $('#start_time').data('DateTimePicker').date(null); 
      $('#end_time').data('DateTimePicker').date(null); 
      //disable timepicker when button is toggled
      $('#start_time').datetimepicker('disable');
      $('#end_time').datetimepicker('disable');
    } else {
      event.preventDefault();
      $('#start_time').datetimepicker('enable');
      $('#end_time').datetimepicker('enable');
    }
  },

  'click #start': function() {
    document.getElementById("message").style.display="block"; //show message when click on time icon
  },


  'submit #add-appointment': function(event) {//this works either when they block out or they confirm edit their schedule
    
    event.preventDefault();
    //get value to be inserted into availability collection
    var selectedDate = event.target.datePicker.value;
    var startTime = event.target.startTime.value;
    var startMoment = moment(startTime, 'hh:mm A');
    console.log(startMoment);
    var endTime = event.target.endTime.value;
    var endMoment = moment(endTime, 'hh:mm A');
    console.log(endMoment);
    console.log(startMoment.isBefore(endMoment));
    $('#datepicker').data('DateTimePicker').date(null);
    $('#start_time').data('DateTimePicker').date(null); 
    $('#end_time').data('DateTimePicker').date(null); //set to placeholder value
  
    if (selectedDate =="" || startTime =="" || endTime =="") {
      if ((!($('#availability').checkbox('is checked')) && (startTime =="" || endTime =="")) || selectedDate =="") {
        Bert.alert('Please fill up all fields!', 'danger');
      }
    }
    
    if (selectedDate != "" && startTime != "" && endTime != "" || selectedDate != "" && $('#availability').checkbox('is checked')) {
      if ($('#availability').checkbox('is checked')) {
        success();
        $('#availability').checkbox('set unchecked');
        $('#start_time').datetimepicker('enable');
        $('#end_time').datetimepicker('enable');
      } else {
        if (startMoment.isBefore(endMoment)) {
          success()    
        } else {
          fail()
        }
      }
    }

     function success() {
      if (Session.get('selectedBlockOut') != null) { //user did click on edit button and they decide to confirm edit 
        var id = Session.get('oldEntry'); 
        console.log(id);
        Meteor.call('blockout.remove',id); //remove the old entry & update with new one
        document.getElementById("blockout").style.display="block";
        document.getElementById("confirm").style.display="none";
        document.getElementById("cancel").style.display="none";
      }


      Meteor.call( 'indicateAvailability', selectedDate, startTime, endTime, (error,response) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Bert.alert( 'Date blocked out', 'success' );
        }
      });
    }

    function fail(){
      Bert.alert('Start Time needs to be before End Time!', 'danger')
    }
  }
});


import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './add-availability.html';
import '/imports/api/availability.js';
import {Availability} from '/imports/api/availability.js'

$('#availability').checkbox();

Template.addAppointment.onRendered( () => {
   $( '#datepicker' ).datetimepicker({
    timeZone: 'SGT',
    minDate: new Date(), //disable past dates and only show date starting from the current date
    format: 'YYYY-MM-DD'
  }); 

  $('#start_time').datetimepicker({
    format: 'hh:mm A',
  });

  $('#end_time').datetimepicker({
    format: 'hh:mm A',
  });
}); 

Template.addAppointment.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
  });
});

Template.addAppointment.events({

'click #availability': function() { //toggle button events
  if ($('#availability').checkbox('is checked')) {
        event.preventDefault();
        $('#start_time').data('DateTimePicker').date(null); //set to placeholder value
        $('#end_time').data('DateTimePicker').date(null); //set to placeholder value
     //disable timepicker when button is toggled
      $('#start_time').datetimepicker('disable');
      $('#end_time').datetimepicker('disable');
    } else {
      event.preventDefault();
      $('#start_time').datetimepicker('enable');
      $('#end_time').datetimepicker('enable');
    }
  },


  'submit #add-appointment': function(event) {
    
       event.preventDefault();
    //get value to be inserted into availability collection
    var selectedDate = event.target.datePicker.value;
    var startTime = event.target.startTime.value;
    var endTime = event.target.endTime.value;

    console.log(selectedDate);
    console.log(startTime);
    console.log(endTime);

    //if all fields empty, present error. 
    if (selectedDate == "" && startTime == "" && endTime == "") {
      Bert.alert('Form is empty!', 'danger')
    }

    //did not choose date
    if (selectedDate == "") {
      Bert.alert('Date not indicated!', 'danger')
    }

    //date and start time not indicated
    if (selectedDate == "" && startTime == "") {
      Bert.alert('Date and Start Time not indicated!', 'danger')
    }

    //date and start time not indicated
    if (selectedDate == "" && endTime == "") {
      Bert.alert('Date and End Time not indicated!', 'danger')
    }

    //did not indicate whole day not free and did not indicate start & end time
    if (startTime == "" && endTime =="" && !($('#availability').checkbox('is checked'))) { 
      Bert.alert('Start and End Time not indicated!', 'danger')
    }

    //call insert method when user inputs all fields or indicate whole day not free
    if (selectedDate != "" && startTime != "" && endTime != "" || selectedDate != "" && $('#availability').checkbox('is checked')) {
      //popup message to let players confirm if they want to block out date
      var confirmBlockDate = confirm("Are you sure you want to block out the date?");
      if (confirmBlockDate == true) { //player confirm want to block out date
        Meteor.call( 'indicateAvailability', selectedDate, startTime, endTime, (error,response) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Date blocked out', 'success' );
            console.log(Availability.find().fetch());
          }
        });

      }
    }
  }
});



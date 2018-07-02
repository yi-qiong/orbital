import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './add-availability.html';
import '../../imports/api/availability.js';

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

Router.route('/availability', {
    template: 'addAppointment'
  });
});

Template.addAppointment.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'availability' );
});

Template.addAppointment.events({

'click #availability': function() { //toggle button events
  if ($('#availability').checkbox('is checked')) {
        event.preventDefault();
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

     //call method to insert into collection
      Meteor.call( 'indicateAvailability', selectedDate, startTime, endTime, (error,response) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Bert.alert( 'Date blocked out', 'success' );
        }
      });
  }
});


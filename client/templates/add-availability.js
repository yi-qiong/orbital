import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './add-availability.html';
import '../../imports/api/availability.js';

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

//when select whole day, disable start time and end time. upon submit button, enable again

Router.route('/availability', {
    template: 'addAppointment'
  });
});

Template.addAppointment.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'availability' );
});

Template.addAppointment.events({
  
  'click .wholeDay': function() {
      
      event.preventDefault();
      $('#start_time').datetimepicker('disable');
      $('#end_time').datetimepicker('disable');
  },


  'submit #add-appointment': function(event) {
    
       event.preventDefault();
       $('#start_time').datetimepicker('enable');
       $('#end_time').datetimepicker('enable');

    var selectedDate = event.target.datePicker.value;
    var startTime = event.target.startTime.value;
    var endTime = event.target.endTime.value;

      Meteor.call( 'indicateAvailability', selectedDate, startTime, endTime, (error,response) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Bert.alert( 'Date blocked out', 'success' );
        }
      });
  }
});


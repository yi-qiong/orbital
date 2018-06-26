import {Meteor} from 'meteor/meteor';
import './add-availability.html';

Template.addAppointment.onRendered( () => { //initialize the datepicker when template rendered on screen 
  $( '.datetimepicker' ).datetimepicker({
    timeZone: 'SGT',
    useCurrent: true, //present the actual current date & time
    minDate: new Date() //disable past dates and only show date starting from the current date
  });

  Router.route('/availability', {
  	template: 'addAppointment'
  });
});

Template.addAppointment.events({
  'submit form' ( event, template ) {
    event.preventDefault();

    let picker   = $( '.datetimepicker' ), //get input 
        dateTime = picker.data( 'DateTimePicker' ).date();

    if ( dateTime ) { //ensure there is a date input
      let appointment = dateTime.format(); //format

      Meteor.call( 'addAppointment', appointment, ( error, response ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          picker.val( '' );
          Bert.alert( 'Date blocked out', 'success' );
        }
      });
    } else {
      Bert.alert( 'Make sure to pick an appointment time!', 'danger' );
    }
  }
});


/*add the insert method that we'll ultimately call from the client to handle inserting our appointments into the database*/

import {Meteor} from 'meteor/meteor';
import {Appointments} from '/imports/api/availability.js';

Meteor.methods({
  indicateAvailability( availability ) {
    check( availability, String ); //appointment equal to string, representing the date and time selected on the client

    try {
      return Availability.insert( { timestamp: availability } );
    } catch( exception ) {
      return exception;
    }
  }
});

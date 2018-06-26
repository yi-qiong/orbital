/*format date and time output to client*/
import {Meteor} from 'meteor/meteor';

Template.registerHelper( 'dateTime', ( timestamp ) => {
  if ( timestamp ) {
    let momentToFormat = moment( timestamp ), //convert timestamp into a moment obj
        date           = momentToFormat.format( 'MMMM Do, YYYY' ), //format date
        time           = momentToFormat.format( 'hh:mm a' ); //format time

    return `${ date } at ${ time }`;
  }
});

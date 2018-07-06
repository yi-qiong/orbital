import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Availability} from '../../imports/api/availability.js'


Template.appointments.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'availability' );
  console.log(Availability.find().fetch());
});

Template.appointments.helpers({
  /*appointments() {
    let appointments = Availability.find();
    if ( appointments ) {
      return appointments;
    }
  }*/
});


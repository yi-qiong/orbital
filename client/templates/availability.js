import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import {Availability} from '/imports/api/availability.js'


Template.appointments.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
  });
});

Template.appointments.helpers({
  appointments() {
    let appointments = Availability.find({owner: Meteor.userId()}).fetch();
    //if ( appointments ) {
      return appointments;
    //}
  }
});

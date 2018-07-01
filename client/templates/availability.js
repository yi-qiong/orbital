import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Availability} from '../../imports/api/availability.js'

Router.route('/availability', {
	template: 'appointments'
});

Template.appointments.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'availability' );
});

Template.appointments.helpers({
  appointments() {
    let appointments = Availability.find();
    if ( appointments ) {
      return appointments;
    }
  }
});

Template.appointments.events({
'click #backbtn': function() {
    Router.go('/sports')
  },
  'click #logout': function() {
  	Meteor.logout();
  	Router.go('/logout')
  }
});

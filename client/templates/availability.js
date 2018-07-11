import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import {Availability} from '/imports/api/availability.js'


Template.appointments.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
  });
});

Template.appointments.events({
  'click #edit': function() {
  //need to present the info in the picker then allow user to change the info
    Session.set('selectedBlockOut',this); //pasing the entire appointment object
    Session.set('oldEntry', this._id); //to allow this entry to be removed when user edit current entry
  },

  'click #delete': function() {
  //delete the data
    Meteor.call('blockout.remove',this._id);
  },
});

Template.appointments.helpers({
  appointments() {
    return Availability.find({owner: Meteor.userId()}).fetch();
	//console.log(appointments);
  },
  string(){
  	if (this.start == "" && this.end =="") {
      return "on " + this.date;
    } else {
      return "on " + this.date + " from " + this.start + " to " + this.end;
    }
  },
});

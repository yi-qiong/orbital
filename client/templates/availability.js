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
    console.log(this);
  },

  'click #delete': function() {
  //delete the data
    Meteor.call('blockout.remove',this._id);
  }
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

//in html: output as a list 
//when i click on an entry, i should be able to edit/delete the entry (use semantic animate button)
//when click on edit button, the entry should reflect back in the datetimepicker
//when click on the delete button, will just remove from the collection

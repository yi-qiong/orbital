import {Template} from 'meteor/templating';
import './confirm.html';
import {Availability} from '/imports/api/availability.js';

Template.confirm.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
    this.subscribe('userInfo');
  });
});


Template.confirm.helpers({
  genderIcon() {
    if (Meteor.user().gender){
      return Meteor.user().gender.toLowerCase();
    }
    return "venus mars";
  },
  gender() {
    return Meteor.user().gender;
  },
  hall(){
  	return Meteor.user().hall;
  },
  teams(){
  	return Meteor.user().teams;
  },
  appointments() {
    return Availability.find({owner: Meteor.userId()}).fetch();
  },
  string(){
  	if (this.start == "" && this.end =="") {
      return "on " + this.date;
    } else {
      return "on " + this.date + " from " + this.start + " to " + this.end;
    }
  },
});


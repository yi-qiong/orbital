import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './actionCell.html';

Template.actionCell.events({
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

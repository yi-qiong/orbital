//server
import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';

Meteor.publish('userInfo', function () {
  return Meteor.users.find(this.userId, {
    fields: {
    submittedTeamForm:1,
    hall:1,
    teams:1
    }
  });
});

Meteor.methods({
  'submitTeamForm' () {
    // Make sure the user is logged in 
    if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }
    var $form = $('.get. form');
    var hall = $form.form('get value', 'hall');
    var gender = $form.form('get value', 'gender');
    var teams = $form.form('get value', 'teams');
    Meteor.users.update(Meteor.userId(), { //update field in user docs
      $set: {
        submittedTeamForm: true,
        hall: hall,
        gender: gender,
        teams: teams,
      }
    });
  },
})
//server
import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';

Meteor.methods({
  'submitTeamForm': function() {
    // Make sure the user is logged in 
    if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }
    if (Meteor.isSimulation){
      console.log("meteor methods simulation");
    }

    if (Meteor.isServer){
      console.log("meteor methods server");
    }
    
    var $form = $('.ui.form');
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

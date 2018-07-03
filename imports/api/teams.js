//server
import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';

Meteor.methods({
  'submitTeamForm'({hall, gender,teams}) {
    // Make sure the user is logged in 
    if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }
    if (this.isSimulation){
      console.log("meteor methods simulation");
    }

    if (this.isServer){
      console.log("meteor methods server");
    }
    
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

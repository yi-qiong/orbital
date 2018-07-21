import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const RegisteredPlayers = new Mongo.Collection('registeredPlayers');

RegisteredPlayers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false                                
});

RegisteredPlayers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


Meteor.methods({
  'insertPlayer' (playerEmail, playerName) {
    // Make sure the user is logged in 
    //if (!Meteor.userId()) {
      //throw new Meteor.Error('logged-out');
    //}
    //if (this.isSimulation){
      //console.log("meteor methods simulation");
    //}
    
    RegisteredPlayers.insert({
      email: playerEmail,
      name: playerName
    })

    console.log(RegisteredPlayers.find().fetch());
  },
});
//}



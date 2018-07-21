 import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.methods({
 registerPlayer(playerEmail, playerName) {
    var newData = {
      username: playerName,
      email: playerEmail
    };
    Accounts.createUser(newData);
  }
});

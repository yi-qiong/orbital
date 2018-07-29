 import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.methods({
 registerPlayer(playerEmail, playerName, playerPassword) {
    var newData = {
      username: playerName,
      email: playerEmail,
      password: playerPassword
    };
    Accounts.createUser(newData);
  },
  registerConvening(conveningEmail, conveningName, conveningPassword) {
    var newData = {
      username: conveningName,
      email: conveningEmail,
      password: conveningPassword,
    };
    Accounts.createUser(newData);
  },

});

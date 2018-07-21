import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './registerPlayer.html';
import '/imports/api/registeredPlayers.js';

//Meteor.subscribe('allUsers');
Template.registerPlayer.onCreated(function() {
  this.autorun(() => {
    this.subscribe('registeredPlayers');
  });
});

Template.registerPlayer.events({

  'submit #players': function(event) {
    event.preventDefault();
    var playerEmail = event.target.email.value + "@u.nus.edu";
    var playerName = event.target.fullName.value;

    if (playerEmail == "" || playerName=="") {
      Bert.alert('Please fill up all fields!', 'danger')
    } else {
        Meteor.call('insertPlayer', playerEmail, playerName, (error, response) => {
          if (error) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert('Player registered!', 'success');
            Meteor.call('registerPlayer', playerEmail, playerName);
            Meteor.call('sendEmail', playerEmail);
          }
        })
      }
    }
});

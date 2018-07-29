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

  'submit #contact-form': function(event) {
    event.preventDefault();
    var playerEmail = event.target.email.value;
    var playerName = event.target.name.value;

        Meteor.call('insertPlayer', playerEmail, playerName, (error, response) => { //store into register player collection to be retrieved upon register player
          if (error) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert('Player registered!', 'success');
            Meteor.call('sendEmail', playerEmail);
          }
        })
    }
});

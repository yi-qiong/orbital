import { Template } from 'meteor/templating';
import './playerLogin.html';
import {RegisteredPlayers} from '/imports/api/registeredPlayers.js';

Router.route('/playerLogin', {
	template: 'playerLogin'
});

Meteor.subscribe('registeredPlayers');

Template.playerLogin.events({
  'click #signUp': function(event) {
    Router.go('/player-register');
  },
  'submit #contact-form': function(event) {
    event.preventDefault();
    var playerEmail = event.target.email.value;
    var playerPassword = event.target.password.value;

    var isRegistered = RegisteredPlayers.findOne({email: playerEmail});
            console.log(isRegistered);
            if (isRegistered == undefined) {
                Bert.alert('Login forbidden!')
            } else {
              Meteor.loginWithPassword(playerEmail, playerPassword, function(error){
      if(error){
        console.log(error.reason);
        Bert.alert('Login forbidden!', 'danger')
      } else {
        Router.go("/playerPage");
      }
    });
    }
  },
});

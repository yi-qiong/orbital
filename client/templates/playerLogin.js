import { Template } from 'meteor/templating';
import './playerLogin.html';

Router.route('/playerLogin', {
	template: 'playerLogin'
});

Template.playerLogin.events({

  'submit #contact-form': function(event) {
    event.preventDefault();
    var playerEmail = event.target.email.value;
    var playerPassword = event.target.password.value;

    Meteor.loginWithPassword(playerEmail, playerPassword, function(error){
      if(error){
        console.log(error.reason);
        Bert.alert('Login forbidden!', 'danger')
      } else {
        Router.go("/playerPage");
      }
    });
  },
});

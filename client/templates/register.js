import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './register.html';
import {RegisteredPlayers} from '/imports/api/registeredPlayers.js';
import {RegisteredConvening} from '/imports/api/registeredConvening.js';

Router.route('/player-register', {
    template: 'register'
});

Meteor.subscribe('registeredPlayers');
Meteor.subscribe('registeredConvening');

Template.register.events({
    'submit #contact-form': function(e, t) {
        e.preventDefault();
        // Retrieve the input field values
        var playerEmail = e.target.email.value;
        var password = e.target.password.value;
        var passwordAgain = e.target.confirm_password.value; 

            console.log(password);
            console.log(passwordAgain);

            if (password != passwordAgain) {
                Bert.alert('Password do not match!', 'danger');
            } else {
                    var isRegistered = RegisteredPlayers.findOne({email: playerEmail});
            console.log(isRegistered);
            if (isRegistered == undefined) {
                Bert.alert('Registration denied: You are not registered as an IHG Player', 'danger')
            } else {
                var fullName = isRegistered.name;
                console.log(fullName);
                var isConvening = RegisteredConvening.findOne({email: playerEmail});;
                console.log(isConvening);
                if (isConvening != undefined) { //player also convening so cannot create another user account
                  Meteor.loginWithPassword(playerEmail, password, function(error) {
                    if(error){
                                console.log(error.reason);
                            } else {
                                Router.go("/playerPage");
                            }
                        });
                } else {
                    Meteor.call('registerPlayer', playerEmail, fullName, password, function(error) {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        Meteor.loginWithPassword(playerEmail, password, function(error){
                            if(error){
                                console.log(error.reason);
                            } else {
                                Router.go("/playerPage");
                            }
                        });
                    }
                })
                } 
                
            }
        }
            }
});

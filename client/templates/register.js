import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './register.html';
import {RegisteredPlayers} from '/imports/api/registeredPlayers.js';

Router.route('/player-register', {
    template: 'register'
});

Meteor.subscribe('registeredPlayers');

Template.register.events({
    'click #register-button': function(e, t) {
        e.preventDefault();
        // Retrieve the input field values
        var playerEmail = $('#email').val() + "@u.nus.edu", 
            fullName = $('#name').val(),
            password = $('#password').val(),
            passwordAgain = $('#password-again').val();

        // Check password is at least 6 chars long
        var isValidPassword = function(password, passwordAgain) {
            if (password === passwordAgain) {
                return password.length >= 6 ? true : false;
            } else {
                Bert.alert('Passwords do not match, Please Try again!', 'danger');
            }
        }

        
        if (isValidPassword) { 
            var isRegistered = RegisteredPlayers.findOne({email: playerEmail});
            if (isRegistered == undefined) {
                Bert.alert('Registration denied: You are not registered as an IHG Player', 'danger')
            } else {
                Meteor.call('registerPlayer', playerEmail, fullName, password, function(error) {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        Bert.alert('You are registered!', 'success')
                        Meteor.loginWithPassword(playerEmail, password, function(error){
                            if(error){
                                console.log(error.reason);
                            } else {
                                Router.go("/playerPage");
                                console.log(Meteor.user());
                            }
                        });
                    }
                })
            }
        }
    }
});

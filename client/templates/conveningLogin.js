import { Template } from 'meteor/templating';
import './conveningLogin.html';
import '/imports/api/registeredConvening.js';

//Meteor.subscribe('allUsers');
Template.conveningLogin.onCreated(function() {
  this.autorun(() => {
    this.subscribe('registeredConvening');
  });
});


Router.route('/conveningLogin', {
	template: 'conveningLogin'
});

Template.conveningLogin.events({

  'click #login-form-link': function(event) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    event.preventDefault();
  },

  'click #register-form-link': function(event) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    event.preventDefault();
  },

  'submit #login-form': function(event) {
    event.preventDefault();
    var conveningEmail = event.target.loginEmail.value;
    var conveningPassword = event.target.loginPassword.value;

    Meteor.loginWithPassword(conveningEmail, conveningPassword, function(error){
      if(error){
        console.log(error.reason);
        Bert.alert('Login forbidden!', 'danger')
      } else {
        Router.go("/scheduling");
      }
    });
  },

  'submit #register-form': function(event) {
    event.preventDefault();
    var conveningName = event.target.registerName.value;
    var conveningEmail = event.target.registerEmail.value;
    var conveningPassword = event.target.registerPassword.value;
    console.log(conveningPassword);
    var commonPassword = event.target.convening_password.value;
    console.log(commonPassword);

    if (commonPassword != "4-c0nVen1nG-0nLY") {
      Bert.alert('You have entered a wrong password!', 'danger')
    } else {
      Meteor.call('insertConvening', conveningEmail, conveningName, (error, response) => { //store into register convening collection to be retrieved upon register player
          if (error) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      Meteor.call('registerConvening', conveningEmail, conveningName, conveningPassword, function(error) {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        Meteor.loginWithPassword(conveningEmail, conveningPassword, function(error){
                            if(error){
                                console.log(error.reason);
                            } else {
                              console.log(Meteor.user());
                                Router.go("/scheduling");
                            }
                        });
                    }
                })
    }
  },
});

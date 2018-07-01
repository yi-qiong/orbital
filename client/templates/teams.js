import {Template} from 'meteor/templating';
import './teams.html';

////////////////////////////////////////////////// form
$('.ui.dropdown')
  .dropdown()
;//initialise dropdown


$('.ui.form')
  .form({
    fields : {
      hall:'empty',
      gender: 'empty',
      teams: 'empty'
    },
    inline : true,
  }) //validation rules: all fields cannot be empty
;

Tracker.autorun(function () {
    Meteor.subscribe("userInfo");
});

Template.teams.onCreated(function() {
  this.disabled = new ReactiveVar("disabled"); //havent chose gender
  this.isFemale = new ReactiveVar(false);
});

Template.teams.helpers({
  submitted: function() {
    return Meteor.user().submittedTeamForm; // METEOR PUBLISH NEEDED AND SUBSCRIBE
  },
  disabled: function(){
    return Template.instance().disabled.get(); //ensure chose gender first
  },
  isFemale: function() {
    //console.log(Template.instance().isFemale.get());
    return Template.instance().isFemale.get();
  }
})



Template.teams.events({
  'submit form': function(event, template) {
    event.preventDefault();
    if(Meteor.user()){//if logged in
      $('.ui.form').form('validate form');
      if( $('.ui.form').form('is valid')) {
        Meteor.call("submitTeamForm", function (error) {
          if (error && error.error === "logged-out") {
            // show a nice error message
            Session.set("errorMessage", "Please log in before submitting your details.");
          }
        });
      }
    }  
  },
  'change #gender':function(event, template){
    var gender = $('.ui.form').form('get value', 'gender');
    //console.log(gender); // male/female
    if (gender ==="female"){
      template.isFemale.set(true); 
    }else {
      template.isFemale.set(false);
    }
    template.disabled.set(""); //unlock teams field
  },
  
  'click #teams': function(event, template) { 
    if (disabled){
      Session.set("errorMessage", "Please indicate your gender first.");
    }
   }
})

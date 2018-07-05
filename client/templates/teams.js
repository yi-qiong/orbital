import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import './teams.html';
import '/imports/api/teams.js';

Template.teams.onCreated(function() {
  this.disabled = new ReactiveVar("disabled"); //havent chose gender
  this.isFemale = new ReactiveVar(false);
});

Tracker.autorun(function () {
    Meteor.subscribe("userInfo");
});

Template.teams.rendered = function() {
  // be sure to use this.$ so it is scoped to the template instead of to the window
  this.$('.ui.dropdown').dropdown({on: 'hover'});
  this.$('.ui.form')
  .form({
    fields: {
      hall: {
        rules: [{
          type: 'empty',
          prompt: 'Please select a hall'
        }]
      },
      gender: {
        rules: [{
          type: 'empty',
          prompt: 'Please select a gender'
        }]
      },
      teams: {
        rules: [{
          type: 'empty',
          prompt: 'Please select at least one team'
        }]
      }
    }, 
    inline : true,
    onSuccess: function(event, fields){
      event.preventDefault();
      var $form = $('.ui.form');
      var hall = $form.form('get value', 'hall');
      var gender = $form.form('get value', 'gender');
      var teams = $form.form('get value', 'teams');
      Meteor.call('submitTeamForm', {
        hall: hall,
        gender: gender,
        teams: teams,
      }, function (error) {
          console.log("meteor.call working");
          if (error && error.error === "logged-out") {
            // show a nice error message
            Session.set("errorMessage", "Please log in before submitting your details.");
          } 
      });
      
    }
  })//validation rules: all fields cannot be empty 
  // other SUI modules initialization
};


Template.teams.helpers({
  submitted: function() {
    if (Meteor.user().submittedTeamForm){
      return "disabled";
    }// METEOR PUBLISH NEEDED AND SUBSCRIBE
  },
  disabled: function(){
    return Template.instance().disabled.get(); //ensure chose gender first
  },
  isFemale: function() {
    //console.log(Template.instance().isFemale.get());
    return Template.instance().isFemale.get();
  },
  hall(){
    if (Meteor.user().submittedTeamForm){
      return Meteor.user().hall;
    } else {
      return "Hall of Residence";
    }
  },
  gender(){
    if (Meteor.user().submittedTeamForm){
      return Meteor.user().gender;
    } else {
      return "Gender";
    }
  },
  teams(){
    if (Meteor.user().submittedTeamForm){
      return Meteor.user().teams;
    } else {
      return "Select Teams";
    }
  },
  hidden(){
    if (! Meteor.user().submittedTeamForm){
      return "hidden";
    }
  }
})



Template.teams.events({
  'change #gender':function(event, template){
    var gender = $('.ui.form').form('get value', 'gender'); 
    if (gender === "Female"){
      template.isFemale.set(true); 
    }else {
      template.isFemale.set(false);
    }
    template.disabled.set(""); //unlock teams field
    //console.log(template.disabled.get());
  },

 
  'click #teams': function(event, template) { 
    if (template.disabled.get()=== "disabled"){
      $('.ui.form').form('validate field','gender'); //prompt 
    }
   }
})
 
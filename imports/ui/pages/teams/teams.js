import {Template} from 'meteor/templating';

import './teams.html';

Template.body.onCreated(function() {
  Template.currentTab = new ReactiveVar("teams"); //new attribute created and ref
});

Template.body.helpers({
  tab: function() {
    console.log(Template.currentTab.get()); //getter method for current active tab
    return Template.currentTab.get();
  },
});


Template.body.events({
  'click .teams': function(event, template) {
    $('.availability').removeClass('active');
    $('.teams').addClass('active');
    Template.currentTab.set("teams");
  },
  'click .availability': function(event, template) {
    $('.teams').removeClass('active');
    $('.availability').addClass('active');
    Template.currentTab.set("availability");
  },

})
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
  var disabled = new ReactiveVar("disabled"); //havent chose gender
});

Template.teams.helpers({
  submitted: function() {
    return Meteor.user().submittedTeamForm; // METEOR PUBLISH NEEDED AND SUBSCRIBE
  },
  disabled: function(){
    return disabled; //ensure chose gender first
  },
  isFemale: function() {
    if (gender.equals("female")) {
      return true;
    }else{
      return false;
    }
  }
})



Template.teams.events({
  'submit form': function(event, instance) {
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
  'change #gender':function(event, instance){
    var gender = $('.get.form').form('get value', 'gender'); 
    disabled.set(""); //unlock teams field
  },
  
  'click #teams': function(event, instance) { 
    if (disabled){
      Session.set("errorMessage", "Please indicate your gender first.");
    }
   }
})

Template.teams.events({
	'click .button':function(event, instance){
 		Meteor.call("submitTeamForm", function (error) {
      if (error && error.error === "logged-out") {
        // show a nice error message
        Session.set("errorMessage", "Please log in before submitting your details.");
      }
    });
  },
  //$('.dropdown').change(function () {
    //var gender = this.value; //get the choosen input from the gender field !! undone 
  //}),
  'click .dropdown':function(event, instance){ //put for teams field only !! undone
    var gender = $('.get.form').form('get value', 'gender');
    if (gender == null){
      Session.set("errorMessage", "Please indicate your gender first.");
    }

})

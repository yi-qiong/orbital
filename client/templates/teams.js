import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import './teams.html';
import '/imports/api/teams.js';

Template.teams.onCreated(function() {
  this.disabled = new ReactiveVar("disabled"); //havent chose gender
  this.isFemale = new ReactiveVar(null); //null until gender field is changed
  this.editMode = new ReactiveVar (false);
});

Tracker.autorun(function () {
    Meteor.subscribe("userInfo");
});

Template.teams.rendered = function() { //behaviour after template is loaded
  // be sure to use this.$ so it is scoped to the template instead of to the window
  this.$('.ui.dropdown').dropdown();
  if (Meteor.user().hall){ //dummy value for checking if form has been submitted before
    console.log("write values");
    this.$('.ui.form')
    // set as saved values once template is rendered
      .form('set values', {
        hall     : Meteor.user().hall,
        gender   : Meteor.user().gender,
        teams    : Meteor.user().teams,
      })
    ;
  }
  this.$('.ui.form') //validate
    .form({
       fields: {
         hall     : 'empty',
         gender   : 'empty',
         teams    : 'empty',
       },
    onSuccess: function(event, fields){
      event.preventDefault();
      Bert.alert( 'Form saved successfully', 'success' );
      var $form = $('.ui.form');
      var hall = $form.form('get value', 'hall');
      var gender = $form.form('get value', 'gender');
      var teams = $form.form('get value', 'teams');
      Meteor.call('saveTeamForm', {
        hall: hall,
        gender: gender,
        teams: teams,
      }, function (error) {
          console.log("form is saved");
          if (error && error.error === "logged-out") {
            // show a nice error message
            Session.set("errorMessage", "Please log in before submitting your details.");
          } 
      });   
    }
  });
};


Template.teams.helpers({
  submitted: function() {
    if (Meteor.user().teams){ // if saved form before
      if (Meteor.user().submitConfirmation || !Template.instance().editMode.get()){ 
      //submitted confirmation or not in edit mode
        return "disabled";
      }
    }
    // if nvr saved form before, auto will be in edit mode
  },
  disabled: function(){ 
    if (!Meteor.user().teams){ //if havent saved form before. 
      return Template.instance().disabled.get(); //ensure chose gender first
    }
  },
  isFemale: function() {
    //console.log(Template.instance().isFemale.get());
    if (Template.instance().isFemale.get()===null ){ //user hasnt chose gender in this session
      if(Meteor.user().gender === "Female"){ //if form is saved before
        return true;
      }else { 
        return false;
      }
    } else { //user changed gender field in this session before, regardless of whether form is saved before
      return Template.instance().isFemale.get(); 
    }
  },

  editMode(){
    console.log(!Meteor.user().hall);
    if(!Meteor.user().hall){
      return true;
    }else {
      return Template.instance().editMode.get();
    }
  }
})



Template.teams.events({
  'change #gender':function(event, template){
    $('.teams').dropdown('clear'); //if change gender, the teams field will be cleared 
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
    if (!Meteor.user().teams){ //if havent saved form before 
      if (template.disabled.get()=== "disabled"){
        Bert.alert('Please indicate your gender first!', 'warning')
      }
    }
  },

  'click .edit': function(event,template){
    template.editMode.set(true);
  },

  'click .submit':function(event,template){
    
    var $form = $('.ui.form');
    var hall = $form.form('get value', 'hall');
    var gender = $form.form('get value', 'gender');
    var teams = $form.form('get value', 'teams');
    if (hall =="" || gender =="" || teams==""){ //tgt with error from semantic 
      Bert.alert('Please fill up all fields!', 'danger')
    }else {
      template.editMode.set(false); //only change onSuccess 
    }
    
  },
})
 
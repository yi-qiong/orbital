import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import './teams.html';
import '/lib/formMethods.js';


////////////////////////////////////////////////// form
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
      Meteor.call("submitTeamForm", function (error) {
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


Tracker.autorun(function () {
    Meteor.subscribe("userInfo");
});


Template.teams.onCreated(function() {
  this.disabled = new ReactiveVar("disabled"); //havent chose gender
  this.isFemale = new ReactiveVar(false);


});

Template.teams.helpers({
  submitted: function() {
    console.log(Meteor.user().submittedTeamForm);
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
  'change #gender':function(event, template){
    var gender = $('.ui.form').form('get value', 'gender');
    //console.log(gender); // male/female
    if (gender ==="female"){
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

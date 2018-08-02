import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import './calendar-modal.html';
import '/imports/api/matches.js'; //meteor methods

Template.calendarModal.rendered= function() {
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.checkbox').checkbox();
  
  console.log(Session.get('isEditMode'));
  if (Session.equals ('isEditMode', true)){
    console.log("write values");
    var event =  Session.get('currentEditEvent');

    this.$('.ui.form')
    // set as saved values once template is rendered
      .form('set values', {
        sport   : event.sport,
        round   : event.round,
        halls   : event.halls,
      })
    ;
  }

  this.$('.ui.form') //validate
    .form({
      fields: {
        sport    : 'empty',
        round    : 'empty',
        halls    : 'minCount[2]',
      },
      onSubmit:function(event){
       event.preventDefault();
      },
      onSuccess: function(event, fields){
        event.preventDefault();
        $('.ui.modal').modal('hide'); //only hide when all fields are valid
        Bert.alert( 'Match added successfully', 'success' );
        var $form = $('.ui.form');
        var sport = $form.form('get value', 'sport');
        var round = $form.form('get value', 'round');
        var halls = $form.form('get value', 'halls');
        if (Session.equals ('isEditMode', true)){
          Meteor.call('updateMatch',{
            sport: sport,
            round: round,
            halls: halls,
          });
        } else {
          Meteor.call('createMatch', {
            sport: sport,
            round: round,
            halls: halls,
          }, function (error) {
            if (error && error.error === "logged-out") {
              // show a nice error message
              Session.set("errorMessage", "Please log in before submitting your details.");
            } 
          });
        }   
       }
    });
};

Template.calendarModal.events({
'click #close' : function(event, template){
    console.log("close");
    $('.ui.form').form('clear'); //clear form before closing modal
    $('.ui.modal').modal('hide');
}
})





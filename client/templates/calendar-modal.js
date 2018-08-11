import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import './calendar-modal.html';
import '/imports/api/matches.js'; //meteor methods

Template.calendarModal.rendered= function() {
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.checkbox').checkbox();
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
        var $form = $('.ui.form');
        var sport = $form.form('get value', 'sport');
        var round = $form.form('get value', 'round');
        var halls = $form.form('get value', 'halls');
        if(!Session.equals('currentEditEvent',null)){
          
          Meteor.call('updateMatch', Session.get('currentEditEvent'),sport,round,halls, function (error) {
            if (error) {
              // show a nice error message
              Bert.alert('error', 'danger');
            }else{
              Bert.alert( 'Match updated successfully', 'success' );
            } 
          });
        } else {
          var currentDate = Session.get('currentDate'); //'YYYY-MM-DDThh:mm:ss'
          Meteor.call('createMatch', sport, round, halls, currentDate , function (error) {
            if (error) {
              // show a nice error message
              Bert.alert('error', 'danger');
            }else{
              Bert.alert( 'Match added successfully', 'success' );
            } 
          });
           
        }
        $('.ui.form').form('clear');
      }
    });
  $('.ui.form').form('reset');

};

Template.calendarModal.events({
'click #close' : function(event, template){
    console.log("close");
    $('.ui.form').form('clear'); //clear form before closing modal
    $('.ui.modal').modal('hide');
}
})

Template.editCalendar.events({
  'click #edit': function(e, t) {
    $('.ui.form').form('reset');
    $('.ui.form')
    // set as saved values once template is rendered
     .form('set values', {
      sport   : Session.get("eventInfo").sport,
      round   : Session.get("eventInfo").round,
      halls   : Session.get("eventInfo").halls
      })
    ;
  }
})





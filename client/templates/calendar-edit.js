import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './calendar-edit.html';
import '/imports/api/matches.js';
import {Matches} from '/imports/api/matches.js';
import {Availability} from '/imports/api/availability.js';
import moment from 'moment';


Template.editCalendar.onCreated(function() {
  $('body .modals').remove();
  this.autorun(() => {
    this.subscribe('matches');
    this.subscribe('availability');
  });
  Session.set ('currentEditEvent', null);
});



Template.editCalendar.rendered = function() {

  var calendar = $('#calendar').fullCalendar({
    height:"auto",
    //overall
    defaultView: 'agendaWeek',
    header: {
      left:   'list,agendaWeek,month',
      center: 'title',
      right:  'prev,today,next'
    },
  
  //all time based settings
    minTime: '08:00',
    maxTime:'22:00',
    slotDuration: '00:30:00', // 30 mins slots 
    editable: false,
    dragScroll: false,
    allDaySlot : false,
    //events
    eventSources: [
      { //matches
      events: function( start, end, timezone, callback ) {
          callback(Matches.find({}).fetch());
        },
        color: '#0B7A75',
        id: 'matches'
      }
    ],
    //functions
    eventRender: function( event, element, view ) {  //render popup when creating event, will popup during hover
      if (event.source.id =='matches'){
        $(element).attr('data-html', "<b>" + event.title + "</b>  <br>" + event.description); 
        $(element).attr('data-variation', "inverted small");
        $(element).popup();
      }
    },


    eventAllow: function(dropLocation, draggedEvent) {
      return dropLocation.start.hour()>= 8 && (dropLocation.end.hour()<22 || (dropLocation.end.hour()==22 && dropLocation.end.minutes()==0)); 
    },
    
    dayClick: function(date, jsEvent, view) {
      var eventId = Session.get("currentEditEvent");
      var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
      if (jsEvent.target.classList.contains('fc-bgevent')) { //is eventMode && click on available slots
        var duration = moment.duration(moment(event.end).diff(moment(event.start)));
        var end = moment(date).add(duration);
        event.start = date.format();
        event.end= end.format();
        $('#calendar').fullCalendar('updateEvent', event);
      } else { //close eventMode 
        event.editable = false;
        $('#calendar').fullCalendar('updateEvent', event);
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
        var start = event.start.format(); //'YYYY-MM-DDThh:mm:ss'
        var end = event.end.format();
        Meteor.call('moveMatch',event._id, start, end );
      }
    },

    eventClick: function(calEvent, jsEvent, view) {
      Session.set("eventInfo",{ //for writing in modal
        sport: calEvent.sport,
        round: calEvent.round,
        halls: calEvent.halls
      });
      
      if(calEvent._id == Session.get("currentEditEvent")){ //click back on the same event to close eventMode
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
        //close side bar event menu
        calEvent.editable = false;
        $('#calendar').fullCalendar('updateEvent', calEvent);
        var start = calEvent.start.format(); //'YYYY-MM-DDThh:mm:ss'
        var end = calEvent.end.format();
        Meteor.call('moveMatch',calEvent._id, start, end );
      } else if (!Session.equals('currentEditEvent',null)) { //click on another event while in eventMode
        Session.set('prevEditEvent', Session.get('currentEditEvent'));
        Session.set('currentEditEvent',calEvent._id);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots'); //remove current available slots
        $('#calendar').fullCalendar('addEventSource', { //add current available slots
          id: 'available slots' ,
          events: [
            {
              dow: [1,2,3,4,5], 
              start  : '8:00',
              end : '18:00'           
            },
            calEvent.blockOuts
          ],
          rendering: 'inverse-background', //so it shows the available slots instead
          overlap: false, //cannot drag or resize matches onto blockouts
          color: '#d5e1df'
        });
        var eventId =Session.get('prevEditEvent');
        var prevEvent = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
        prevEvent.editable = false;
        $('#calendar').fullCalendar('updateEvent', prevEvent);
        var start = prevEvent.start.format(); //'YYYY-MM-DDThh:mm:ss'
        var end = prevEvent.end.format();
        Meteor.call('moveMatch', prevEvent._id, start, end );
        calEvent.editable = true;
        $('#calendar').fullCalendar('updateEvent', calEvent);
      } else { //open new event      
        Session.set('currentEditEvent',calEvent._id);
        $('#calendar').fullCalendar('addEventSource', { //add current available slots
          id: 'available slots' ,
          events: [
            {
              dow: [1,2,3,4,5], 
              start  : '8:00',
              end : '18:00'           
            },
            calEvent.blockOuts
          ],
          rendering: 'inverse-background', //so it shows the available slots instead
          overlap: false, //cannot drag or resize matches onto blockouts
          color: '#d5e1df'
        });
        calEvent.editable = true;
        $('#calendar').fullCalendar('updateEvent', calEvent);
      }
    }
  }).data().fullCalendar;

  Tracker.autorun(function(){
    allReqsCursor = Matches.find().fetch();
    if(calendar){
      calendar.refetchEvents();
    }
  });


  this.$('.ui.modal').modal({
    inverted: true,
     autofocus: false,
     onApprove : function() {
      //probably wont execute since nvr include <actions>
    }
  });
}; 






Template.editCalendar.events({
  /*'click .' :function(e,t){
    if(!$(e.target).closest('#calendar').length&&!$(e.target).closest('#edit')&&!$(e.target).closest('#delete')) {
      var eventId = Session.get("currentEditEvent");
      var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
      event.editable = false;
      event.draggable = false;
      $('#calendar').fullCalendar('updateEvent', event);
      Session.set('currentEditEvent',null);
      $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
      $('#eventActions').transition('hide');
    }
  },*/
  'click #edit': function(e, t) {
    $('.ui.modal').modal('show'); //modal appears
    $(this).blur(); //prevent button focus
    $('form').form('reset');
  },
  'click #delete': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
    $("#calendar").fullCalendar('removeEvents', remove(event));
    function remove(event){
      return true;
    }
    Meteor.call('deleteMatch', eventId , function (error) {
      if (error) {
      // show a nice error message
        Bert.alert('error', 'danger');
      }else{
        Bert.alert( 'Match deleted', 'success' );
      } 
    });
    $(this).blur(); //prevent button focus
    Session.set('currentEditEvent',null);
    $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
    //close side bar event menu
  },
  'click #add': function(e, t) {
    Session.set("currentDate", $('#calendar').fullCalendar('getDate').format()); //'YYYY-MM-DDThh:mm:ss' 
    $('.ui.modal').modal('show'); //modal appears
    $(this).blur(); //prevent button focus
  }, 
});
  /*  

function showAvailableSlots(event){
    console.log(event);
    $('#calendar').fullCalendar('addEventSource' ,{
        //event source object 
        id: 'available slots' ,   
        events: function(start, end, timezone, callback) {
          console.log(event);
          callback(Availability.find
            ({
              start: {$gte: start},
              end : {$lte:end},
              owner : {$in: event.users}
            })
          .fetch()); //finally get the blockouts
        },
        rendering: 'inverse-background',   // inverse, so instead of showing block outs, it shows the available slots
        color: 'ff8e8e',
    });  
}

*/
Template.editCalendar.helpers({
  eventMode: function(){
    if(Session.get('currentEditEvent') === null){
      return false;
    }
    return true;
  }
});

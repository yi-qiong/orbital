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
    draggable: false,
    //events
    eventSources: [
    { //sch hours
      events: [ 
        {
          title: 'School Hours',
          dow: [1,2,3,4,5], 
          start  : '8:00',
          end : '18:00',
          rendering: 'background',
          editable: false,
          color: '#d5e1df',
          overlap: false
        }
      ]
    },
    { //matches
      events: function( start, end, timezone, callback ) {
        callback(Matches.find({}).fetch());
      },
      color: '#59a27a',
      id: 'matches'
    }
    ],
    //functions
    eventRender: function( event, element, view ) {  //render popup when creating event, will popup during hover
      if (event.source.id =='matches'){
        $(element).attr('data-html', "<b>" + event.title + "</b>  <br>" + event.description); 
        $(element).attr('data-variation', "inverted small");
        $(element).popup()
;
      }
    },
    
    dayClick: function(date, jsEvent, view) {
      Session.set("currentDate", date.format()); //'YYYY-MM-DDThh:mm:ss'
      $('.ui.modal').modal('show');
    },

    eventClick: function(calEvent, jsEvent, view) {
      Session.set("eventInfo",{ //for writing in modal
        sport: calEvent.sport,
        round: calEvent.round,
        halls: calEvent.halls
      });
      console.log('clicked');
      if(calEvent._id == Session.get("currentEditEvent")){ //click back on the same event to close eventMode
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
        //close side bar event menu
        $('#eventActions').transition('hide');
        calEvent.editable = false;
        calEvent.draggable = false;
        $('#calendar').fullCalendar('updateEvent', calEvent);
      } else { //click on another event OR open new event
        $('#eventActions').transition('show');
        Session.set('prevEditEvent', Session.get('currentEditEvent'));
        Session.set('currentEditEvent',calEvent._id);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots'); //remove current available slots
        $('#calendar').fullCalendar('addEventSource' ,{ //add current available slots
          id: 'available slots' ,
          events: calEvent.blockOuts, //array
          rendering: 'inverse-background', //so it shows the available slots instead
          overlap: false, //cannot drag or resize matches onto blockouts
          color: 'yellow'
        })
        var eventId =Session.get('prevEditEvent');
        var prevEvent = $("#calendar").fullCalendar( 'clientEvents', eventId );
        prevEvent.editable = false;
        prevEvent.draggable = false;
        $('#calendar').fullCalendar('updateEvent', prevEvent);
        calEvent.editable = true;
        calEvent.draggable = true;
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
  'click #edit': function(e, t) {
    $('.ui.modal').modal('show'); //modal appears
    $(this).blur(); //prevent button focus
  },
  'click #delete': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId );
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
    $('#eventActions').transition('hide');
  }
  /*'click #view': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId );
    $(this).blur(); //prevent button focus
  }*/
    
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

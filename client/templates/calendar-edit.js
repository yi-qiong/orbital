import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './calendar-edit.html';
import '/imports/api/matches.js';
import {Matches} from '/imports/api/matches.js';
import {Availability} from '/imports/api/availability.js';
import moment from 'moment';


Template.editCalendar.onCreated(function() {
  this.autorun(() => {
    this.subscribe('matches');
    this.subscribe('availability');
  });
  Session.set ('isEditMode', false);
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
    nowIndicator:true,
    editable: true,
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
        console.log(Matches.find({}).fetch());
        callback(Matches.find({}).fetch());
      },
      color: '#59a27a',
      id: 'matches'
    }
    ],



    //functions
    eventRender: function( event, element, view ) {  //render popup when creating event, will popup during hover
      if (event.source.id =='matches'){
        $(element).attr('data-tooltip', "<b>" + event.title + "</b>  <br>" + event.description); 
        $(element).attr('data-inverted', ""); 
      }
    },
    /*eventMouseover: function( event, jsEvent, view ) {
      console.log(event);
      if(!Session.equals ('isEditMode', true)){
        Session.set('currentEditEvent',event._id);
        console.log("mouseover");
      }
    },*/
 
    eventClick: function(calEvent, jsEvent, view) {
      console.log('clicked');
      if(!Session.equals ('isEditMode', true)){ //open Edit Mode
        Session.set ('isEditMode', true);
        Session.set('currentEditEvent', {
          sport : calEvent.sport,
          round : calEvent.round,
          halls : calEvent.halls 
        }); //for modal
        
        //showAvailableSlots(calEvent);

        $('#calendar').fullCalendar('addEventSource' ,{
          id: 'available slots' ,
          events: [
            {
              title: 'Event1',
              start: '2018-07-27'
            }           
          ],
          color: 'yellow',   // an option!
          textColor: 'black' // an option!
        });
      } else { //close Edit Mode
        Session.set ('isEditMode', false);
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
      }
      console.log(Session.get ('isEditMode'));
    }
  }).data().fullCalendar;
    
  Tracker.autorun(function(){
    allReqsCursor = Matches.find().fetch();
    if(calendar){
      calendar.refetchEvents();
    }
  });
}; 






Template.editCalendar.events({
  'mousedown .fc-event'(e, t) {
    console.log("mousedown");
    var eventId =  Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId)[0];
  }
    
});
  /*  showAvailableSlots(event);  //function
  },
  'mouseup .fc-event'(e, t) {
    $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
  },
  'click '(e,t) {
    console.log("e.target");
    Session.set ('editMode', true);
    console.log(Session.get ('editMode'));
    template.$('#cal').fullCalendar('refetchEvents');
  }
})


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




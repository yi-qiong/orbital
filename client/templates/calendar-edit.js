import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './calendar-edit.html';
import '/imports/api/matches.js';
import {Matches} from '/imports/api/matches.js';
import {Availability} from '/imports/api/availability.js';
import moment from 'moment';


Template.edit.onCreated(function() {
  this.autorun(() => {
    this.subscribe('matches');
    this.subscribe('availability');
  });
});


Template.edit.onRendered(() => {
  /*$('.fc-event')
  .popup({
    popup : $('.ui.popup'),
    on: 'click' //so that it is closed when clicks outside of popup
  });*/

  calendar = $('#calendar').fullCalendar({
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
    { 
      events: [ 
        {
          title: 'School Hours',
          dow: [1,2,3,4,5], 
          start  : '8:00',
          end : '18:00',
          rendering: 'background',
          editable: false,
          color: '#d5e1df'
        }
      ]
    },
    { //matches
      events: function( start, end, timezone, callback ) { 
        console.log(Matches.find({} ).fetch());
        callback(Matches.find({}).fetch());
      },
      color: '#59a27a'
    }
    ],

    //functions
    eventDragStart: function( event, jsEvent, ui, view ) {
      //render new events of available slots
      $('#calendar').fullCalendar('addEventSource' ,{
        //event source object 
        id: 'available slots' ,   
        events: function(start, end, timezone, callback) {
          var users = [];//empty array
          var cursor = Meteor.users.find({
            //event.halls is an array of halls involved in this match
            hall: {$in:event.halls}, //check if user's hall is in the array 
            teams: event.sport //searches for all users whose teams array include the given sport
          });
          cursor.forEach(function(user) {
            users.push(user._id);
          }); //add each of the users' ID into [users] array
          callback(Availability.find
            ({
              start: {$gte: start},
              end : {$lte:end},
              owner : {$in: users}
            })
          .fetch()); //finally get the blockouts
        },
        rendering: 'inverse-background',   // inverse, so instead of showing block outs, it shows the available slots
        color: 'ff8e8e',
      });
    },

    eventDragStop: function( event, jsEvent, ui, view ) {
      $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
    },
  
    eventClick: function(calEvent, jsEvent, view) {
      //console.log($(this));
      $(this).popup('show'); //show edit and delete popup
      //Session.set('currentEditEvent',calEvent);
    }
  }).data().fullCalendar;

  Tracker.autorun(function () {
    allReqsCursor = Matches.find().fetch();
    console.log("Autorun -> ", allReqsCursor.length);
    if(calendar){
        calendar.refetchEvents();
    }
  });

});








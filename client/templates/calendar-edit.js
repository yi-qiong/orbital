import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import $ from 'jquery';
import 'fullcalendar';
import './calendar-edit.html';
import '/imports/api/matches.js';
import {Matches} from '/imports/api/matches.js';
import {Availability} from '/imports/api/availability.js';
import {Clashes} from '/imports/api/clashes.js';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);


Template.editCalendar.onCreated(function() {
  $('body .modals').remove();
  this.autorun(() => {
    this.subscribe('matches');
    this.subscribe('availability');
  });
  Session.set ('currentEditEvent', null);
  this.subscribe('clashes');
});



Template.editCalendar.onRendered (function () {
  var calendar = $('#calendar').fullCalendar({
    height:"auto",
    //overall
    defaultView: 'agendaWeek',
    header: {
      left: 'title',
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
        element.attr('data-html', "<b>" + event.title + "</b>  <br>" + event.description); 
        element.attr('data-variation', "inverted small");
        element.popup();
      }
    },

    /*eventOverlap: function(stillEvent, movingEvent) {  //overlapping in or out upon drag or resize
      console.log("event overlap");
      console.log(stillEvent.start.format());
      console.log(movingEvent.start.format());
      return true;
    },*/ 

    eventDrop: function(event, delta, revertFunc) {
      //remove all the conflicts that has the event inside
      Meteor.call('removeClash', event._id);
      var start = moment(event.start);
      var end = moment(event.end);
      var range1 = moment.range(start,end); //dropping event
      var overlapEvents = $('#calendar').fullCalendar('clientEvents', function(evt) {
        if (evt._id!= event._id){ //loop thru all other events
          var startE = moment(evt.start);
          var endE = moment(evt.end);
          var range2 = moment.range(startE, endE);
          //console.log(range1.toString());
          //console.log(range2.toString());
          var isOverlap = range1.overlaps(range2);
          console.log('loop thru all events ' + evt.title + isOverlap);
          return isOverlap;
        }
      });

      for (var i = 0; i< overlapEvents.length; i++){ //for every event that overlaps with the dragging event
        var e = overlapEvents[i];
        console.log(e);
        if (eventConflict(e, event)){ //it is already in the array
          console.log(e+ "" + event + "" + "already in the array");
          continue; 
        }
        var users =  _.intersection(event.users, e.users); //array of users who clash
        if (users.length > 0){ //there are users who clash
          Meteor.call('addClash', event._id, e._id, event.title, e.title, users);
        }
      }

      function eventConflict(event1, event2){
        var obj = Clashes.findOne({ $or: [
          { 
            match1: event1._id ,
            match2: event2._id 
          },
          {
            match1: event2._id,
            match2: event1._id
          }
        ]});
        return (obj != undefined); //true if it is already in the conflict array
      }
    },

    eventAllow: function(dropLocation, draggedEvent) {
      return dropLocation.start.hour()>= 8 && (dropLocation.end.hour()<22 || (dropLocation.end.hour()==22 && dropLocation.end.minutes()==0)); 
    },
    
    dayClick: function(date, jsEvent, view) {
      var eventId = Session.get("currentEditEvent");
      var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
      if (!Session.equals('currentEditEvent',null)){ //close eventMode 
        event.editable = false;
        event.color = '#0B7A75';
        $('#calendar').fullCalendar('updateEvent', event);
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
        var start = event.start.format(); //'YYYY-MM-DDTHH:mm:ss'
        var end = event.end.format();
        Meteor.call('saveMatch',event._id, start, end );
      }
    },

    eventClick: function(calEvent, jsEvent, view) {
      //console.log(calEvent.start);
      $('#calendar').fullCalendar('updateEvent', calEvent);
      Session.set("eventInfo",{ //for writing in modal
        sport: calEvent.sport,
        round: calEvent.round,
        halls: calEvent.halls
      });
      
      if(calEvent._id == Session.get("currentEditEvent")){ //click back on the same event to close eventMode
        Session.set('currentEditEvent',null);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');
        calEvent.editable = false;
        console.log(calEvent.color);
        calEvent.color = '#0B7A75'; //light teal
        $('#calendar').fullCalendar('updateEvent', calEvent);
        var start = calEvent.start.format(); //'YYYY-MM-DDTHH:mm:ss'
        var end = calEvent.end.format();
        Meteor.call('saveMatch',calEvent._id, start, end);  
      } else if (!Session.equals('currentEditEvent',null)) { //click on another event while in eventMode
        Session.set('prevEditEvent', Session.get('currentEditEvent'));
        Session.set('currentEditEvent',calEvent._id);
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots'); //remove current available slots
        $('#calendar').fullCalendar('addEventSource', { //add current available slots
          id: 'available slots' ,
          events: calEvent.blockOuts,
          rendering: 'inverse-background', //so it shows the available slots instead
          overlap: false, //cannot drag or resize matches onto blockouts
          color: '#d5e1df'
        });
        var eventId =Session.get('prevEditEvent');
        var prevEvent = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
        var start = prevEvent.start.format(); //'YYYY-MM-DDTHH:mm:ss'
        var end = prevEvent.end.format();
        prevEvent.editable = false; 
        prevEvent.color = '#0B7A75';
        $('#calendar').fullCalendar('updateEvent', prevEvent);
        Meteor.call('saveMatch', prevEvent._id, start, end, prevEvent.color);
        calEvent.editable = true;
        calEvent.color = '#095d59';
        $('#calendar').fullCalendar('updateEvent', calEvent);
      } else { //open eventMode   
        $('#calendar').fullCalendar( 'removeEventSource', 'available slots');   
        Session.set('currentEditEvent',calEvent._id);
        $('#calendar').fullCalendar('addEventSource', { //add current available slots
          id: 'available slots' ,
          events: calEvent.blockOuts,
          rendering: 'inverse-background', //so it shows the available slots instead
          overlap: false, //cannot drag or resize matches onto blockouts
          color: '#d5e1df'
        });

        calEvent.color = '#095d59'; //dark teal
        calEvent.editable = true;
        // transition
        $('#calendar').fullCalendar('updateEvent', calEvent);
      }
    },

    viewRender: function (view, element) {
      if (Session.get("currentEditEvent")!= null){
        var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
      event.color = '#095d59'; //dark teal
        event.editable = true;
        // transition
        $('#calendar').fullCalendar('updateEvent', event);
      }
      
    },
  }).data().fullCalendar;


  Tracker.autorun(function(){
    allReqsCursor = Matches.find().fetch();
    if(calendar){
      calendar.refetchEvents();
    }
  });
}); 






Template.editCalendar.events({
  'click #edit': function(e, t) {
    $('.ui.modal').modal({
      inverted: true,
      autofocus: false,
      closable: false
    }).modal('show'); //modal appears
    $(this).blur(); //prevent button focus
  },
  'click #delete': function(e, t) { 
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
    $("#calendar").fullCalendar('removeEvents', function(event){
      return true;
    });
    $('#calendar').fullCalendar( 'removeEventSource', 'available slots');   
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
    Meteor.call('removeClash', eventId);
  },
  'click #add': function(e, t) {
    Session.set("currentDate", $('#calendar').fullCalendar('getDate').format()); //'YYYY-MM-DDTHH:mm:ss' 
    $('.ui.modal').modal({
      inverted: true,
      autofocus: false,
      closable: false
    }).modal('show'); //modal appears
    $(this).blur(); //prevent button focus
  },
  'click #shift': function(e, t) {
    var shiftDate =  $('#calendar').fullCalendar('getDate').format(); //'YYYY-MM-DDTHH:mm:ss' 
    $(this).blur(); //prevent button focus
    var eventId =Session.get('currentEditEvent');
    var event = $("#calendar").fullCalendar( 'clientEvents', eventId )[0];
    Meteor.call('moveMatch', eventId , shiftDate, function () {});
    event.color = '#095d59'; //dark teal
    $('#calendar').fullCalendar('updateEvent', event);
  }
});

    
Template.editCalendar.helpers({
  eventMode: function(){
    if(Session.get('currentEditEvent') === null){
      return false;
    }
    return true;
  },
  clashes: function(){
    /*var date = Session.get('currentDate');
    var weekStart = moment(date, moment.ISO_8601).startOf('week');
    var weekEnd = moment(date, moment.ISO_8601).endOf('week');
    weekRange = moment.range(weekStart,weekEnd);
    console.log(Clashes.find({date: {$lte: Date(weekEnd), $gte: Date(weekStart)}}).fetch());*/
    return Clashes.find({}).fetch();
  },
  clashExists: function(){
    /*console.log("run");
    var date = Session.get('currentDate');
    console.log(date);
    var weekStart = moment(date, moment.ISO_8601).startOf('week');
    var weekEnd = moment(date, moment.ISO_8601).endOf('week');
    weekRange = moment.range(weekStart,weekEnd);
    console.log(date <= weekEnd);
    console.log(date >= weekStart);
    console.log(weekStart);*/
    return Clashes.find({}).fetch().length>0;
  },
  userName: function(id) {
    var user = Meteor.users.find({_id: id});
    var username = user._selectorId;
    return username;
  }
});

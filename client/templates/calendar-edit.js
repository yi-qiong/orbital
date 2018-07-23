import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
//import { fullCalendar} from 'fullcalendar';
//import { moment } from 'moment';
import './calendar-edit.html';

Template.edit.onCreated(function() {
  this.autorun(() => {
    this.subscribe('matches');
    //this.$('#calendar').fullcalendar('refetchEvents');
  });
});


Template.edit.onRendered(() => {
  $('#calendar').fullCalendar({
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
          dow: [1,2,3,4,5], 
          start  : '8:00',
          end : '18:00',
          rendering: 'background',
          editable: false,
          color: '#d5e1df'
        },
      ],
    },
    //{ //matches
      //events: function( start, end, timezone, callback ) { 
        //callback(Matches.find({start: {$qt:start}}).fetch());
      //}
    //}
    

  ],
  
  
  
    dayClick: function() { //link to clicking addMatch button
    	alert('a day has been clicked!');
    }
  })
});








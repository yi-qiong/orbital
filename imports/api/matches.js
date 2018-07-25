
import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';
import moment from 'moment';

export const Matches = new Mongo.Collection('matches');

Meteor.methods({
  'createMatch'({sport, round,halls}) {
    // Make sure the user is logged in 
    /*if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }*/
    var time = $.fullCalendar.moment('2018-07-29T12:30:00');//moment(); 
    console.log(time);
    while (isBlockOut(time)){ //startTime is whithin the duration of a BlockOut object
      time = nextStartTime(); //find next time available after blockout
    }  
    Matches.insert({
      title: sport + " (" + round +")" , //eg: Tennis (Finals)
      sport: sport,
      round: round,
      halls: halls,
      start: time, //moment object 
      //duration is by default 2 hours when {end} is not specified in an event object
    })
    console.log(Matches.find({}).fetch());
    function isBlockOut(time){

    }
    function nextStartTime(time){

    }
    /*Matches.update(Meteor.userId(), { //update field in user docs
      $set: {
        hall: hall,
        gender: gender,
        teams: teams,
      }
    });*/
  },
})

import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';
import Moment from 'moment';
import {Availability} from '/imports/api/availability.js';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const Matches = new Mongo.Collection('matches');

Meteor.methods({
  'createMatch'(sport, round, halls, currentDate,duration) { 
    // Make sure the user is logged in 
    /*if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }*/  
    var users = [];//empty array
    var blockOuts = getBlockOuts(users,sport, halls); //all blockouts
    var weekRange;
    var start = getStart(currentDate,blockOuts,duration);
    blockOuts.push({
      dow: [1,2,3,4,5], 
      start  : '8:00',
      end : '18:00'           
    })

    Matches.insert({
      title: sport + " (" + round +")" , //eg: Tennis(F) (Finals)
      description: description(halls),
      sport: sport,
      round: round,
      halls: halls,
      start: start,
      end: moment(start).add(2, 'h').format('YYYY-MM-DDThh:mm:ss'), 
      users: users, //for clashes and overlap
      blockOuts : blockOuts //dummy to test out 
    }); 
    console.log(Matches.find({}).fetch());
  },

  'deleteMatch'(id) { 
    Matches.remove(id);
  },

  'updateMatch'(eventId, sport, round, halls){

    var users = [];//empty array
    var blockOuts = getBlockOuts(users,sport, halls);
    var match = Matches.findOne({_id: eventId});
    var duration = moment(match.end).diff(moment(match.start), 'minutes'); //maintain the duration of the match 
    var weekRange;
    var start = getStart(match.start, blockOuts, duration);

    Matches.update(eventId, { 
      $set: {
        title: sport + " (" + round +")" , //eg: Tennis(F) (Finals)
        description: description(halls),
        sport: sport,
        round: round,
        halls: halls,
        start: start,
        end: moment(start).add(duration, 'm').format('YYYY-MM-DDThh:mm:ss'), 
        users: users, //for clashes and overlap
        blockOuts : blockOuts
      }
    });
    console.log(Matches.find({}).fetch());
  },

  'moveMatch'(eventId, shiftDate){
    var match = Matches.findOne({_id: eventId});
    var duration = moment(match.end).diff(moment(match.start), 'minutes'); //maintain the duration of the match
    var weekRange;
    var start = getStart(shiftDate, match.blockOuts, duration);
    Matches.update(eventId, { 
      $set: {
        start: start,
        end: moment(start).add(duration, 'm').format('YYYY-MM-DDThh:mm:ss'),
        editable: true,
        color:  '#0B7A75'
      }
    });
    console.log(match);
  },

  'saveMatch'(eventId,start,end){
    var match = Matches.findOne({_id: eventId});
    Matches.update(eventId, { 
      $set: {
        start: start,
        end: end,
        editable: false
      }
    });
  }
})



//functions
    function description(halls){
      if (halls.length==7){
        return 'All halls';
      } else if (halls.length==2){
        return halls[0] + " vs " + halls[1];
      } else{
        var str = halls[0];
        for (var i = 0; i < halls.length; i++){
          str += ", " + halls[i];
        }
        return str;
      }
    }

    function getBlockOuts(users, sport, halls) {
      var cursor = Meteor.users.find({
        hall: {$in:halls}, //check if user's hall is in the array 
        teams: sport //searches for all users whose teams array include the given sport
      });
      cursor.forEach(function(user) {
        users.push(user._id);
      }); //add each of the users' ID into [users] array
      return Availability.find
        ({owner : {$in: users}  })
      .fetch();// get the blockouts of all players involved
    }

    function getStart(currentDate,blockOuts,duration){ //'YYYY-MM-DDThh:mm:ss'
      //console.log(moment(currentDate));
      var weekStart = moment(currentDate, moment.ISO_8601).startOf('week');
      var weekEnd = moment(currentDate, moment.ISO_8601).endOf('week');
      weekRange = moment.range(weekStart,weekEnd);

      var time = moment(weekStart); //cloning the weekStart moment


      while(time.isBefore(weekEnd) && (time.hour() > 21 || time.hour() < 8 || isBlockOut(time,blockOuts,duration))) { // out of calendar display 
        time.add(30, 'm'); //add 30 minutes and loop again
        //console.log(time.format());
      }

      if (time.isSameOrAfter(weekEnd)){ //no available slots this week
        //display ui error message???
      }

      console.log(time.format('YYYY-MM-DDThh:mm:ss'));
      return time.format('YYYY-MM-DDThh:mm:ss'); 
    }

    function isBlockOut(time,blockOuts,duration){
      var weekBO = blockOuts.filter( function (blockout){
        var startObj = moment(blockout.start);
        var endObj = moment(blockout.end);
        var blockOutRange = moment.range(startObj, endObj);

        return blockOutRange.overlaps(weekRange); //return that week's blockouts
      });
      var matchDuration;
      if (duration === 0){
        matchDuration = moment.rangeFromInterval('hour', 2, time);
      } else {
        matchDuration = moment.rangeFromInterval('minutes', duration,time);
      }
      
      //foreach blockout in weekBO{ if overlap, then return yes} 
      weekBO.forEach(function(blockout) {
        blockOutRange = moment.range(blockout.startObj, blockout.endObj);
        if(blockOutRange.overlaps(matchDuration)){
          return true;
        }
      });
      return false;
    }
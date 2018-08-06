
import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';
import Moment from 'moment';
import {Availability} from '/imports/api/availability.js';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const Matches = new Mongo.Collection('matches');

Meteor.methods({
  'createMatch'(sport, round, halls, currentDate) { 
    // Make sure the user is logged in 
    /*if (!Meteor.userId()) {
      throw new Meteor.Error('logged-out');
    }*/  
    var users = [];//empty array
    var blockOuts = getBlockOuts();
    var weekRange;
    var start = getStart(currentDate);

    Matches.insert({
      title: sport + " (" + round +")" , //eg: Tennis(F) (Finals)
      description: description(),
      sport: sport,
      round: round,
      halls: halls,
      start: start,
      end: moment(start).add(2, 'h'), 
      users: users, //for clashes and overlap
      blockOuts : blockOuts
      //duration is by default 2 hours when {end} is not specified in an event object
    }); 
    console.log(Matches.find({}).fetch());

    function description(){
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

    function getBlockOuts() {
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

    

    function getStart(currentDate){ //'YYYY-MM-DDThh:mm:ss'
      console.log(moment(currentDate));
      var weekStart = moment(currentDate, moment.ISO_8601).startOf('week');
      var weekEnd = moment(currentDate, moment.ISO_8601).endOf('week');
      weekRange = moment.range(weekStart,weekEnd);

      var time = moment(weekStart); //cloning the weekStart moment
      console.log(weekStart.format());
      console.log(weekEnd.format());
      console.log(time.format());

      while(time.isBefore(weekEnd) && (time.hour() > 21 || time.hour() < 8 || isBlockOut(time))) { // out of calendar display 
        time.add(30, 'm'); //add 30 minutes and loop again
        console.log(time.format());
      }

      if (time.isSameOrAfter(weekEnd)){ //no available slots this week
        //display ui error message???
      }

      console.log(time.format());
      return time.format(); 

    }

    function isBlockOut(time){
      var weekBO = blockOuts.filter( function (blockout){
        var startObj = moment(blockout.start);
        var endObj = moment(blockout.end);
        var blockOutRange = moment.range(startObj, endObj);

        return blockOutRange.overlaps(weekRange);
      });

      var matchDuration = moment.rangeFromInterval('hour', 2, time);
      //foreach blockout in weekBO{ if overlap, then return yes} 
      weekBO.forEach(function(blockout) {
        startObj = moment(blockout.start);
        endObj = moment(blockout.end);
        blockOutRange = moment.range(startObj, endObj);
        if(blockOutRange.overlaps(matchDuration)){
          return true;
        }
      });
      return false;
    }
    /*Matches.update(Meteor.userId(), { //update field in user docs
      $set: {
        hall: hall,
        gender: gender,
        teams: teams,
      }
    });*/
  },
  'deleteMatch'(id) { 
    Matches.remove(id);
  },
  'updateMatch'(eventId, sport, round, halls){
    Matches.update(eventId, { 
      $set: {
        sport: sport,
        round: round,
        halls: halls,
      }
    });
    console.log(Matches.find({}).fetch());
  }

})

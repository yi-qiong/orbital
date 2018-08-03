
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
    var time = moment();   
    var users = [];//empty array
    var cursor = Meteor.users.find({
      hall: {$in:halls}, //check if user's hall is in the array 
      teams: sport //searches for all users whose teams array include the given sport
    });
    cursor.forEach(function(user) {
      users.push(user._id);
    }); //add each of the users' ID into [users] array
    Matches.insert({
      title: sport + " (" + round +")" , //eg: Tennis(F) (Finals)
      description: description(),
      sport: sport,
      round: round,
      halls: halls,
      start: time,
      users: users
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

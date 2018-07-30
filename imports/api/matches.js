
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
    var time = '2018-08-01T12:30:00';   

    Matches.insert({
      title: sport + " (" + round +")" , //eg: Tennis(F) (Finals)
      description: description(),
      sport: sport,
      round: round,
      halls: halls,
      start: time, 
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

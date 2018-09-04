import {Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo';
import {Matches} from '/imports/api/matches.js';

export const Clashes = new Mongo.Collection('clashes');

Meteor.methods({
  'addClash'(event1ID, event2ID, event1Title, event2Title, users) { 
  	var match = Matches.findOne({_id: event1ID});
  	Clashes.insert({
  		date: match.start, //YYYY-MM-DDThh:mm:ss
  		match1: event1ID,
    	match2: event2ID,
    	sport1: event1Title,
    	sport2: event2Title, 
    	users: users //users that are involved in both matches only
  	});
  },
  'removeClash'(eventId){
  	Clashes.remove({match1: eventId});
  	Clashes.remove({match2: eventId});
  }
   
})
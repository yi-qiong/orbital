import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/api/matches.js';
import {Matches} from '/imports/api/matches.js';


Meteor.publish( 'matches', function() {
  return Matches.find();
});
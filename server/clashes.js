import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/api/clashes.js';
import {Clashes} from '/imports/api/clashes.js';


Meteor.publish( 'clashes', function() {
  return Clashes.find({});
});

 

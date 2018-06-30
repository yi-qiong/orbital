import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../imports/api/availability.js'

Meteor.publish( 'availability', function() {
  return Availability.find();
});

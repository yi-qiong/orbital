import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/api/availability.js';
import '/imports/api/modal.js';
import {Availability} from '/imports/api/availability.js';


Meteor.publish( 'availability', function() {
  var currentUserId = this.userId;
   return Availability.find({ owner: currentUserId });
});

 
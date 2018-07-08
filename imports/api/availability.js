import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Availability = new Mongo.Collection('availability');

Availability.allow({
  insert: () => false,
  update: () => false,
  remove: () => false                                
});

Availability.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


Meteor.methods({
  'indicateAvailability'( selectedDate, startTime, endTime ) {
    check(selectedDate, String );
    check(startTime, String);
    check(endTime, String);
    

    Availability.insert({
      date: selectedDate,
      start: startTime,
      end: endTime,
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    console.log(Availability.find().fetch());
  },
  'blockout.remove'(id){
    Availability.remove(id);
  }
});
//}



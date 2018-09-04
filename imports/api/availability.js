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
    
    var dateNstart = selectedDate + " " + startTime;
    var momentStart = moment(dateNstart, 'DD-MM-YYYY HH:mm A');
    var dateNend = selectedDate + " " + endTime;
    var momentEnd = moment(dateNend, 'DD-MM-YYYY HH:mm A');

    Availability.insert({
      date: selectedDate,
      start: startTime,
      end: endTime,
      startObj: momentStart.format('YYYY-MM-DDTHH:mm:ss'),
      startObj24Hr: moment(momentStart).format('HH:mm'),
      endObj: momentEnd.format('YYYY-MM-DDTHH:mm:ss'),
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



import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Availability = new Mongo.Collection( 'availability' );

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

//if(Meteor.isServer) {
	//Meteor.publish( 'availability', function() { 
  //return Availability.find({ //only publish blocked out dates of user
  	//$or: [
  	//{private: {$ne: true}},
  	//{owner: this.userId},
  	//]
  //})
//});

  Meteor.methods({
  'indicateAvailability'( selectedDate, startTime, endTime ) {
    check(selectedDate, String );
    check(startTime, String);
    check(endTime, String);
    
    Availability.insert({
      date: selectedDate,
      start: startTime,
      end: endTime,
      createdAt: new Date(),
      //owner: Meteor.userId(),
      //username: Meteor.user().username,
    })
  }
});
//}



import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

 
export const Teams = new Mongo.Collection('teams');

if (Teams.find().count() === 0) { //only add if empty, so it wont insert everytime meteor restarts
  var sports = ["Badminton(M)","Badminton(F)","Basketball(M)","Basketball(F)","Floorball(M)","Floorball(F)","Frisbee","Handball(M)","Handball(F)","Netball","Road Relay","Sepak Takraw","Soccer(M)","Soccer(F)","Softball","Squash(M)","Squash(F)","Swimming(M)","Swimming(F)","Table Tennis(M)","Table Tennis(F)",
		      "Tennis(M)","Tennis(F)","Touch Rugby(M)","Touch Rugby(F)","Track and Field","Volleyball(M)","Volleyball(F)"];
  _.each(sports, function (sport) {
    Teams.insert({name: sport});
  });
}

// below part yet to code
Meteor.methods({
  'teams.insert'() {
    check(text, String);
 
    // Make sure the user is logged in 
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
}); 

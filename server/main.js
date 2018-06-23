import { Meteor } from 'meteor/meteor';
import '../imports/api/teams.js';
import { Teams } from '../imports/api/teams.js';
import { Submit } from '../imports/api/teams.js';



Meteor.startup(() => {
  // code to run on server at startup
  if (Teams.find().count() === 0) { //only add if empty, so it wont insert everytime meteor restarts
    var sports = ["Badminton(M)","Badminton(F)","Basketball(M)","Basketball(F)","Floorball(M)","Floorball(F)","Frisbee","Handball(M)","Handball(F)","Netball","Road Relay","Sepak Takraw","Soccer(M)","Soccer(F)","Softball","Squash(M)","Squash(F)","Swimming(M)","Swimming(F)","Table Tennis(M)","Table Tennis(F)",
				"Tennis(M)","Tennis(F)","Touch Rugby(M)","Touch Rugby(F)","Track and Field","Volleyball(M)","Volleyball(F)"];
    _.each(sports, function (sport) {
      Teams.insert({name: sport});
    });
  }

  if (Submit.find().count() ===0){//same logic as above, only for first time when app is first opened
  	Submit.insert({name: "name", value: false});
  }
});

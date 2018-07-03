import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../imports/api/teams.js';

Meteor.publish('userInfo', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      submittedTeamForm:1,
      hall:1,
      teams:1
    }
  });
}); 

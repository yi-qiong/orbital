import { Mongo } from 'meteor/mongo';
 
export const Teams = new Mongo.Collection('teams');

console.log (Teams.find().fetch());

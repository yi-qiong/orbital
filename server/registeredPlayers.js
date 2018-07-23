import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/api/registeredPlayers.js';
import {RegisteredPlayers} from '/imports/api/registeredPlayers.js';


Meteor.publish('registeredPlayers', function() {
 	return RegisteredPlayers.find();
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/api/registeredConvening.js';
import {RegisteredConvening} from '/imports/api/registeredConvening.js';


Meteor.publish('registeredConvening', function() {
 	return RegisteredConvening.find();
});

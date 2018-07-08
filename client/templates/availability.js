import {Meteor} from 'meteor/meteor';
import {Template } from 'meteor/templating';
import {Availability} from '/imports/api/availability.js'


Template.appointments.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
  });
});

Template.appointments.events({
	'click #edit': function() {
		//need to present the info in the picker then allow user to change the info
	},

	'click #delete': function() {
		//delete the data 
	}
});

Template.appointments.helpers({
  appointments() {
    let appointments = Availability.find({owner: Meteor.userId()}).fetch();
    var datesList = new Array();
   		$.each(appointments,function(key, value) {
    	if (value.start == "" && value.end =="") {
    		var blockedDate = "on " + value.date;
    		console.log(blockedDate)
    		datesList.push(blockedDate);
    	} else {
    		var blockedDate = value.date;
    		var startTime = value.start;
    		var endTime = value.end;
    		var blockOut = "on " + blockedDate + " from " + startTime	+ " to " + endTime;
    		console.log(blockOut)
    		datesList.push(blockOut); 
    	}
    	
    })
   		return datesList;
   	//console.log(appointments);
  }
});

//in html: output as a list 
//when i click on an entry, i should be able to edit/delete the entry (use semantic animate button)
//when click on edit button, the entry should reflect back in the datetimepicker
//when click on the delete button, will just remove from the collection

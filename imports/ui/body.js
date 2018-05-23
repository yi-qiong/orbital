import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import './body.html';

Template.body.onCreated( function() {
  	Template.instance().currentTab = new ReactiveVar( "sportslist" ); //new attribute created and ref
});

Template.body.helpers({
  	tab: function() {
  		console.log("test");
    	console.log(Template.instance().currentTab.get()); //getter method for current active tab
  		return Template.instance().currentTab.get();
  	},
  	sports: function(){
		return [
    		{name: "Badminton(M)"},
			{name: "Badminton(F)"},
			{name: "Basketball(M)"},
			{name: "Basketball(F)"},
			{name: "Floorball(M)"},
			{name: "Floorball(F)"},
			{name: "Frisbee"},
			{name: "Handball(M)"},
			{name: "Handball(F)"},
			{name: "Netball"},
			{name: "Road Relay"},
			{name: "Sepak Takraw"},
			{name: "Soccer(M)"},
			{name: "Soccer(F)"},
			{name: "Softball"},
			{name: "Squash(M)"},
			{name: "Squash(F)"},
			{name: "Swimming(M)"},
			{name: "Swimming(F)"},
			{name: "Table Tennis(M)"},
			{name: "Table Tennis(F)"},
			{name: "Tennis(M)"},
			{name: "Tennis(F)"},
			{name: "Touch Rugby(M)"},
			{name: "Touch Rugby(F)"},
			{name: "Track and Field"},
			{name: "Volleyball(M)"},
			{name: "Volleyball(F)"},
  		];
  	},
});

Template.body.events({
	'click .sportslist':function(event, template){
    	$('.availability').removeClass('active');
        $('.sportslist').addClass('active');
        template.currentTab.set( "sportslist" );
    },
    'click .availability':function(event, template){
    	$('.sportslist').removeClass('active');
        $('.availability').addClass('active');
        template.currentTab.set( "availability" );
    },
	
})

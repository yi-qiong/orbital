import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import './body.html';
$(document).ready(function(){
                 
});

Template.body.helpers({
  sports: [
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
  ],
});

Template.body.events({
	'click .menu-sports':function(){
    	$('.menu-availability').removeClass('active');
        $('.menu-sports').addClass('active');

    },
    'click .menu-availability':function(){
    	$('.menu-sports').removeClass('active');
        $('.menu-availability').addClass('active');
    },
	
})

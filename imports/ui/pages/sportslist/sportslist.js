import { Template } from 'meteor/templating';

import { Teams } from '/imports/api/teams.js';

import { Submit } from '/imports/api/teams.js';

import './sportslist.html';

Template.body.onCreated( function() {	
  	Template.currentTab = new ReactiveVar( "sportslist" ); //new attribute created and ref
    Session.set('value', false);//Submit.find().fetch().value ) doesnt load first
    
    //console.log(Submit.find().fetch());
    //console.log(Submit.findOne({name:"name"}).value);
});

Template.body.helpers({
  	tab: function() {
    	console.log(Template.currentTab.get()); //getter method for current active tab
  		return Template.currentTab.get();
  	},
});

Template.sportslist.helpers({
  	sports: function() {
  		return Teams.find();
  	},
});

Template.body.events({
	'click .sportslist':function(event, template){
    	$('.availability').removeClass('active');
        $('.sportslist').addClass('active');
        Template.currentTab.set( "sportslist" );
    },
    'click .availability':function(event, template){
    	$('.sportslist').removeClass('active');
        $('.availability').addClass('active');
        Template.currentTab.set( "availability" );
    },
	
})

Template.sport.helpers({
  disabled: function(){
    return Session.get('value'); //return the boolean value
  }
})

Template.sport.events({
	'click .item':function(){
		Teams.update(this._id, {
      		$set: { active: ! this.active },
    });

		//currentItem = event.target;
    	//$(currentItem).toggleClass('active');
    	//if ($(currentItem).hasClass('active')){
    		//Teams.insert({
    			//name: $(currentItem).text(),
    		//})		//add to Teams collection 
    	//};
    	//console.log(Teams.find().fetch());
  },
})

Template.sportslist.events({
	'click .button':function(event, instance){
    var value = Submit.findOne({name:"name"})._id;
 		Submit.update(value, {
          $set: { value: true },
    });
    console.log(Submit.findOne({name:"name"}).value); //true
    Session.set( 'value',true );
  },
})


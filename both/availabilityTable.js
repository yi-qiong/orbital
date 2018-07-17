import {Availability} from '/imports/api/availability.js'
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

new Tabular.Table({
  name: "Availability",
  searching: false, //hide the search box
  collection: Availability,
  order: [[0, 'asc'], [1, 'asc']], //sort the date by ascending
  columns: [
    {data: "date", title: "Blocked Out Date"},
    {data: "start", title: "Start Time"},
    {data: "end", title: "End Time"},
    {
      title: "Action",   
      tmpl: Meteor.isClient && Template.actionCell,
      sWidth: "20px",
      sClass: "td-center",
    }
  ]
});

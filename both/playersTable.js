import {RegisteredPlayers} from '/imports/api/registeredPlayers.js'
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

new Tabular.Table({
  name: "RegisteredPlayers",
  searching: false, //hide the search box
  collection: RegisteredPlayers,
  columns: [
    {data: "name", title: "Player Name"},
    {data: "email", title: "Player Email"}
  ]
});

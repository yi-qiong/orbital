import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const RegisteredConvening = new Mongo.Collection('registeredConvening');

RegisteredConvening.allow({
  insert: () => false,
  update: () => false,
  remove: () => false                                
});

RegisteredConvening.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


Meteor.methods({
  'insertConvening' (conveningEmail, conveningName) {
    // Make sure the user is logged in 
    //if (!Meteor.userId()) {
      //throw new Meteor.Error('logged-out');
    //}
    //if (this.isSimulation){
      //console.log("meteor methods simulation");
    //}
    
    RegisteredConvening.insert({
      email: conveningEmail,
      name: conveningName
    })

    console.log(RegisteredConvening.find().fetch());
  },
});
//}



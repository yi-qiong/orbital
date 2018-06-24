import { Accounts } from 'meteor/accounts-base';


Accounts.config({     //if later on we switch from accounts-ui to useraccounts:semantic-ui nid to rewrite 
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: 'u.nus.edu',
  sendVerificationEmail:true
});
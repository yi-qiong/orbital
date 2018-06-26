import { AccountsTemplates } from 'meteor/useraccounts:core';


Accounts.config({     //if later on we switch from accounts-ui to useraccounts:semantic-ui nid to rewrite 
  //forbidClientAccountCreation: false,
  
  restrictCreationByEmailDomain: 'u.nus.edu',
});

AccountsTemplates.configure({
    // Behavior
    confirmPassword: false,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    //enforceEmailVerification: true,
    overrideLoginErrors: true,
    //sendVerificationEmail: true,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    //onSubmitHook: mySubmitFunc,
    //preSignUpHook: myPreSubmitFunc,
    //postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Sign up"
      },

      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

//var mySubmitFunc = function(error, state){
  //if (!error) {
    //if (state === "signIn") {
      // Successfully logged in
      // ...
    //}
    //if (state === "signUp") {
      // Successfully registered
      // ...
    //}
  //}
//

import { AccountsTemplates } from 'meteor/useraccounts:core';


Accounts.config({ //accounts-password
  restrictCreationByEmailDomain: 'u.nus.edu',
});

AccountsTemplates.configure({ //useraccounts
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
    //onSubmitHook: mySubmitFunc, //can be used for routing?? idk
    //preSignUpHook: myPreSubmitFunc,
    //postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register"
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

//var myPostLogout = function(){
    //example redirect after logout
    //Router.go('/home');
//};
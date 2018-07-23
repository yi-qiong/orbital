import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({ //useraccounts
    // Behavior
    confirmPassword: true,
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
    hideSignUpLink: true,

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

var password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    placeholder: {
        enrollAccount: "At least six characters"
    },
    required: true,
    minLength: 6,
    re: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
    errStr: 'At least 1 digit, 1 lowercase and 1 uppercase',
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

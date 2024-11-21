import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import App from "./App.tsx";

import "./index.css";

Amplify.configure({
  Auth: {
    Cognito: {
      loginWith: {
        username: false,
        email: true,
        oauth: {
          redirectSignIn: ["http://localhost:5173"],
          redirectSignOut: ["http://localhost:5173"],
          domain: "scalac-blogpost.auth.eu-central-1.amazoncognito.com",
          providers: ["Google"],
          scopes: ["email", "openid", "aws.cognito.signin.user.admin"],
          responseType: "code",
        },
      },
      // userPoolId: "ap-south-1_00TLX4cE3",
      // userPoolClientId: "144lgpoo1vu53ctca5be5j6hvh",
      userPoolId: "ap-south-1_E5p90O5a2",
      userPoolClientId: "9f60j7i208krcc99d0dbc3qig",
      // userPoolId: "ap-south-1_twiXUQD5Q",
      // userPoolClientId: "63ika85kfgc8vb3sq0sdks4cpr",
      signUpVerificationMethod: "code",
    },
  },
});

// client id - 2sbh33a9n37q9of2vvtei1d1o



// Amplify.configure({
//   Auth: {
//     Cognito: {
//       // @ts-ignore
//       region: "ap-south-1",
//       userPoolId: "ap-south-1_00TLX4cE3",
//       userPoolClientId: "144lgpoo1vu53ctca5be5j6hvh",
//       signUpVerificationMethod: "code",
//       authenticationFlowType: "USER_SRP_AUTH",
//       loginWith: {
//         username: false,
//         email: true,
//         phone: false
//       },
//       oauth: {
//         domain: "mymuseauthapp31d31c30-31d31c30-dev.auth.ap-south-1.amazoncognito.com",
//         scope: ["email", "profile", "openid"],
//         redirectSignIn: ["http://localhost:5173/"],
//         redirectSignOut: ["http://localhost:5173/"],
//         responseType: "code",
//         providers: ["Google"]
//       }
//     }
//   }
// });

const AppWithAuth = withAuthenticator(App);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);

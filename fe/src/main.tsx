import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import "./index.css";
import "./App.css";
import App from "./App";

Amplify.configure({
  Auth: {
    Cognito: {
      // @ts-ignore
      region: "ap-south-1",
      userPoolId: "ap-south-1_00TLX4cE3",
      userPoolClientId: "144lgpoo1vu53ctca5be5j6hvh",
      signUpVerificationMethod: "link",
      authenticationFlowType: "USER_SRP_AUTH",
      loginWith: {
        username: true,
        email: true,
        phone: false,
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

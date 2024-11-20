// import jwt from "jsonwebtoken";
// import AWS from "aws-sdk";
// import axios from "axios";

// async function getCognitoPublicKeys(region: string, userPoolId: string) {
//   const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
//   const response = await axios.get(url);
//   return response.data.keys;
// }

// function getPublicKeyFromToken(token: string, keys: any[]) {
//   const decoded = jwt.decode(token, { complete: true });
//   if (!decoded || !decoded.header.kid) {
//     throw new Error("Token is missing kid");
//   }
//   const key = keys.find((k) => k.kid === decoded.header.kid);
//   if (!key) {
//     throw new Error("Unable to find appropriate key");
//   }
//   return key;
// }
// export async function verifyToken(token: string) {
//   const region = "ap-south-1";
//   const userPoolId = "ap-south-1:9027eedf-becd-45ec-999b-39f75f7c62e9";

//   const keys = await getCognitoPublicKeys(region, userPoolId);
//   const key = getPublicKeyFromToken(token, keys);

//   //   const publicKey = {
//   //     kty: key.kty,
//   //     n: key.n,
//   //     e: key.e,
//   //   };

//   return jwt.verify(token, key, { algorithms: ["RS256"] });
// }



import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response, NextFunction } from 'express';

// Initialize the verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: "ap-south-1_00TLX4cE3", // e.g., "us-east-1_XXXXXXXX"
  tokenUse: "id", // or "access"
  clientId: "144lgpoo1vu53ctca5be5j6hvh", // e.g., "25s3j2xs..."
  // Optional: If you want to verify specific token claims
  // customJwtCheck: ({ payload }) => {
  //   if (payload.sub === undefined) {
  //     throw new Error("Claim 'sub' is required!");
  //   }
  // },
});

// Middleware to verify token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token from Bearer schema
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = await verifier.verify(token);
    
    // Add the verified payload to the request object for use in route handlers
    req.user = payload;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
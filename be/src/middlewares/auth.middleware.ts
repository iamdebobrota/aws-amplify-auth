import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

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

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);
    console.log("payload in middleware", payload);
    // Add the verified payload to the request object for use in route handlers
    // req.user = payload;

    next();
  }
);

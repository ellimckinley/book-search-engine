import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || 'secret';
const expiration = '1h';

// This gets passed into Apollo Server as context
export function authMiddleware({ req }: { req: any }) {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1]; // Remove 'Bearer'
  }

  try {
    if (token) {
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return { user };
    }
  } catch (err) {
    console.warn('Invalid token');
  }

  return { user: null };
}

// Used for login/signup
export function signToken(user: { _id: unknown; username: string; email: string }) {
  return jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    secretKey,
    { expiresIn: expiration }
  );
}




// import type { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// import dotenv from 'dotenv';
// dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string,
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// export const signToken = (username: string, email: string, _id: unknown) => {
//   const payload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };

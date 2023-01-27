import jwt from "jsonwebtoken";

export function verifyJWT(authorization: string) {
  try {
    const token = jwt.verify(authorization, process.env.JWT_SECRET!);
    return token;
  } catch (error) {
    throw new Error("Invalid JWT");
  }
}

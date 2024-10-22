import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user: IUser = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc Authenticate user & get token
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate token
    const token = generateToken(user._id);

    // Set token as a cookie
    res.cookie("token", token, {
      path: "/", // Ensures the cookie is available throughout your app
      httpOnly: false, // Ensure this is false to allow JavaScript access
      secure: false, // Set to true in production
      sameSite: "lax", // Modify as per your needs, but "None" for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return user data in response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const verifyToken = async (req: any, res: Response) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log(decoded);
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

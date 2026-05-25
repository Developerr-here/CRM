import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password, organization } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
 }



  // SAAS LOGIC: 
  // If this is the first user for this organization, make them ADMIN.
  // Otherwise, they are an AGENT (or you could implement an invite system).
  const organizationExists = await User.findOne({ organization });
  const role = organizationExists ? "agent" : "admin";

  const user = await User.create({
    name,
    email,
    password,
    organization,
    role, // Automatically assigned based on if the company is new
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const getMe = async (req, res) => {
  // req.user is already populated by our 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      organization: req.user.organization,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// import User from "../models/User.js";
// import generateToken from "../utils/generateToken.js";

// // @desc    Register new user
// // @route   POST /api/auth/register
// export const registerUser = async (req, res) => {
//   const { name, email, password, organization } = req.body; // Extract org

//   const userExists = await User.findOne({ email });
//   if (userExists) return res.status(400).json({ message: "User already exists" });

//   // The first person to register for an org is the 'admin'
//   const user = await User.create({ 
//     name, 
//     email, 
//     password, 
//     organization, 
//     role: 'admin' 
//   });

//   if (user) {
//     generateToken(res, user._id);
//     res.status(201).json({ 
//       _id: user._id, 
//       name: user.name, 
//       email: user.email, 
//       role: user.role,
//       organization: user.organization 
//     });
//   } else {
//     res.status(400).json({ message: "Invalid user data" });
//   }
// };
// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
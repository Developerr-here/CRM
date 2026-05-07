import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // THE SAAS KEY: This groups all users, customers, and leads
    organization: { type: String, required: true, trim: true }, 
    role: { 
      type: String, 
      enum: ["admin", "manager", "agent"], 
      default: "agent" 
    },
  },
  { timestamps: true }
);

// Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving ,In Mongoose, .pre() is a middleware hook that executes custom functions before specific database operations (such as save, validate, update, or remove) occur. It is defined at the schema level to sanitize data, perform validation, hash passwords, or log events before data hits MongoDB. In this code, the .pre("save") hook is used to hash the user's password before saving it to the database. If the password field has been modified, it generates a salt and hashes the password using bcrypt, ensuring that plain text passwords are never stored in the database for security reasons.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;


// import mongoose from "mongoose";
// import bcrypt from "bcryptjs"; // npm install bcryptjs

// const userSchema = new mongoose.Schema({
//   organization: {
//   type: String,
//   required: [true, "Please add a company/org name"],
//   trim: true
// },
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["admin", "manager", "agent"], 
//     default: "agent" 
//   },
// }, { timestamps: true });

// // Pre-save hook to hash password before saving to DB
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// export default User;
const User = require("../models/user.model");
const bcrypt= require('bcryptjs')
const jwt= require("jsonwebtoken")

// exports.signup = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);

//     const user = await User.create({
//       name: "Debug User",
//       email: "debug@test.com",
//       password: "123456"
//     });

//     return res.json({
//       ok: true,
//       user
//     });
//   } catch (error) {
//     console.log("❌ DB ERROR:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };










// // // SIGNUPr
exports.signup = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name,
      email,
      password, // 👈 plain password
      role
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
     
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("REQ BODY:", req.body);
    console.log("PLAIN PASSWORD:", password);

    const user = await User.findOne({ email });

    // ✅ FIRST CHECK
    if (!user) {
      console.log("USER NOT FOUND FOR EMAIL:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ AB SAFE HAI
    console.log("HASHED PASSWORD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      token
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

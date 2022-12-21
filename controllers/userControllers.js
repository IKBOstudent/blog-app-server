import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";

export const register = async (request, response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const new_hash = await bcrypt.hash(request.body.password, salt);

    const doc = new UserModel({
      fullName: request.body.fullName,
      email: request.body.email,
      passwordHash: new_hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      success: true,
      ...userData,
      token,
    });
  } catch (err) {
    response.status(500).json({
      message: "Registratoin failed",
      error: err,
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      request.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return response.status(404).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      success: true,
      ...userData,
      token,
    });
  } catch (err) {
    response.status(500).json({
      message: "Login failed",
      error: err,
    });
  }
};

export const getMe = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    response.json({
      success: true,
      ...userData,
    });
  } catch (err) {
    response.json({
      message: "Forbidden",
    });
  }
};

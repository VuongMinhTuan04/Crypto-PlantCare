const mongoose = require("mongoose");

const UserDetail = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    email: {
      type: String,
    },
    numberPhone: {
      type: String,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const UserDetailModel = mongoose.model("UserDetail", UserDetail);
module.exports = UserDetailModel;

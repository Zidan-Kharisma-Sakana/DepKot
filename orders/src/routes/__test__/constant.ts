import mongoose from "mongoose";

export const RECEIVER = {
  buyer_id: new mongoose.Types.ObjectId(),
  receiver_name: "Penerima",
  receiver_address: "BLABLABLA",
  receiver_number: "08567681222",
};
export const SENDER = {
  store_id: new mongoose.Types.ObjectId(),
  sender_name: "Penerima",
  sender_address: "BLABLABLA",
  sender_number: "08567681222",
};

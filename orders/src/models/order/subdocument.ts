import mongoose from "mongoose";

export const ItemSchema = new mongoose.Schema({
  product_id: mongoose.Schema.Types.ObjectId,
  item_name: String,
  item_price: Number,
});
export interface ItemDoc extends mongoose.Document {
  product_id: string;
  item_name: string;
  item_price: number;
}
export const ReceiverSchema = new mongoose.Schema({
  buyer_id: mongoose.Schema.Types.ObjectId,
  receiver_name: String,
  receiver_address: String,
  receiver_number: String,
});
export interface ReceiverDoc extends mongoose.Document {
  buyer_id: string;
  receiver_name: string;
  receiver_address: string;
  receiver_number: string;
}
export const SenderSchema = new mongoose.Schema({
  store_id: mongoose.Schema.Types.ObjectId,
  sender_name: String,
  sender_address: String,
  sender_number: String,
});
export interface SenderDoc extends mongoose.Document {
  store_id: string;
  sender_name: string;
  sender_address: string;
  sender_number: string;
}

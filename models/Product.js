import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user"},
    name: { type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: { type: Array, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
});

const Product = mongoose.models.Product || mongoose.model('product', userSchema);

export default Product;
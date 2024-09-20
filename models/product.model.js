import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    comment:{
	    type: String,
    },
    userId:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    // https://www.youtube.com/watch?v=yyWoCi6CI0c //TODO not bad explanation but its not in english lol
    // https://www.youtube.com/watch?v=20tJJAI6_oA //TODO front-end for likes
    // likes:{
    //     type: Number,
    //     default: 0,
    // },
    verified: Boolean,
    likedBy: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
             ],
},
);



const Product = mongoose.model("Product", ProductSchema);
export default Product;

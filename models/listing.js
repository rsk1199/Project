const mongoose = require("mongoose");
// const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");
const listingSchema = new Schema({
    title: String,
    description: String,
    image : {
        url : String,
        filename: String
    },
    price : Number,
    location: String,
    country  : String,
    reviews :[
         {
        type : Schema.Types.ObjectId,
        ref : "Review",
    },
],
owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
}
});

listingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing){
     await Review.deleteMany({ _id: {$in: listing.reviews } }); 
}
});

const Listing =  mongoose.model("Listing" , listingSchema);
module.exports = Listing;








// image : {
//     filename: String,
// url: {
//     type : String,
//     default : "https://images.unsplash.com/photo-1605361287984-daec9f33ba0a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
//     set : (v) => v === "" ? "https://images.unsplash.com/photo-1605361287984-daec9f33ba0a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
// }
// },
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        // type:String,
        // default:"https://images.unsplash.com/photo-1790805611652-88ccdfed4819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1790805611652-88ccdfed4819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" : v, // if the user given link is empty then default link is given otherwise we will use the user entered link 

        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
      coordinates: {
      type: [Number],
      required: true
    },
},
    //     category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","deserts"]
    // }
});


listingSchema.post("findOneAndDelete", async(listing) =>{

    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});

    }   

});
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
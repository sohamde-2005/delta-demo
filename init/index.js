const mongoose = require("mongoose");
const initData = require("./data.js"); // requiring the sample data for initilizing the database
const Listing = require("../models/listing.js"); // requiring the model that we made or collection we formed in the database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async () =>{
    await Listing.deleteMany({}); // First we are cleaning the database /collection 
    initData.data = initData.data.map((obj)=>({...obj, owner:"6af09b5db637ff06792d852b"}));
    await Listing.insertMany(initData.data); // initData is an object and inside it we want to access the key data
    console.log("data was initialized"); 
}

// initDB();

// or --not requirede as we have handeled the situation if promise get successfull in the initDB fn 
// initDB()
//     .then(() => {
//         console.log("data was initialized");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// or -- as we have handeled if promise get successfull in the initDB fn itself but haven't handeled the error so we can handel that here 
initDB().catch((err) => {
    console.log(err);
});
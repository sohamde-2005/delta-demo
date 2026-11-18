const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


 // index route asynchronous function
module.exports.index = async (req,res)=>{
        const allListings = await Listing.find({});
            // console.log(res);
            res.render("listings/index.ejs",{allListings});
        
    };

// new routes asynchronous function

module.exports.renderNewForm = (req,res)=>{

        res.render("listings/new.ejs");
    };

// Show routes async function 

module.exports.showListing = async (req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            return res.redirect("/listings");

        }
        // console.log(listing);
        res.render("listings/show.ejs",{ listing });
    };

// Create route async function 
module.exports.createListings = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

    // console.log(response.body.features); // it return an array where the objects are stored 
    // console.log(response.body.features[0].geometry); // where the actual coordinates get stored in the form of an araay
    // res.send("done!");
    

        // let {title,description,image,price,country,location} = req.body;
        //but simpler version--->
        // let listing = req.body.listing;
        // console.log(listing);

        // if(!req.body.listing){   // while sending request if we do not send any listing which we are sending as object but if there is no such object then we will get client error as 400 means for clients bad request server is  unable to handle the req 
        //     throw new ExpressError(400,"Send valid data for listing");
        // }

        // Now we will check the schema in a single way
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // }

        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url, "..", filename);

        const newListing = new Listing(req.body.listing);

        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing!");
        // }

        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing!");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing!");
        // }
        newListing.image ={url,filename};
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);
        

        req.flash("success","New Listing Created!");
        res.redirect("/listings");


    };


    // Edit route async function 

    module.exports.renderEditForm = async (req,res)=>{
            let {id}= req.params;
            const listing = await Listing.findById(id);
            if(!listing){
                req.flash("error","Listing you requested for does not exist!");
                return res.redirect("/listings");
    
            }

            let originalImageUrl = listing.image.url;
            originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
            res.render("listings/edit.ejs", { listing, originalImageUrl });
    
        };


    // Update listings route async function 

    module.exports.updateListing = async (req,res)=>{
        
            // if(!req.body.listing){
            //     throw new ExpressError(400,"Send valid data for listing");
    
            // }
            let {id} = req.params;
            let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

            if ( typeof req.file !=="undefined"){
                let url = req.file.path;
                let filename = req.file.filename;
                listing.image = {url,filename};

                await listing.save();

            };


            req.flash("success","Listing Updated!");
            res.redirect(`/listings/${id}`); // redirecting to show route
        };


    // Delete listings route async function 

    module.exports.destroyListing = async (req,res)=>{
        let {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    };
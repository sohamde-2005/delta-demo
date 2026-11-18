
// Import the User model to register new users
const User = require("../models/user.js");

// Render the signup page
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle user registration
module.exports.signup = async (req, res, next) => {
    try {
        // Extract username, email and password from the signup form
        let { username, email, password } = req.body;

        // Create a new user object
        const newUser = new User({ email, username });

        // Register the user (passport-local-mongoose hashes the password)
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        // Automatically log in the newly registered user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        // Display registration errors, such as duplicate usernames
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render the login page
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle successful login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    // Redirect to the originally requested page, or listings by default
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

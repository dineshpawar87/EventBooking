const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Booking = require("./models/booking");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/eventease")
.then(()=>console.log("MongoDB Connected"));

/* User Schema */

const UserSchema = new mongoose.Schema({
name:String,
email:String,
password:String
});

const User = mongoose.model("User",UserSchema);


/* ADD LOGIN HISTORY SCHEMA HERE */

const LoginSchema = new mongoose.Schema({
email:String,
loginTime:{type:Date, default:Date.now}
});

const LoginHistory = mongoose.model("LoginHistory", LoginSchema);


/* Register API */

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Trim and lowercase to match login
    const userEmail = email.toLowerCase().trim();
    const userPassword = password.trim();

    const existing = await User.findOne({ email: userEmail });
    if(existing) return res.json({ success: false, message: "Email already exists" });

    const user = new User({ name: name.trim(), email: userEmail, password: userPassword });
    await user.save();

    res.json({ success: true, message: "User registered successfully" });
});


/* Login API */

app.post("/login", async (req, res) => {

const { email, password } = req.body;

const userEmail = email.toLowerCase().trim();
const userPassword = password.trim();

const user = await User.findOne({ email: userEmail, password: userPassword });

if (user) {

res.json({
success: true,
name: user.name,
email: user.email,
message: "login successful"
});

} else {

res.json({
success: false,
message: "Invalid email or password"
});

}

});

/* Get Users for Admin */

app.get("/users", async(req,res)=>{

const users = await User.find();

res.json(users);

});


/* Get Login History */

app.get("/logins", async(req,res)=>{

const logins = await LoginHistory.find();

res.json(logins);

});

/*admin */ 
app.listen(3000,()=>{
console.log("Server running on port 3000");
});

app.post("/adminlogin", async(req,res)=>{

const {email} = req.body;

const login = new LoginHistory({email});

await login.save();

res.json({message:"Admin Login Saved"});

});

const EventSchema = new mongoose.Schema({
name:String,
date:String,
time:String,
location:String,
price:Number
});

const Event = mongoose.model("Event", EventSchema);

app.post("/addevent", async(req,res)=>{

const {name,date,time,location,price} = req.body;

const event = new Event({name,date,time,location,price});

await event.save();

res.json({message:"Event Added Successfully"});

});

//get the events

app.get("/events", async(req,res)=>{

const events = await Event.find();

res.json(events);   

});

//delete the event 

app.delete("/deleteevent/:id", async (req,res)=>{

try{

await Event.findByIdAndDelete(req.params.id);

res.json({message:"Event Deleted Successfully"});

}
catch(err){

res.json({message:"Error deleting event"});

}

});

// show booking admin dashbord

app.get("/bookings", async (req,res)=>{

let bookings = await Booking.find();

res.json(bookings);

});

// when user bookevent this code for check 


// for cancel booking 

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Event Schema
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  location: String,
  price: Number
});


// user book an event 
app.post("/bookevent", async (req, res) => {
  const { username, userEmail, eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const newBooking = new Booking({
      username: username,
      userEmail: userEmail,
      eventId: eventId,
      eventName: event.name,
      date: event.date,
      time: event.time
    });

    await newBooking.save();

    res.json({ message: "Booking successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bookings for current user
app.get("/mybookings/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const bookings = await Booking.find({ userEmail: email });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// Cancel a booking
app.delete("/cancelbooking/:id", async (req, res) => {
    const bookingId = req.params.id;
    try {
        await Booking.findByIdAndDelete(bookingId);
        res.json({ message: "Booking canceled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.put("/updateevent/:id", async (req,res)=>{

let id = req.params.id;

let {date,time,location,price} = req.body;

await Event.findByIdAndUpdate(id,{
date,
time,
location,
price
});

res.json({message:"Event Updated Successfully"});

});






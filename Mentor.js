const mongoose = require("mongoose");


const mentorScheme= new mongoose.Schema({
    name:String,
    students:[{type:mongoose.Schema.Types.ObjectId,ref:"Student"}]
     
});

const Mentor=mongoose.model("Mentor",mentorScheme);

module.exports= Mentor;
const express =require('express');
const bodyparser=require('body-parser')
const mongoose=require('mongoose'); //import monges

//import models
const Mentor=require('./Mentor')
const Student=require('./Student')
const app=express();
const PORT=process.env.PORT
app.use(bodyparser.json());
const DB_URL = process.env.MONGO_URI

//connect to mongodb
mongoose
 .connect(DB_URL,{
 }).
  then(()=> console.log("Mongoose is connect")).
  catch((err)=>console.log("Mongoose is not connect",err)
);

//craete mentor
app.post('/mentor', async (req,res)=>{
    try {
        const mentor= new Mentor(req.body);
        await mentor.save();
        res.send(mentor);
    } catch (error) {
        res.status(400).send(error)
        
    }
});
//create student
app.post('/student', async (req,res)=>{
    try {
        const student= new Student(req.body);
        await student.save();
        res.send(student);
    } catch (error) {
        res.status(400).send(error)
        
    }
});

//Assign 
app.post('/mentor/:mentorId/assign', async (req,res)=>{
         try {
            const mentor=await Mentor.findById(req.params.mentorId);
            const students= await Student.find({'_id':{$in:req.body.students}});
            students.forEach(student=>{
                student.cMentor=mentor._id;
                student.save();
            });
            mentor.students=[
            ...mentor.students,
            ...students.map(student=>student._id),
            
            ];
            await mentor.save();
            res.send(mentor);
         } catch (error) {
            res.status(400).send(error)

         }
})
app.put('/student/:studentId/assignMentor/:mentorId', async (req,res)=>{
    try {
       const student=await Student.findById(req.params.studentId);
       const nMentor= await Mentor.findById(req.params.mentorId);
       if(student.cMentor){
        student.pMentor.push(student.cMentor);

       }
       student.cMentor=nMentor._id
       await student.save();
       res.send(student)
    } catch (error) {
       res.status(400).send(error)

    }
})

//show all student for particular mentor
app.get('/mentor/:mentorId/students', async (req,res)=>{
    try {
        const mentor= await Mentor.findById(req.params.mentorId).populate("students");
        res.send(mentor.students);
    } catch (error) {
        res.status(400).send(error)

    }
})
//show the previously assign mentor for particular mentor
app.get('/student/:studentId/pmentor', async (req,res)=>{
    try {
        const student= await Student.findById(req.params.studentId).populate("pMentor");
        res.send(student.pMentor);
    } catch (error) {
        res.status(400).send(error)

    }
})
app.listen(PORT,()=>{
    console.log("serveris running:",PORT);
    
});

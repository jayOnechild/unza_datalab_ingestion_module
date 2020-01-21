const express=require("express");
const mongoose= require("mongoose");
const bodyParser=require("body-parser");
const fileupload=require("express-fileupload");
const joi=require("joi");
var pdfUtil = require('pdf-to-text');


var apps=express();
var myId = mongoose.Types.ObjectId();

apps.use(express.static("public"));

apps.use(fileupload());

apps.use(bodyParser.urlencoded ({extended:true}));

apps.set("veiw engine", "ejs");

mongoose.connect("mongodb://localhost:27017/mylib", {
   useNewUrlParser:true
}, function(){
  console.log("Database connected sucessfully");
});


apps.get("/submission", (req, res)=>{
    
    res.render("submission.ejs");
});

apps.post("/submission", (req,res)=>{
    var data=req.body;    
    var pdffile=req.files.pdfupload;
  
    pdffile.mv("./public/pdf" + pdffile.name, (error)=>{
               
               if (error){
        console.log("couldn't upload the file");
        console.log(error);
    }
    
         else{

        console.log("file successfully uploaded"); 


    }
               });

     res.redirect("/metadata")             
});
     
var metaSchema=new mongoose.Schema({
      
      author:[String],	

      supervisor:[String],
      
      title: String,
 
      subject: String,
   
      publication: String,	
      
      studyLevel: String,
      
      pubType: String,
      
      school:String,
      
      message: String
});
//var Meta=mongoose.model("Meta", metaSchema, "metas");

let Meta=mongoose.model("Meta", metaSchema, "metas");

apps.get("/metadata", (req, res)=>{
    
   res.render("metadata.ejs"); 
});

apps.post("/metadata", (req, res)=>{
    var data=req.body;
    

    Meta.create({ 
      
      author: data.author,	

      supervisor:data.supervisor,
      
      title: data.title,
 
      subject: data.subject,
   
      publication:data.publication,	
      
      studyLevel: data.studyLevel,
      
      pubType: data.pubType,
      
      school: data.school,
      
      message: data.message
        
    }, (error, names)=>{
        
        if (error){
        console.log("failed to add to database")
        console.log(error)
    } 
    else{
        console.log("succesfully added to the database");
        console.log(names);

      res.redirect("/list") 
                    
   }    
   
    }
   
)}); 


apps.get("/list", (req, res)=>{

  Meta.find({}, (err, data)=>{

    if (err){
      console.log("There was reading data")
    }
    else{
      res.render('list.ejs', {namesList: data})
    }
  })
  })


 
apps.listen("3000", function(){
console.log("The Server is running");
});
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const { urlencoded } = require("body-parser");
const app=express();
const port=process.env.PORT || 3000;
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");



var html,css,js,code="";
app.get("/",(req,res)=>{
 res.render("index",{});
});
app.get("/answer",(req,res)=>{
  res.render("answer",{CODE:code});
});
app.post("/answer",(req,res)=>{
  html=req.body.html;
  css=req.body.css;
  js=req.body.js;
  code="<style>"+css+"</style>"+html+"<script>"+js+"</script>";
  res.redirect("/");
  res.render("answer",{CODE:code});
});


app.listen(port,()=>{
   console.log("Server running at port 3000");
})


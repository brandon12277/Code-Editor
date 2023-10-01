const express=require("express");
const session = require('express-session');
const bodyParser=require("body-parser");
const ejs=require("ejs");
const { urlencoded } = require("body-parser");
const app=express();
const port=process.env.PORT || 3000;
const database = require("./UserController.js")
const bcrypt = require("bcryptjs")
const shortid = require('shortid');


app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  
}));


var html,css,js;
//functions generic

function generateUniqueNumericID() {
  const alphanumericID = shortid.generate();
  const numericID = parseInt(alphanumericID, 36).toString().substr(0, 6);
  return numericID.padStart(6, '0');
}



// urls routes
app.get("/",(req,res)=>{
 res.render("home",{});
});

app.get('/register',(req,res)=>{
  res.render("register");
})
app.post('/register', (req, res) => {
  const {name, username, email,phone,password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  database.RegisterUser([name,username, email,phone,hashedPassword], (error) => {
    if (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.redirect('/login');
  });


});

app.get('/login',(req,res)=>{
  res.render("login");
})

// Login route
app.post('/login', (req, res) => {
  console.log("yes")
  const userDetails = req.body;
  console.log(userDetails)
  database.AuthenticateUser([userDetails.username], (error, results) => {
    if (error || results.length === 0 || !bcrypt.compareSync(userDetails.password, results[0].password)) {
      
     res.status(400)
     res.json({ error: 'Something went wrong.' });
    }
    else{
      req.session.userId = results[0].id;
      res.redirect('/dashboard');
    }
  // Create a JWT token
    
    
    
  });
});


app.get("/dashboard",(req,res)=>{
  if( req.session.userId){
    
    datatoSend={}

    database.FetchUserAndProjects([req.session.userId], 
      (error, results) => {
      if (error) {
        
       return res.send(error)
      }
      else{
        console.log(results)
       
         datatoSend["projects"]=results
      }
    },
   (error,results)=>{
    if (error) {
        
      return error
     }
     else{
      datatoSend["user"]=results[0]
      res.render("dashboard",{'datatoSend':datatoSend});
     }
   }

    );



   
  }
  
else
res.redirect('/login');

})


app.get("/userFetch",(req,res)=>{
  user_regex = req.body.user_regex
  if( req.session.userId){
    database.FetchUsers([user_regex],(error,results)=>{
      if(error) return res.send(error)
      res.send(results)
    })
  }
})

app.get("/dashboard/collaborations",(req,res)=>{
  if( req.session.userId){
    
    datatoSend={}

    database.FetchUserAndCollabs(req.session.userId, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    
       else{
        datatoSend["collabs"] = result
        return res.render("collabs",datatoSend)
       }
    },
    (err,result) =>{
      if (err) {
        console.error(err);
        return;
      }
    
       else{
        datatoSend["user"] = result[0]
       
       }
    }
);



   
  }
  
else
res.redirect('/login');

})

app.get("/:username/project",(req,res)=>{
  if( req.session.userId){
  const user = req.query.username
  const id= req.query.id
  database.RetrieveProjectForUser([Number(id)],(error,results)=>{
      if(error)res.send(error)
      else{
        console.log(results[0])
        const htmlContent = results[0].html
        const cssContent = results[0].css
        const jsContent = results[0].js
        console.log(htmlContent)
        return res.render("index",{htmlContent,cssContent,jsContent,project:results[0],link:'answer'})
    }
  })

 

  }
  else
res.redirect('/login');
});

app.get("/:username/Delete",(req,res)=>{
  if( req.session.userId){
  const user = req.query.username
  const id= req.query.id
  database.DeleteProject([Number(id)],(error,results)=>{
      if(error)res.send(error)
      else{
       
        return res.redirect("/dashboard")
    }
  })

 

  }
  else
res.redirect('/login');
});

app.get("/:username/projectCollab",(req,res)=>{
  if( req.session.userId){
  const user = req.query.username
  const id= req.query.id
  const project_name= req.query.project_name
  console.log(id)
  database.RetrieveCollaborationProject([Number(id),project_name],(error,results)=>{
      if(error)res.send(error)
      else{
        console.log(results[0])
        const htmlContent = results[0].html
        const cssContent = results[0].css
        const jsContent = results[0].js
        return res.render("index-collab",{htmlContent,cssContent,jsContent,project:results[0],link:'answerCollab'})
    }
  })

 

  }
  else
res.redirect('/login');
});


app.get("/:id/answer",(req,res)=>{
  id = req.params.id
  database.RetrieveProjectForUser([id],(error,results)=>{
    if(error)res.send(error)
    else{
      let code="<style>"+results[0].css+"</style>"+results[0].html+"<script>"+results[0].js+"</script>";
      return res.render("answer",{CODE:code});
  }
})
  
});
app.get("/:id/answerCollab",(req,res)=>{
  id = req.params.id
  database.RetrieveCollaborationProject([Number(id)],(error,results)=>{
    if(error)res.send(error)
    else{
      let code="<style>"+results[0].css+"</style>"+results[0].html+"<script>"+results[0].js+"</script>";
      return res.render("answer",{CODE:code});
  }
})
  
});

app.post("/:id/answerCollab",(req,res)=>{
  id = req.params.id
  console.log(id)
  html=req.body.html;
  css=req.body.css;
  js=req.body.js;
  let code="<style>"+css+"</style>"+html+"<script>"+js+"</script>";

  database.UpdateProjectForCollabUser([Number(id),html,css,js],(error,results)=>{
    if(error) res.send(error)
    else{
      console.log("done")
      res.render("answer",{CODE:code});
  }
  })
 
});
app.get("/:username/findproject",(req,res)=>{
  user_id = req.query.user_id
  proj_name=req.query.project_name;
  if(proj_name=="" || proj_name===undefined)res.send("")
 console.log(user_id,proj_name)
  database.GetProjectsAndUsersForList([Number(user_id),proj_name],(error,results)=>{
    if(error) res.send(error)
    else{
  console.log(results)
      res.send(results);
  }
  })
 
});

app.get("/addProject1516302295",(req,res)=>{
  if( req.session.userId){
    const user_name=req.query.user_name
    console.log(user_name)
    const uniqueShortID = generateUniqueNumericID()
    database.AddProjectForUser([uniqueShortID,req.session.userId],(error,results)=>{
      if(error) res.send(error)
      else{
         res.redirect("/"+user_name+"/project?id="+uniqueShortID+"&username="+user_name)
    }
    })
  
    }
    else
   res.redirect('/login');
})

app.post("/:username/addCollabproject",(req,res)=>{
   let proj_id = req.body.proj_id;
   
   console.log(req.session.userId,req.body.proj_id)
   database.AddCollabProjectForUser([Number(proj_id),Number(req.session.userId)],(error,results)=>{
         if(error) res.send(error)
         else
         res.redirect("/dashboard/collaborations")
   })
})
app.post("/:id/AddRequest",(req,res)=>{
  let proj_id = req.body.proj_id;
  let title = req.body.title;
   let desc = req.body.description;
   console.log(proj_id,title,desc)
  database.AddRequest([Number(proj_id),Number(req.session.userId),title,desc],(error,results)=>{
        if(error) res.send(error)
        else
        res.send(results)
  })
});

app.get("/dashboard/change_requests",(req,res)=>{
  if(req.session.userId){
   datatoSend={}
   database.RetrieveRequests([req.session.userId],(err,result)=>{
     datatoSend["requests"] = result;
   },
   (err,result)=>{
    datatoSend["user"] = result[0];
    res.render("requests",datatoSend)
   }
   )
  }
  else{
    res.redirect("/login")
  }
})
app.get("/dashboard/change_requests/:collabId",(req,res)=>{
  if(req.session.userId){
    let collabId = req.params.collabId
   
   database. RetrieveChangesandOriginal([Number(collabId),req.session.userId],(err,result)=>{
    edited_html = result.c_html
    edited_css = result.c_css
    edited_js = result.c_js

    html = result.html
    css = result.css
    js = result.js
     res.render("review",{edited_html,edited_css,edited_js,html,css,js,result})
   }
   )
  }
  else{
    res.redirect("/login")
  }
})

app.post("/:id/AcceptRequest",(req,res)=>{
  if(req.session.userId){
    collab_id = req.body.collab_id
    id = req.params.id
   datatoSend={}
   database.ProcessRequest([Number(collab_id),Number(id)],(err,result)=>{
    if(err)res.send(err)
    else
    res.send(result)
   }
  
   )
  }
  else{
    res.redirect("/login")
  }
})
app.get("/:id/DeleteRequest",(req,res)=>{
  if(req.session.userId){

    id = req.params.id
   datatoSend={}
   database.DeleteRequest([Number(id)],(err,result)=>{
    if(err)res.send(err)
    else
    res.redirect("/dashboard/change_requests")
   }
  
   )
  }
  else{
    res.redirect("/dashboard/change_requests")
  }
})


app.post("/:id/answer",(req,res)=>{
  id = req.params.id
 
  html=req.body.html;
  css=req.body.css;
  js=req.body.js;
  project_name = req.body.project_name
  let code="<style>"+css+"</style>"+html+"<script>"+js+"</script>";

  database.UpdateProjectForOrgUser([project_name,id,html,css,js],(error,results)=>{
    if(error) res.send(error)
    else{
      res.render("answer",{CODE:code});
  }
  })
 
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
   
    res.redirect('/'); // Replace with the appropriate route or action
  });
});

app.listen(port,()=>{
   console.log("Server running at port 3000");
})


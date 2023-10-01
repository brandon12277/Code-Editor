// userController.js
const db = require('./db');

module.exports = {
    FetchUsers : ([name_regex],callback) =>{
      const query = 'SELECT * FROM users WHERE username LIKE ?';
      db.query(query, [name_regex], callback);
    },
    RegisterUser: ([name,username, email,phone,hashedPassword],callback) => {
        const query = 'INSERT INTO users (username,name, email,phone, password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [username,name,email,phone,hashedPassword], callback);
      },
      AuthenticateUser: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], callback);
      },
      FetchUserAndProjects: (userId, callback1,callback2) => {
        const query1 = 'SELECT * FROM projects WHERE user_id = ?';
        db.query(query1, [userId], callback1);
        const query2 = 'SELECT * FROM users WHERE id = ?';
        db.query(query2, [userId], callback2);
      },
      FetchUserAndCollabs: (userId, callback,callback1) => {
          // Query to get collaborations
  const user = 'SELECT * FROM users WHERE id = ?';
  db.query(user, [userId], callback1);
  const collaborationsQuery = `SELECT * FROM collaborations WHERE collab_id = ?`;

  db.query(collaborationsQuery, [userId],(err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    const data = [];
    if(results.length === 0 )callback(null,data);
    // Loop through collaborations and retrieve project info and username
    for (const collaboration of results) {
      const usernameQuery = `SELECT username FROM users WHERE id = ?`;
      const projectQuery = `SELECT * FROM projects WHERE id = ?`;

      // Query to get username
      db.query(projectQuery, [collaboration.project_id], (err, projectResult) => {
        if (err) {
          callback(err, null);
          return;
        }
          console.log(projectResult[0])
        // Query to get project name
        db.query(usernameQuery, [projectResult[0].user_id], (err, userResult) => {
          if (err) {
            callback(err, null);
            return;
          }

          // Create an object with the username and project name
          const item = {
            username: userResult[0].username,
            projectName: projectResult[0].project_name,
            collab_id : collaboration.id,
            project_id : projectResult[0].id
          };

          // Push the object into the data array
          data.push(item);

          // Check if we have retrieved all data
          if (data.length === results.length) {
            callback(null, data);
          }
        });
      });
    }
  });
      },
      AddProjectForUser: ([id,userId], callback) => {
        const query = 'INSERT INTO projects (id,user_id,project_name,html,css,js) VALUES (?,?,?,?,?,?)';
        db.query(query, [id,userId,"Untitled","","",""], callback);
      },
      AddCollabProjectForUser: ([proj_id,userId], callback) => {
        const query = 'SELECT * FROM collaborations WHERE project_id =? and collab_id =?';
        db.query(query, [proj_id,userId,"","",""], (err,result)=>{
           if(err)res.send(err)
           else{
                 console.log(result)
                 if(result.length==0){
                  const query1 = 'INSERT INTO collaborations (collab_id,project_id,c_html,c_css,c_js) VALUES (?,?,?,?,?)';
                     db.query(query1, [userId,proj_id,"","",""], callback);
                 }
  
           }
        });
        
      },
      RetrieveProjectForUser: (id, callback) => {
        const query = 'SELECT * from projects WHERE id = ?';
        db.query(query, [id], callback);
      },
      UpdateProjectForOrgUser: ([project_name,id,html,css,js], callback) => {
        const query = 'UPDATE projects SET project_name= ?,html= ?,css= ?,js= ? WHERE id= ?';
        db.query(query, [project_name,html,css,js,id], callback);
      },
      UpdateProjectForCollabUser: ([id,html,css,js], callback) => {
        const query = 'UPDATE collaborations SET c_html= ?,c_css= ?,c_js= ? WHERE project_id= ?';
        db.query(query, [html,css,js,id], callback);
      },
      RetrieveCollaborationProject : ([id,project_name],callback) =>{
        const query = 'SELECT * from collaborations WHERE project_id = ?';
        db.query(query, [id], (err,result)=>{
          console.log(result)
              if(result[0].c_html == "" && result[0].c_css == "" && result[0].c_js == ""){
                const query1 = 'SELECT * from projects WHERE id = ?';
                db.query(query1, [id], (err,result)=>{
                  const query2 = 'UPDATE collaborations SET c_html= ?,c_css= ?,c_js= ? WHERE project_id= ?';
                  db.query(query2, [result[0].html,result[0].css,result[0].js,id], (err,result)=>{
                    if(err);
                    else{
                      const query = 'SELECT * from collaborations WHERE project_id = ?';
                      db.query(query, [id], (err,result)=>{
                        if(err);
                        callback(err,[{"html":result[0].c_html,"css":result[0].c_css,"js":result[0].c_js,
                        "project_name":project_name,"id":result[0].project_id}])
                      })
                    }
                  });
                })
              }
              else{
              
                  callback(err,[{"html":result[0].c_html,"css":result[0].c_css,"js":result[0].c_js,
                        "project_name":project_name,"id":result[0].project_id}])
              }
        });
      },
      GetProjectsAndUsersForList : ([user_id,proj_name],callback) =>{
        const data= []
        console.log(user_id,proj_name)
        proj_name=proj_name+"%"
      let query = 'SELECT * FROM projects WHERE project_name LIKE ? and user_id != ?';
      db.query(query,[proj_name,user_id],(err,result)=>{
        console.log(result)
           for(const project of result){
            let query = 'SELECT * from users WHERE id = ?';
            db.query(query,[Number(project.user_id)],(err,results)=>{
              console.log(results)
              data.push({"username":results[0].username,"project_name":project.project_name
              ,"proj_id":project.id})

              if (data.length === result.length) {
                callback(null, data);
              }
            })
           
           }
         
      })
      },
      AddRequest : ([proj_id,user_id,title,description],callback) =>{
        let query = 'SELECT * from projects WHERE id = ?';
        db.query(query,[proj_id],(err,project_result)=>{
          if(err)res.send(err)
          else{
           
            let query = 'SELECT * from collaborations WHERE collab_id = ? and project_id = ?'
            db.query(query,[user_id,proj_id],(err,collab_result)=>{
              if(err)res.send(err)
              else{
               
                let query = 'INSERT into requests (user_id,collaboration_id,title,description) VALUES(?,?,?,?)';
                db.query(query,[project_result[0].user_id,collab_result[0].id,title,description],callback);
            }
            })
           
        }
        });
            
      },
      RetrieveRequests: ([userId],callback,callback1)=>{
        const query = 'SELECT * from requests WHERE user_id = ?';
        db.query(query,[userId],callback)
        const query1 = 'SELECT * from users WHERE id = ?';
        db.query(query1,[userId],callback1)
      },
      ProcessRequest: ([collab_id,id],callback)=>{
        const query = 'DELETE FROM requests WHERE id =?'
        db.query(query,[id],(err,result)=>{
            if(err)res.send(err)
            else{

              const query = 'SELECT * FROM collaborations WHERE id = ?'
              db.query(query,[collab_id],(err,result)=>{
                if(err)res.send(err)
                else{
    
                  const query = 'UPDATE projects SET html= ?,css= ?,js= ? WHERE id= ?'
                  db.query(query,[result[0].c_html,result[0].c_css,result[0].c_js,result[0].project_id],(err,res)=>{
                    const query = 'DELETE FROM collaborations WHERE id = ?'
                   db.query(query,[collab_id],callback)
                  })
                  
              }
            })
          }
        });
      },
      RetrieveChangesandOriginal : ([collabId,userId],callback)=>{
        const query = 'SELECT * FROM collaborations WHERE id = ?'
        let data = {}
        db.query(query,[collabId],(err,result)=>{
          if(err)res.send(err)
          else{
            const query = 'SELECT * FROM projects WHERE id = ?'
            data["c_html"] = result[0].c_html
            data["c_css"] = result[0].c_css
            data["c_js"] = result[0].c_js
            db.query(query,[result[0].project_id],(err,result)=>{
              const query = 'SELECT * FROM users WHERE id = ?'
            data["html"] = result[0].html
            data["css"] = result[0].css
            data["js"] = result[0].js
            db.query(query,[userId],(err,result)=>{
              data["user"]=result[0];
              callback(err,data);
            })
           
            })
            
        }
      })
      },
      DeleteProject : ([id],callback)=>{
        const query = 'DELETE FROM collaborations WHERE project_id = ?'
        db.query(query,[id],(err,result)=>{
          const query = 'DELETE FROM projects WHERE id = ?'
          db.query(query,[id],callback)
        })
       
      },
      DeleteRequest : ([id],callback)=>{
        const query = 'DELETE FROM requests WHERE id = ?'
        db.query(query,[id],callback)
       
      }
    
  
};

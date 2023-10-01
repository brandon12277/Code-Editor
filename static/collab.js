


function FindProjects(event) {
event.preventDefault();
document.getElementById("projects-list").style.display="flex";


project_name = document.getElementById("project-finder").value
let url = '/'+datatoSend.user.username+'/findproject?user_id='+datatoSend.user.id+'&project_name='+project_name;
$.ajax({
  type:'GET',
  url: url,
  
  success:function(data){
    document.getElementById("projects-list").style.display="flex";
    document.getElementById("projects-list").innerHTML=""
    console.log(data)
   
    for(const project of data){
        document.getElementById("projects-list").innerHTML+=`<button onclick="CollaborateWith(event,${project.proj_id})" id="project-list-buttons" class="projects-list-buttons"><i id="block-logo" class="fa-solid fa-diagram-project"></i>`+project.project_name+`<span style="color:rgb(194, 194, 194);font-size:small;">Created by`+project.username+`</span>`+`</button>`;
}
          }
  });
}

function CollaborateWith(event,proj_id) {
  event.preventDefault();
  
  console.log(proj_id)
  
  let url = '/'+datatoSend.user.username+'/addCollabproject';
  $.ajax({
    type:'POST',
    data:
      {
          proj_id:proj_id,
      },
    url: url,
    success:function(data){
      console.log(data)
        window.location.reload()
            }
    });
  }




// editor for html

console.log(project)



var editor_html = ace.edit("first_editor");
editor_html.setTheme("ace/theme/monokai");

editor_html.session.setMode("ace/mode/html");
editor_html.setShowPrintMargin(false);
//editor for css
var editor_css = ace.edit("sec_editor");
editor_css.setTheme("ace/theme/monokai");
editor_css.session.setMode("ace/mode/css");
editor_css.setShowPrintMargin(false);
//editor for js
var editor_js = ace.edit("third_editor");
editor_js.setTheme("ace/theme/monokai");
editor_js.session.setMode("ace/mode/javascript");
editor_js.setShowPrintMargin(false);


var initialTheme='<i class="fas fa-sun logo-theme"></i>';
let resizeObserver = new ResizeObserver(() => {
  
  var rect=document.getElementById("editor_element").getBoundingClientRect();
  var height=document.getElementById("editor_element").style.height;
  document.getElementById("out_elem").style.height=window.innerHeight-rect.height+"px";
});



var check=$(".editor")[0];
resizeObserver.observe(check)
  var myHTML,myCSS,myJS;
  var startup=0;
  editor_html.setAutoScrollEditorIntoView(true);
  editor_js.setAutoScrollEditorIntoView(true);
  editor_css.setAutoScrollEditorIntoView(true);



function myFunction(event,link) {
  event.preventDefault();
myHTML = editor_html.getSession().getValue();
myJS = editor_js.getSession().getValue();
myCSS = editor_css.getSession().getValue();
  document.getElementById("output_html").innerHTML=myHTML;
  document.getElementById("output_css").innerHTML=myCSS;
  document.getElementById("output_js").innerHTML=myJS;
  
  project_name = document.getElementById("block-head").innerHTML
  let url = '/'+project.id+'/'+link;
  $.ajax({
    type:'POST',
    url: url,
    data:
    {
        project_name : project_name,
        html:myHTML,
        css:myCSS,
        js:myJS
    },
    success:function(){
        console.log("hello bitch")
        document.getElementById('out_elem').contentDocument.location.reload(true);
            }
    });
  }

  



function LoadPage(){
  
  var html_page_load=project.html;
  editor_html.session.insert({0:0,1:0},html_page_load);
  var css_page_load=project.css;
  editor_css.session.insert({0:0,1:0},css_page_load);
  var js_page_load=project.js;
  editor_js.session.insert({0:0,1:0},js_page_load);


  // $.ajax({
  //   type:'POST',
  //   url: url,
  //   data:
  //   {
  //       html:html_page_load,
  //       css:css_page_load,
  //       js:js_page_load
  //   },
  //   success:function(){
  //       document.getElementById('out_elem').contentDocument.location.reload(true);
  //           }
  //   });
}

var theme=document.getElementById("theme");



   
  
   
  






//editor for html



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



let resizeObserver = new ResizeObserver(() => {
  var rect=document.getElementById("editor_element").getBoundingClientRect();
  var height=document.getElementById("editor_element").style.height;
  document.getElementById("out_elem").style.height=window.innerHeight-rect.height+"px";
  if(document.getElementById("theme").innerHTML=='<i class="fas fa-sun logo-theme"></i>'){
  editor_html.setTheme("ace/theme/monokai");
  editor_css.setTheme("ace/theme/monokai");
  editor_js.setTheme("ace/theme/monokai");
  }
  else{
    editor_html.setTheme("ace/theme/tomorrow");
  editor_css.setTheme("ace/theme/tomorrow");
  editor_js.setTheme("ace/theme/tomorrow");
  }
});



var check=$(".editor")[0];
resizeObserver.observe(check)
  var myHTML,myCSS,myJS;
  var startup=0;
  editor_html.setAutoScrollEditorIntoView(true);
  editor_js.setAutoScrollEditorIntoView(true);
  editor_css.setAutoScrollEditorIntoView(true);
function myFunction(event) {
myHTML = editor_html.getSession().getValue();
myJS = editor_js.getSession().getValue();
myCSS = editor_css.getSession().getValue();
  document.getElementById("output_html").innerHTML=myHTML;
  document.getElementById("output_css").innerHTML=myCSS;
  document.getElementById("output_js").innerHTML=myJS;
  $.ajax({
    type:'POST',
    url:'/answer',
    data:
    {
        html:myHTML,
        css:myCSS,
        js:myJS
    },
    success:function(){
        document.getElementById('out_elem').contentDocument.location.reload(true);
            }
    });
  }
function LoadPage(){
  
  var html_page_load="<div class='Online_Code_Editor_Intro'>\n<h1>WELCOME TO ONLINE CODE EDITOR</h1>\n<h2>A FREE ONLINE CODE EDITOR FOR WEB DESIGN</h2>\n <h3>EASY TO USE</h3>\n</div>";
  editor_html.session.insert({0:0,1:0},html_page_load);
  var css_page_load="html{\nwidth:100%;\nheight:100%;\n}\nbody{background-color:white;}\n.Online_Code_Editor_Intro{\nwidth:100%;\nheight:100%;\ntext-align:center;\ncolor:black;\nfont-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;\nbackground-color: white;\n}";
  editor_css.session.insert({0:0,1:0},css_page_load);
  var js_page_load="function Online_Editor(){\nconsole.log('WELCOME TO ONLINE CODE EDITOR');\n}";
  editor_js.session.insert({0:0,1:0},js_page_load);
  $.ajax({
    type:'POST',
    url:'/answer',
    data:
    {
        html:html_page_load,
        css:css_page_load,
        js:js_page_load
    },
    success:function(){
        document.getElementById('out_elem').contentDocument.location.reload(true);
            }
    });
}

var theme=document.getElementById("theme");

document.getElementById("theme").addEventListener("click",()=>{
  myFunction();
  if(document.getElementById("theme").innerHTML=='<i class="fas fa-sun logo-theme"></i>'){
 
  editor_html.setTheme("ace/theme/tomorrow");
  editor_css.setTheme("ace/theme/tomorrow");
  editor_js.setTheme("ace/theme/tomorrow");
  $(".navbar").css("background-color","#dcdcdc");
  $(".editor").css("background-color","white");
  $(".heading_name").css("background-color","#dcdcdc");
  $(".bottom_level").css("background-color","#dcdcdc");
  $(".heading_name").css("color","black");
  document.querySelector(".main_logo").src="/logo-day.png";
  document.getElementById("theme").innerHTML='<i class="fas fa-moon logo-theme"></i>';
  }
  else{
    
    editor_html.setTheme("ace/theme/monokai");
    editor_css.setTheme("ace/theme/monokai");
    editor_js.setTheme("ace/theme/monokai");
    $(".navbar").css("background-color","#171f22");
    $(".editor").css("background-color","#2c2b2b");
    $(".heading_name").css("background-color","#171f22");
    $(".bottom_level").css("background-color","#171f22");
    $(".heading_name").css("color","white");
    document.querySelector(".main_logo").src="/logo-night.png";
    document.getElementById("theme").innerHTML='<i class="fas fa-sun logo-theme"></i>';
  }
});

 
    


   
  
   
  




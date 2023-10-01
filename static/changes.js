//for original html code








var editor_org_html = ace.edit("original_html_editor");
editor_org_html.setTheme("ace/theme/monokai");

editor_org_html.session.setMode("ace/mode/html");
editor_org_html.setShowPrintMargin(false);

//for edited html code

var editor_edi_html = ace.edit("edited_html_editor");
editor_edi_html.setTheme("ace/theme/monokai");
editor_edi_html.session.setMode("ace/mode/html");

editor_edi_html.setShowPrintMargin(false);

//editor for original css

var editor_org_css = ace.edit("original_css_editor");
editor_org_css.setTheme("ace/theme/monokai");
editor_org_css.session.setMode("ace/mode/css");
editor_org_css.setShowPrintMargin(false);
//editor for edited css
var editor_edi_css = ace.edit("edited_css_editor");
editor_edi_css.setTheme("ace/theme/monokai");
editor_edi_css.session.setMode("ace/mode/css");
editor_edi_css.setShowPrintMargin(false);
//editor for original js
var editor_org_js = ace.edit("original_js_editor");
editor_org_js.setTheme("ace/theme/monokai");
editor_org_js.session.setMode("ace/mode/javascript");
editor_org_js.setShowPrintMargin(false);
//editor for edited js
var editor_edi_js = ace.edit("edited_js_editor");
editor_edi_js.setTheme("ace/theme/monokai");
editor_edi_js.session.setMode("ace/mode/javascript");
editor_edi_js.setShowPrintMargin(false);





function findEditedRange(org, edited) {
  const orgLines = org.split('\n');
  const editedLines = edited.split('\n');
  const numLines = Math.min(orgLines.length, editedLines.length);
  
  let startLine = 0;
  let endLine = numLines;
  
  while (startLine < numLines && orgLines[startLine] === editedLines[startLine]) {
    startLine++;
  }
  
  while (endLine > startLine && orgLines[endLine - 1] === editedLines[endLine - 1]) {
    endLine--;
  }
  
  const startCol = orgLines[startLine]?.length || 0;
  const endCol = orgLines[endLine - 1]?.length || 0;
  
  return {
    start: { row: startLine, column: startCol },
    end: { row: endLine - 1, column: endCol }
  };
}

const range = findEditedRange(encodedOrgHtmlData, encodedEdiHtmlData);
const range1 = findEditedRange(encodedOrgcssData, encodedEdicssData);
const range2 = findEditedRange(encodedOrgjsData, encodedEdijsData);
const Range = ace.require("ace/range").Range;
  
  // Create a marker for the edited text


const rangeHtml = new Range(range.start.row, range.start.column, range.end.row, range.end.column);
const rangecss = new Range(range1.start.row, range1.start.column, range1.end.row, range1.end.column);
const rangejs = new Range(range2.start.row, range2.start.column, range2.end.row, range2.end.column);




function LoadPage(){




editor_org_html.session.insert({0:0,1:0},encodedOrgHtmlData);
editor_edi_html.session.insert({0:0,1:0},encodedEdiHtmlData);
console.log(rangeHtml,rangecss,rangejs)


editor_edi_html.session.addMarker(rangeHtml, "edited-text-marker", "text");



editor_org_css.session.insert({0:0,1:0},encodedOrgcssData);
editor_edi_css.session.insert({0:0,1:0},encodedEdicssData);

editor_edi_css.session.addMarker(rangecss, "edited-text-marker", "text");
editor_org_js.session.insert({0:0,1:0},encodedOrgjsData);
editor_edi_js.session.insert({0:0,1:0},encodedEdijsData);

editor_edi_js.session.addMarker(rangejs, "edited-text-marker", "text");



}
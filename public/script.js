$(function() {
 $( "#datepicker-13" ).datepicker();
 //$( "#datepicker-13" ).datepicker("show");
});

$(function() {
 $( "#datepicker-14" ).datepicker();
 //$( "#datepicker-14" ).datepicker("show");
});

function w3_open() { document.getElementById("mySidebar").style.display = "block";   }
function w3_close() { document.getElementById("mySidebar").style.display = "none";   }

              function myAccFunc() {
               var x = document.getElementById("demoAcc");
               if (x.className.indexOf("w3-show") == -1) {
                 x.className += " w3-show";
                 x.previousElementSibling.className += " w3-green";
               } else {
                 x.className = x.className.replace(" w3-show", "");
                 x.previousElementSibling.className =
                 x.previousElementSibling.className.replace(" w3-green", "");}}

     function myAccFunc1() {
    var x = document.getElementById("demoAcc1");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
      x.previousElementSibling.className += " w3-green";
    } else {
      x.className = x.className.replace(" w3-show", "");
      x.previousElementSibling.className =
      x.previousElementSibling.className.replace(" w3-green", "");
  }}

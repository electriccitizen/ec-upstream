"use strict";(function(a,b){//Pop-up content functionality.
b.behaviors.modal={attach:function attach(b){a(".modal",b).once("modalContent").each(function(){console.log("modals exist");//set the variable needed to keep the modal controls specific
var b=a(".modal-lead",this).attr("data-attribute-id");console.log(b),a(".modal-wrapper",this).appendTo(".overflow-guard"),window.addEventListener("load",function(){//close when the modal window is clicked out side of the content
//close when the close button is clicked
function d(){e.classList.add("close-modal"),setTimeout(function(){e.classList.remove("close-modal","active-modal")},1200)}//open the modal
//set the controls for this specific modal
var e=c("modal-outer-"+b),f=c("modal-trigger-"+b),g=c("modal-inner-"+b),h=c("modal-close-"+b);//set the click functions
e.addEventListener("click",function(){e.classList.add("close-modal"),setTimeout(function(){e.classList.remove("close-modal","active-modal")},1200)}),f.addEventListener("click",function(){if(e.classList.add("active-modal"),0!=g.getElementsByTagName("form").length)g.getElementsByTagName("form")[0].getElementsByTagName("input")[0].focus();else{var a=e.getElementsByTagName("dialog")[0];a.focus()}}//prevent close when the modal inner content is clicked
),g.addEventListener("click",function(a){return a.stopPropagation(),a.stopImmediatePropagation(),!1}),h.addEventListener("click",d),a(document).keydown(function(a){27==a.keyCode&&d()})});var c=document.getElementById.bind(document),d=document.querySelector.bind(document)})}}})(jQuery,Drupal);
//# sourceMappingURL=modals.js.map

"use strict";(function(a,b){/* DRAWERS (SHOW MORE)
------------------------------------ */b.behaviors.drawerAbove={attach:function attach(b){a(".drawer-toggle.drawer-above",b).once("modal_window").each(function(){a(this).click(function(b){if(b.preventDefault(),a(this).closest(".field").hasClass("field-dates"))var c="dates";else var c="links";a(this).is(".active-drawer")?a(this).prev(".drawer-content").slideUp(300).attr("aria-hidden","true").removeClass("open-drawer").end().text("See all "+c).removeClass("active-drawer").attr("aria-expanded","false"):a(this).prev(".drawer-content").slideDown(300).attr("aria-hidden","false").addClass("open-drawer").end().text("See fewer "+c).addClass("active-drawer").attr("aria-expanded","true")})})}},b.behaviors.drawerBelow={attach:function attach(b){a(".drawer-toggle.drawer-below",b).once("modal_window").each(function(){a(this).click(function(b){if(b.preventDefault(),a(this).closest(".field").hasClass("field-dates"))var c="dates";else var c="links";a(this).is(".active-drawer")?a(this).next(".drawer-content").slideUp(300).attr("aria-hidden","true").removeClass("open-drawer").end().text("See all "+c).removeClass("active-drawer").attr("aria-expanded","false"):a(this).next(".drawer-content").slideDown(300).attr("aria-hidden","false").addClass("open-drawer").end().text("See fewer "+c).addClass("active-drawer").attr("aria-expanded","true")})})}}})(jQuery,Drupal);
//# sourceMappingURL=drawers.js.map

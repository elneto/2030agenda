$(document).scroll(function() {
  if ($(this).scrollTop() > 80) {
    $(".unLogo").attr("class", "unLogo_small");
    $("#desaLogo").attr("id", "desaLogoSmall");
    $(".oceanLogo").attr("class", "oceanLogo_small");
    $(".unTitle").attr("class", "unTitle_small");
    $(".unSubTitle").attr("class", "unSubTitle_small");
    $(".unSubTitle").attr("class", "unSubTitle_small");
    $(".menuBottomArea").attr("class", "menuBottomArea_small");
    $("#menuBarArea").attr("class", "menuBarArea_small");
    $("#topBarArea").attr("class", "topBarArea_small");
    $("#menuBarArea_sub").attr("class", "menuBarArea_sub_small");
    $("#icons").attr("class", "icons_small");
    $(".top").hide();
  }
});
$(document).scroll(function() {
  if ($(this).scrollTop() < 80) {
    $(".unLogo_small").attr("class", "unLogo");
    $("#desaLogoSmall").attr("id", "desaLogo");
    $(".oceanLogo_small").attr("class", "oceanLogo");
    $(".unTitle_small").attr("class", "unTitle");
    $(".unSubTitle_small").attr("class", "unSubTitle");
    $(".menuBottomArea_small").attr("class", "menuBottomArea");
    $("#icons").attr("class", "icons");
    $("#topBarArea").attr("class", "topBarArea");
    $("#menuBarArea").attr("class", "menuBarArea");
    $("#menuBarArea_sub").attr("class", "menuBarArea_sub");
    $(".top").show();
  }
});
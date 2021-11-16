"use strict"

$(".size a, .color a, .dest a").click((e) => {
	e.preventDefault();
});


$(".small-img").each((index, el) => {
	$(el).click(() => {
		$(".main-image").css("background-image", `url(${$(el).attr("data-src")})`);
	});
});

$(".main-image").click(() => {
	$(".main-image").attr("data-src", $(".main-image").attr("data-original"));

	 $("[data-src]").each(function(index, el) {
        $(el).css("background-image", "url(" + $(el).attr("data-src") + ")");
    });
});

$(".color a").click((e) => {
	$(".color a").removeClass("selected-details");
	$(e.target).addClass("selected-details");
});

$(".size a").click((e) => {
	$(".size a").removeClass("selected-details");
	$(e.target).addClass("selected-details");
});

$(".dest a").click((e) => {
	$(".dest a").removeClass("selected-dest");
	$(e.target).addClass("selected-dest");
});
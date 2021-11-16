"use strict"

$("aside").height($(".fullScreen-resp").height())
$(".support-container").css("transform", `translateY(-${$(".card").height()}px)`)

let offsetTop;
offsetTop = $(window).width() > 1024 ? "-50%" : "-100px";

if($(window).width() < 1024 && $(window).height() <= 580) {
	offsetTop = "-15%";
}

$(window).resize(() => {
	$(".support-container").css("transform", `translateY(-${$(".card").height()}px)`)
	offsetTop = $(window).width() > 1024 ? "-50%" : "-100px";

	if($(window).width() < 1024 && $(window).height() <= 580) {
		offsetTop = "-15%";
	}
})

class Controller {
	// ...[String] -> [Object(s)]
	constructor(pult) {
		this.pult = $(pult);
		this.currentBlock = null;
	}

	animate(block) {
		block = $(block)

		if(!this.currentBlock) {
			this.pult.find(".card").animate({marginTop: offsetTop}, 500, () => {
				block.show();
				block.animate({opacity: 1}, 400);
				block.addClass("getIn");

				$("aside").height($(".fullScreen-resp").height())
				this.currentBlock = block;
			});
		} else if(block.html() == this.currentBlock.html()) return
		else {
			this.currentBlock.removeClass("getIn");
			this.currentBlock.animate({opacity: 0}, 500, () => {
				this.currentBlock.hide()
				block.show();
				block.animate({opacity: 1}, 400);
				block.addClass("getIn");

				$("aside").height($(".fullScreen-resp").height())
				this.currentBlock = block;
			});
		}

	}

	resetSelection(el) {
		if(this.currentBlock) $(".selected").removeClass("selected")
		el.addClass("selected")
	}
}

let pult = new Controller(".support-container", ".faq-seperate", ".contactInfo-seperate", ".contactUs-seperate");

$(".selection li").click(e => {
	pult.resetSelection($(e.target))
	pult.animate($(e.target).attr("data-select"))
})

// Functionality of FAQ blocks
$(".option-block").click(e => {
	e.stopImmediatePropagation();
	if($(e.target).closest(".option-block").find(".fa").hasClass("fa-plus-square")) {
		$(e.target).closest(".option-block").find(".fa").removeClass("fa-plus-square")
		$(e.target).closest(".option-block").find(".fa").addClass("fa-minus-square")

		$(e.target).closest(".option-block").find(".answer").show().animate({opacity: 1}, 400, () => {
			$("aside").height($(".fullScreen-resp").height())
		})
	} else {
		$(e.target).closest(".option-block").find(".fa").removeClass("fa-minus-square")
		$(e.target).closest(".option-block").find(".fa").addClass("fa-plus-square")

		$(e.target).closest(".option-block").find(".answer").animate({opacity: 0}, 400, () => {
			$(e.target).closest(".option-block").find(".answer").hide()
			$("aside").height($(".fullScreen-resp").height())
		})
	}
	
})

// Form input value validation
$("form button").click((e) => {
	$(".error-handler").html("").hide();
	$(".text-field").css("border-color", "#000")

	for(let i = 0; i < $(".text-field").length; i++) {
		if($(".text-field").eq(i).val() === "") {
			e.preventDefault();
			$(".error-handler").html("Please, fill in all the fields").show();
			$(".text-field").eq(i).css("border-color", "red")
		} 
	}
})
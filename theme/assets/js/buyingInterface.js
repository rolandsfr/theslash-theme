"use strict"

$(".size a, .color a, .dest a").click((e) => {
	e.preventDefault();
});

// Main image block changes url to the one that has a small image that was clicked by the user
$(".small-img").each((index, el) => {
	$(el).click(() => {
		$(".main-image").css("background-image", `url(${$(el).attr("data-src")})`);
	});
});

// Resets main image when user clicks on the block
$(".main-image").click(() => {
	$(".main-image").attr("data-src", $(".main-image").attr("data-original"));

	 $("[data-src]").each(function(index, el) {
        $(el).css("background-image", "url(" + $(el).attr("data-src") + ")");
    });
});

let destType;

$(".finish-btn").click((e) => {
	$(".dialog-handler").hide();

	if($(".modal-window").find(".isActive").length == 2) {
		// You code that redirects user to the page when all neccessary information is gathered and user can purchase the product
	} else {
		// If some information is missing - shows an error
		$(".dialog-handler").show();
	}
});

// Toggling active and inactive classes
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

$(".ad-option").first().click((e) => {
	$(e.target).addClass("selected-dest");
	$(e.target).html("Added to wishlist")
});

$(".ad-option").last().click((e) => {
	$(e.target).addClass("selected-dest");
	$(e.target).html("Added to collection")
});

let sizeSelected = false, 
	colorSelected = false,
	destinationType;

let address = "", method = ""; // initializing variables where we're going to store the address & payment method that user has chosen

$(".buy-btn").click((e) => {
	address = "", method = "";
	sizeSelected = false;
	colorSelected = false;
	$(".buy-error-handler").html("").hide();
	$(".dest-error").hide();

	// Reseting sections
	$(".payment-section").animate({opacity: 0}, 400, () => {
		$(".payment-section").hide();
		$(".dest-section").show().animate({opacity: 1}, 400);
	})

	// And modal navigation
	$(".modal-navigation a").removeClass("activeNode");
	$('[data-target="dest-section"]').addClass("activeNode");


	for(let i = 0; i < $(".color a").length; i++) {
		if($(".color a").eq(i).hasClass("selected-details")) {
			colorSelected = true;
		}
	}

	for(let i = 0; i < $(".size a").length; i++) {
		if($(".size a").eq(i).hasClass("selected-details")) {
			sizeSelected = true;
		}
	}

	if(sizeSelected && colorSelected) {
		// Success step 1
		$(".buy-error-handler").html("").hide();	

			if($(".dest a").hasClass("selected-dest")) {
				destinationType = $(".dest a.selected-dest").html();
				// Success step - allows to open payment modal
				$(".proccess-modal").show().animate({opacity: 1}, 600, () => {
					$(".modal-window").show().animate({opacity: 1}, 300);
					$(".modal-window").addClass("window-popup")
				});
				
				$(".buy-error-handler").html("").hide();

				// Temporarely shrink body tag height
				$('html, body').css({
					overflow: 'hidden',
					height: '100%'
				});

				// Shows the proper block in modal window depending on  type of delivery user had chosen
				if(destinationType == "at base") {
					$(".base-address").show().animate({opacity: 1});
					$(".user-address").hide();
					$(".user-address").removeClass("isActive");
				} else {
					$(".base-address").hide();
					$(".user-address").show().animate({opacity: 1});
					$(".base-address").removeClass("isActive");
				}

			} else {
				// Failure step 2
				$(".buy-error-handler").html("Please, select package destination").show();
			}

	} else {
		// Failure step 1
		$(".buy-error-handler").html("Please, select size and color").show();
	}

	
});

// Handling modal events
$(".close-modal").click((e) => {
	closeModal()
})

$(document).keyup((e) => {
	if(e.keyCode == 27) {
		closeModal()
	}
})

$(".proccess-modal").click(() => {
	closeModal()
})

$(".user-address, .base-address").click((e) => {
	$(".dest-error").hide();

	address = $(e.target).html();
	$(".dest-section").animate({opacity: 0}, 400, () => {
		$(".dest-section").hide();
		$(".payment-section").show().animate({opacity: 1}, 400);
		$(".modal-navigation a").removeClass("activeNode");
		$('[data-target="payment-section"]').addClass("activeNode");
	})
})

$(".modal-navigation a").click((e) => {
	if($(e.target).attr("data-target") == "payment-section" && !address) {
		$(".dest-error").show();
		return;
	}

	$(".modal-navigation a").removeClass("activeNode");
	$(e.target).addClass("activeNode");

	if($(e.target).attr("data-target") == "dest-section") {
		$(".payment-section").animate({opacity: 0}, 400, () => {
			$(".payment-section").hide();
			$(".dest-section").show().animate({opacity: 1}, 400);
		})
	} else if($(e.target).attr("data-target") == "payment-section") {
		if(address) {
			$(".dest-section").animate({opacity: 0}, 400, () => {
				$(".dest-section").hide();
				$(".payment-section").show().animate({opacity: 1}, 400);
			})
		}
	}
	
})

$(".user-addresses li").click((e) => {
	$(".user-addresses li").animate({opacity: 1}, 400)
	$(".user-addresses li").removeClass("isActive");
	$(e.target).addClass("isActive");
})

$(".base-addresses li").click((e) => {
	$(".base-addresses li").removeClass("isActive");
	$(e.target).addClass("isActive");
})

$(".payment-methods li").click((e) => {
	$(".payment-methods li").removeClass("isActive");
	$(e.target).addClass("isActive");
	method = $(e.target).html();
})

$(".payment-methods li").each((index, el) => {
	if($(el).hasClass("card")) {
		$(el).prepend($(document.createElement("i")).addClass("fas fa-credit-card"))
	} else if($(el).hasClass("wallet")) {
		$(el).prepend($(document.createElement("i")).addClass("fab fa-paypal"))
	}
})

$(".dest-section [data-mark-color], .payment-section [data-mark-color]").each((index, el) => {
	let indicatorEl = $(document.createElement("span")).addClass("indicator");
	indicatorEl.css("background-color", $(el).attr("data-mark-color"))
	indicatorEl.appendTo($(el));
})

function closeModal() {
	$(".modal-window").removeClass("window-popup");


	setTimeout(() => {
		$(".modal-window").hide();

		$(".proccess-modal").animate({opacity: 0}, 600, () => {
			$(".proccess-modal").hide()
			$('html, body').css({
				overflow: 'visible',
				height: '100%'
			});
		})
	}, 300);
}
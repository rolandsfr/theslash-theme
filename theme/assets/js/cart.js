"use strict"

$('html, body').css({
	overflow: 'visible',
	height: '100%'
});

// Amount of details that should be precised in order to procceed with the purchasement
let detailsPrecised = $(".item-details").length * 2;

// Toggling classes between active and inactive options in the cart items
$(".size-value").click((e) => {
	$(e.target).closest(".item-details").find(".size-value").removeClass("selected-details");
	$(e.target).addClass("selected-details");
});

$(".color-value").click((e) => {
	$(e.target).closest(".item-details").find(".color-value").removeClass("selected-details");
	$(e.target).addClass("selected-details");
});

// Shows a message if the cart is empty
if(!$(".item_outer").length) {
	$(".nothingAdded").show();
} else {
	$(".nothingAdded").hide();
}

let amount;
for(let i = 0; i < $(".item").length; i++) {
	amount = 4; // This value should be fetched and set to the amount of the same item that has been added to the cart every iteration(get the value from your database)
	$(".item").eq(i).find(".model").html($(".item").eq(i).find(".model").html() + ` <span style='color: red; margin-left: 0.4em;font-size: 1.6rem;'>x${amount}</span>`);
}

// Set the initial total cost
let totalPrice = 0;
for(let i = 0; i < $(".price").length; i++) {
	totalPrice += parseInt($(".price").eq(0).html().slice(1));
}

$(".cart-total").html(`${totalPrice}$`);

// Total items in the cart
let totalItems = $(".item").length;
$(".items-count").html(totalItems);

// Removed an item from the cart
$(".removeFromCart").click((e) => {
	$(e.target).closest(".item").animate({opacity: 0}, 400, () => {
		$(e.target).closest(".item_outer").remove();
		$(".items-count").html(parseInt($(".items-count").html()) - 1);

		if(!$(".item_outer").length) {
			$(".bottom-container").animate({opacity: 0}, 400, () => {
				$(".bottom-container").remove();
				$(".nothingAdded").show();
			});
			$(".error-handler").remove();
		} else {
			$(".nothingAdded").hide();
			totalPrice = 0;
			for(let i = 0; i < $(".price").length; i++) {
				totalPrice += parseInt($(".price").eq(0).html().slice(1));
			}

			$(".cart-total").html(`${totalPrice}$`)
		}

		detailsPrecised = $(".item-details").length * 2;
	})
});

// Varibale with total order details precised by a user. **Should be equal to the detailsPrecised variable's value in order to open up payment modal window
let precised = 0, address = "", method = "", dest = "";

$(".pay-btn").click((e) => {
	precised = 0, address = "", method = "", dest = "";
	$(".modal-error").hide();

	for(let i = 0; i < $(".item").length; i++) {
		if($(".item").eq(i).find(".selected-details").length == 2) {
			precised += 2;
		}
	}

	// The modal window is shown if all order details are precised
	if(precised === detailsPrecised) {
		$(".error-handler").html("").hide();

		// Hides scrollbar
		$('html, body').css({
			overflow: 'hidden',
			height: '100%'
		});				

		// // Opens modal window
		$(".proccess-modal").show().animate({opacity: 1}, 600, () => {
			$(".modal-window").show().animate({opacity: 1}, 300);
			$(".modal-window").addClass("window-popup");
			$(".dest-types").show()

			$(".dest-types").animate({opacity: 1}, 400)
		});

	} else {
		$(".error-handler").html("Make sure you have precised details of order on each of the selected items.").show();
	}
});

$(".addresses-block li").click((e) => {
	$(".modal-error").hide()
	$(".addresses-block li").removeClass("isActive");
	$(e.target).addClass("isActive");
	address = $(e.target).html()
	changeNode("payment-section");

	$(".dest-section").hide();
	$(".payment-section").show().animate({opacity: 1}, 400)

})

$(".payment-methods li").click((e) => {
	$(".modal-error").hide()
	$(".payment-methods li").removeClass("isActive");
	$(e.target).addClass("isActive");
	method = $(e.target).html();
});

$(".dest-types li").click((e) => {
	$(".modal-error").hide()
	$(".dest-types li").removeClass("isActive");
	$(e.target).addClass("isActive");
	dest = $(e.target).html().toLowerCase();
	changeNode("dest-section")
	$(".dest-types").hide();
	$(".dest-section").show();

	if(dest == "at base") {
		$(".base-address").show().animate({opacity: 1}, 400)
		$(".user-address").hide();
		$(".user-address").removeClass("isActive");
	} else {
		$(".base-address").hide();
		$(".user-address").show().animate({opacity: 1}, 400)
		$(".base-address").removeClass("isActive");
	}	

});

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

// Reseting errors
$(".error-handler").hide();
$(".dialog-handler").hide();

// When the payment method has been chosen... (last step)
$(".payment-methods li").click((e) => {
	// Put your redirection script to procceed with the payment here (All neccessary data has been entered & user can complete the purchasement)
});

// Navigation in modal implemented by linked nodes
$(".modal-navigation a").click(e => {
	let node = $(e.target).attr("data-target");

	if(node === "dest-types") {
		$(".modal-window section").hide()
		$(".dest-types").show();
		changeNode("dest-types")
		$(".modal-error").hide()
	} else if(node === "dest-section") {
		if(!dest && !address) {$(".modal-error").show(); return;}
		$(".modal-window section").hide()
		$(".dest-section").show();
		$(".modal-error").hide()
		changeNode("dest-section")
	} else if(node === "payment-section") {
		if(!dest || !address) {$(".modal-error").show(); return;}
		$(".modal-window section").hide()
		$(".payment-section").show();
		changeNode("payment-section")
		$(".modal-error").hide()
	}
})

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

// ONLY FOR DEMONSTRATION PURPUSES
$(".item .buy-btn").on("click", e => {
	e.preventDefault();
	window.location.href = "../item.html";        
})

function changeNode(nextNode) {
	$(`[data-target]`).removeClass("activeNode")
	$(`[data-target="${nextNode}"]`).addClass("activeNode")
}

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
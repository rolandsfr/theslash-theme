"use strict"

$(window).resize(() => {
   $(".setting-wrapper").css("max-width", `${$(".grid").outerWidth()}px`)
})

$(".setting-wrapper").css("max-width", `${$(".grid").outerWidth()}px`)

// Custom error used in different cases
let addressErrors = {
    "fillIn": "Please, fill in all fields",
    "limit": "You can only add 5 addresses as maximum"
};

// Sets custom color to an address
$(".color").each((index, el) => {
    $(el).css("background-color", $(el).attr("data-color"));

    if($(el).attr("data-color") == "none") {
        $(el).css("background-color", "#fff")
        $(el).css("border", "2px solid #000")
    }

    $(el).click(() => {
        $(el).closest('.address-info').find(".address-line").css("background-color", $(el).attr("data-color"));

        if($(el).attr("data-color") == "none") {
            $(el).closest('.address-info').find(".address-line").css("background-color", "#fafafa");
        }
    })
});

let addressAmount = 0;

$(".address-info").each((index, el) => {
    $(el).on("click", ".mark", (e) => {
        $(el).find(".mark-block").find(".colors-block").toggleClass("toggle-block");
        e.preventDefault();
    });

    // Removes user-added address
    $(el).on("click", ".remove-address", () => {
        $(el).animate({opacity: 0}, 400, () => {
            --addressAmount;

            $(el).removeClass("taken");
            $(el).addClass("free");
        });
    })
});

let idCounter = 0,
    isCompletedForm = true;

// Indicates acive addresses (make sure to write the information into databse to use it in modal windows on other pages)
$(".set-active").each((index, el) =>{
    $(el).click((e) => {
        e.preventDefault();

        $(".isActive").not($(el)).removeClass("isActive").html("set active");

        if(!$(el).hasClass("isActive")) {
            $(el).addClass("isActive").html("make unactive");
        } else {
            $(el).removeClass("isActive").html("set active");
        }
    })
});

let completedCardForm = true;

$(".btn-save-card").click((e) => {
    e.preventDefault();
    $(".card-error-msg").html("").hide();

    for(let i = 0; i < $(".card-section").find("input").length; i++) {
        if($(".card-section").find("input").eq(i).val() === "") {
            completedCardForm = false;
            $(".address-block").find("input").eq(i).css("border-color", "red");
        }
    }

    if($(".payments-block").find("p").length <= 4) {
        if(completedCardForm) {
            // Successfully added payment method
            saveCard($(".payments").find("input[name='number']").val())
        } else {
            // Input error
            $(".card-error-msg").html("Please, fill in all fields!").show();
            completedCardForm = true;
        }
    } else {
        // limit error
        $(".card-error-msg").html("You can add no more than 5 payment methods. In order to add new one, remove already existing one.").show();
        completedCardForm = true;

    }
})

$(".selection").each((index, el) =>{
    $(el).click((e) => {
        $(el).find(".fa-caret-up").toggleClass("rotateCaret");
        $(el).closest("div").find(".payment-block").slideToggle();
    })
});

$(".btn-add-address").click((e) => {
    e.preventDefault();
    isCompletedForm = true;
    $(".address-block").find("input").css("border-color", "#000");


    for(let i = 0; i < $(".address-block").find("input").length; i++) {
        if($(".address-block").find("input").eq(i).val() === "") {
            isCompletedForm = false;
        }
    }

    if(addressAmount == 6) {
        $(".address-error").html(addressErrors["limit"]).show();
    } else {
        $(".address-error").html("").hide();
        
        if(isCompletedForm) {
        $(".address-error").html("").hide();
            $(".address-block").find("input").css("border-color", "#000");
            ++addressAmount;
            let address = createAddressLine($("input[name='street']").val(), $("input[name='city']").val(), $("input[name='country']").val(), $("input[name='zip-code']").val());
            
            // Adds and address

            // Predesigned element with customizble content
            let freeEl = $(".setting-data-inner").find(".free").first();
            freeEl.find(".address-line").html(address);
            freeEl.removeClass("free");
            freeEl.addClass("taken");
            
            idCounter++;
        } else {
            // Can not add address - shows an error
            $(".address-error").html(addressErrors["fillIn"]).show();
    
            for(let i = 0; i < $(".address-block").find("input").length; i++) {
                if($(".address-block").find("input").eq(i).val() === "") {
                    $(".address-block").find("input").eq(i).css("border-color", "red");
                }
            }
            
        }
    }
})

// Removes payment method
$(".payments-block").on("click", ".remove-payment", (e) => {
    $(e.target).closest("p").remove();
});

// Creates compact address line
function createAddressLine(street, city, country, zip) {
    return `${street}. ${city}, ${country} ${zip}`;
}

// Saves card in a certain format
function saveCard(nr) {
    let cardDiv = document.createElement("p");

    $(cardDiv).addClass("card").append($(document.createElement("i")).addClass("fab fa-cc-mastercard"));
    let censored = nr.slice(0, -4);

    censored = censored.replace(/[0-9]/g, "*")

    let uncensored = nr.slice(-4);

    $(cardDiv).append($(document.createElement("span")).addClass("cardnr").html(censored + uncensored));
    $(cardDiv).append($(document.createElement("span")).addClass("remove-payment").html("&times;"));


    $(".payments-block").find(".card-saved").append(cardDiv);
}

// Function for adding custom payment methods
// Arguments:
// walletName - online wallet credentials of user e.g. user address (if it is Paypal)
// iconName - fontawesome class of wanted online wallet icon e.g. "fab fa-paypal" (fontawesome Paypal icon)

function saveWallet(walletName, iconName) {
    let walletDiv = document.createElement("p");

    $(walletDiv).addClass("wallet").append($(document.createElement("i")).addClass(iconName));
    $(walletDiv).append($(document.createElement("span")).addClass("credentials").html(walletName));
    $(walletDiv).append($(document.createElement("span")).addClass("remove-payment").html("&times;"));


    $(".payments-block").find(".online-wallet-saved").append(walletDiv);
}

// Example: 
// saveWallet("johndoe@gmail.com", "fab fa-paypal"); (for a PayPal account)
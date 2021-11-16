"use strict";

jQuery(document).ready(function($) {
    $("a[href='#']").click((e) => {e.preventDefault()})

    // Shows and hide buy-btn when user hovers on and off the product image
    $(".product-img").on("mouseover", (e) => {
        $(e.target).find(".buy-block").css("display", "block");
        $(e.target).find(".buy-block").animate({opacity: 1}, 150);
    });

    $(".buy-block").on("mouseleave", (e) => {
        $(e.target).closest(".buy-block").animate({opacity: 0}, 150, () => {
            $(e.target).closest(".buy-block").css("display", "none");
        });
    });

    // Indicates how many items user has already added to their cart
    $(".addToCart").click((e) => {
        $(".items-count").html(parseInt($(".items-count").html()) + 1);
    });

    let sidebarIsOpen = false;
    
    // Mobile menu functionality
    $(".burger-mob").click(() => {
        $(".burger-mob").toggleClass("changeState-mob");
        $(".points").toggleClass("slide");
       
        if(!sidebarIsOpen) {
            $(".nav-overlay").css("display", "block")
            $(".nav-overlay").animate({opacity: 1}, 400)
        } else {
            $(".nav-overlay").animate({opacity: 0}, 400, () => {
                $(".nav-overlay").css("display", "none")
            })
        }

        sidebarIsOpen = !sidebarIsOpen;
    });

    if(!$(".burger-mob").hasClass("changeState-mob")) {
        $(".signUp, .remodal-close, .remodal-overlay").click(() => {
            $(".burger-mob").toggleClass("changeState-mob");
            $(".points").toggleClass("slide");

            $(".nav-overlay").animate({opacity: 0}, 400, () => {
                $(".nav-overlay").css("display", "none")
            })

            let sidebarIsOpen = !sidebarIsOpen;
        })
    }    

    $(".nav-overlay").click(() => {
        $(".nav-overlay").animate({opacity: 0}, 400, () => {
            $(".nav-overlay").css("display", "none")
        })

        $(".burger-mob").removeClass("changeState-mob");
        $(".points").removeClass("slide");

        sidebarIsOpen = false;

    })

    $(".profile-img").mouseover(() => {
        $(".burger-mob").removeClass("changeState-mob");
        $(".points").removeClass("slide");

        $(".nav-overlay").animate({opacity: 0}, 400, () => {
            $(".nav-overlay").css("display", "none")
        })

        sidebarIsOpen = false;

    })
    
    // Scripts that make possible using data-src attribute
    $("[data-src]").each(function(index, el) {
        $(el).css("background-image", "url(" + $(el).attr("data-src") + ")");
    });

   if(!$(".fullScreen-resp").find(".outfits-intro").length) setViewport();

    // Animates dropdowns 
	animateDropDown(".multiple", ".multiple");
    animateDropDownHover(".profile-img", ".profile-img");

});

// Rearranging elements in top nav menu depending on screen size (because desktop and mobile have different layouts)
if($(window).outerWidth() < 813) {
    let navWrapper = $(document.createElement("div")).addClass("main-nav");
    $("nav .container").wrapInner(navWrapper);

    let elements = $(".profile, .cart").detach();
    elements.insertBefore(".burger-mob")
}

$(window).resize(() => {
    if($(window).outerWidth() < 813) {
        $(".nav-logo").unwrap(".main-nav")

        let navWrapper = $(document.createElement("div")).addClass("main-nav");
        $("nav .container").wrapInner(navWrapper);

        let elements = $(".profile, .cart").detach();
        elements.insertBefore(".burger-mob")
    } else {
        $(".nav-logo").unwrap(".main-nav");
        $(".profile, .cart").detach().appendTo($(".points"))
    }
})

$('html, body').css({
    overflow: 'hidden',
    height: '100%'
});

$(window).on("load", () => {
    setTimeout(() => {
        // Initializes WOW animations only if its not a mobile device and only once the page is fully loaded
        if($(window).width() > 768) {
            new WOW().init();
        }

        // Loads the page while showing preloading screen
        transitionPageLoader({showOn: "load"});
    }, 1000)
})

// Validate modal inputs before submitting
$(".signup-btn").click((e) => {
    $(".buy-error-handler").html("").hide();
    $(".text-field").css("border-color", "#000")

    e.preventDefault();
    // If this loop doesn't produce a single true value while iterating - data can be submitted
    for(let i = 0; i < $(".text-field").length; i++) {
        if($(".text-field").eq(i).val() === "") {
            $(".buy-error-handler").html("").hide();
            $(".error-handler").html("Please, fill in all the fields").show();
            $(".text-field").eq(i).css("border-color", "red")
        } 
    }
})

// Main loading screen stylesheets (You can create several with different purposes)
let mainLoader = {
    "background": "#fff",
}
// Sets the Loading screen proper styles
pageLoaderTheme(mainLoader);

$(".cta-btn, .editOutfit-btn, .remodal a").click((e) => {
    e.preventDefault();

    $('html, body').css({
        overflow: 'hidden',
        height: '100%'
    });

    let href = $(e.target).closest("a").attr("href");

    // Uses preloagind screen as transition between 2 pages
    transitionPageLoader({showOn: "transition", redirection: href});
});

// Function that allows to make custom loading screen depending of what the theme is
// Function requires an object with 2 properties
// "background" and "loaderColor" - requires a hex, rgb(a) or HTML color that can be used in css
// property "background" sets the loading screen background color
// property "loaderColor" sets loading icon color

function pageLoaderTheme(obj) {
    let mainColor = obj.background;

    $(".preloading-screen").css("background-color", mainColor);
}

// Requires an object with propery showOn and redirection
// If the value is "load" - shows up the loafind screen and hides after the page was fully loaded
// If the value is "transition" - uses loading screen as transition between 2 pages and user "redirection" property value as a location where the user should be redirected
function transitionPageLoader(obj) {
    let href = obj.redirection;
    
    if(obj.showOn === "load") {
        $(".preloading-screen").animate({opacity: 0}, 500, () => {
            $(".preloading-screen").hide();

            $('html, body').css({
                overflow: 'visible',
                height: '100%'
            });
        });
    } else if(obj.showOn === "transition") {
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });

        $(".preloading-screen").show().animate({opacity: 1}, 500, () => {
            setTimeout(() => {
                location.href = href;
            }, 500);
        });
    }
}

// Animates dropdowns on the page (onclick event)
// Requires 2 arguments
// parent - the parent element that contains all dropdown items
// onclick - element that triggers dropdown to be opened / closed
function animateDropDown(parent, onclick) {
    $(onclick).click((e) => {
        $(parent).find(".dropdown").toggleClass("drop");
    });

    $(onclick).one("click", (e) => {
        let items = $(parent).find(".dropdown li"),
            itemsCount = items.length;
            
        // Time for each dropdown element to show up
        let dropTime = 100;

        let p = new Promise((resolve, reject) => {
            setTimeout(function () {
                items.eq(0).animate({opacity: 1}, dropTime * 6);
                resolve();
            }, dropTime)
        });

        for(let i = 1; i <= itemsCount; i++) {
            p = p.then(_ => new Promise(resolve =>
                setTimeout(function () {
                    items.eq(i).animate({opacity: 1}, dropTime * 6);
                    resolve();
                }, dropTime)
            ));
        }
    });
}

// Function for normalizing 100vh viewport
function setViewport() {
    $(".fullScreen").css("height", $(window).height() - $(".nav-outer").outerHeight() + "px");
    
    $(window).resize(() => {
        $(".fullScreen-resp").css("height", "auto")
        $(".fullScreen").css("height", $(window).height() - $(".nav-outer").outerHeight() + "px");
    });

    $(".fullScreen-resp").css("min-height", $(window).height() - $(".nav-outer").outerHeight() + "px");
    
    $(window).resize(() => {
        $(".fullScreen-resp").css("min-height", $(window).height() - $(".nav-outer").outerHeight() + "px");
    });
}

// Similar to animateDropDown function (but works only when user hovers on element), same arguments
function animateDropDownHover(parent, onclick) {
    $(onclick).mouseover((e) => {
        $(parent).find(".dropdown").addClass("drop");
    });

    $(onclick).mouseout((e) => {
        $(parent).find(".dropdown").removeClass("drop");
    });

    $(onclick).one("mouseover", (e) => {
        let items = $(parent).find(".dropdown li"),
            itemsCount = items.length;

        let dropTime = 100;

        let p = new Promise((resolve, reject) => {
            setTimeout(function () {
                items.eq(0).animate({opacity: 1}, dropTime * 6);
                resolve();
            }, dropTime)
        });

        for(let i = 1; i <= itemsCount; i++) {
            p = p.then(_ => new Promise(resolve =>
                setTimeout(function () {
                    items.eq(i).animate({opacity: 1}, dropTime * 6);
                    resolve();
                }, dropTime)
            ));
        }
    });
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

$(".buy-btn, .addToCart, .ad-option, .saveLook").click((e) => {
    showLogin();
});

// Login pop-up modal handling
function showLogin() {
    $(".login-container").css("display", "flex");
    $(".login-container").animate({opacity: 1}, 800)

    setTimeout(() => {
        $(".login-container .container_inner").addClass("show-login")
    }, 500)
}

$(".close-login").click(e => {
    $(".login-container .container_inner").removeClass("show-login")

    setTimeout(() => {
        $(".login-container").animate({opacity: 0}, 800)
        $(".login-container").hide()
    }, 500)
})
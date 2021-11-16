"use strict"

let dropTime = 100, // Time for dropdown animation in miliseconds
	filters = {},
	applyFilters = [],
	applyBrandFilters = [],
	sortingFunc = null,
	brandsFilter = {},
	merged = [];

var Shuffle = window.Shuffle,
	element = document.querySelector('.shuffle'),
	sizer = element.querySelector('.sizer'),
	shuffleInstance = new Shuffle(element, {
		itemSelector: '.item_outer',
		sizer: sizer,
		filterMode: Shuffle.FilterMode.ALL
	});

// Highlights user-added address in the selected color
// $("[data-mark-color]").each((index, el) => {
// 	if($(el).attr("data-mark-color") !== "") {
// 		$(el).css("background-color", $(el).attr("data-mark-color"));
// 	} 
// });


$("[data-filter-select]").each((index, el) => {
	$(el).html($(el).data("filter-select"));
});

$("[data-filter-type]").each((index, el) => {
	filters[$(el).data("filter-type")] = null;

	let element = $(`<span>${$(el).data("filter-type")}</span>`).addClass("type");
	element.insertBefore($(el).find(".select i"));

	// Animates dropdown
	$(el).find(".select").click(() => {
		$(el).siblings().find(".dropdown").removeClass("drop");
		$(el).siblings().find("i").removeClass("rotateCaret");
	    
	    $(el).find("i").toggleClass("rotateCaret");
		$(el).find(".dropdown").toggleClass("drop");
	});

	$(el).find(".select").one("click", () => {
		let items = $(el).find(".dropdown li"),
			itemsCount = items.length;

		let p = new Promise((resolve, reject) => {
			setTimeout(function () {
				items.eq(0).animate({opacity: 1}, dropTime);
			    resolve();
			}, dropTime)
		});

		for(let i = 1; i <= itemsCount; i++) {
			p = p.then(_ => new Promise(resolve =>
			     setTimeout(function () {
					items.eq(i).animate({opacity: 1}, dropTime);
			        resolve();
			    }, dropTime)
			));
		}
	});
});

// Lazyloading the images
var lazy = function lazy() {
  document.addEventListener('lazyloaded', function (e)  {
    e.target.parentNode.classList.add('image-loaded');
    e.target.parentNode.classList.remove('loading');
  });
}

lazy();

// Adds proper filtering functionality on each filter button
$(".type").find(".dropdown li").each((index, el) => {
	$(el).click((event) => {
		functionality(document.querySelector(".type"), el, $(".type .filtered"));
		$(".products").css("height", "500px !important")
	});
});

$(".pricing").find(".dropdown li").each((index, el) => {
	$(el).click((event) => {
		functionality(document.querySelector(".pricing"), el, $(".pricing .filtered"));
		
	});
});

$(".brand").find(".dropdown li").each((index, el) => {
	$(el).click((event) => {
		functionality(document.querySelector(".brand"), el, $(".brand .filtered"));
	});
});

function closeDropdown(el) {
	$(el).find(".dropdown").removeClass("drop");
	$(el).find("i").removeClass("rotateCaret");
}

// Function that allows to apply different filters
// Can not be used combined with the search just yet tho (so the shuffle instance resets)
function functionality(el, tg, fullEl) {
	let promise = new Promise((resolve, reject) => {

	// Resets shuffling
	if(merged.length === 0 && $(".search-input").val() === "") {
		shuffleInstance.filter(Shuffle.ALL_ITEMS);
	}

	if($(el).hasClass("type")) {
		applyFilters = [];
		filters[$(el).data("filter-type")] = $(tg).data("filter-select");
	} else if($(el).hasClass("pricing")) {
		sortingFunc = function(element) {
			return parseInt(element.getAttribute("data-price"));
		}
	} else if($(el).hasClass("brand")) {
		applyBrandFilters = [];
		brandsFilter[$(el).data("filter-type")] = $(tg).data("filter-select");
	}

	// Merges multiple filters in one
	if($(el).hasClass("type") || $(el).hasClass("brand")) {
		merged = applyFilters.concat(applyBrandFilters);
	}

	// Resets all filter-tags
	$(el).find(".filter-tag").remove();
	$(el).find(".deleteFilter").remove();

	// Closes all dropdows
	closeDropdown($(el));
	let element = $(`<span>${$(tg).data("filter-select")}</span>`).addClass("filter-tag")
	let deleteFilter = $(`<p>&times;</p>`).addClass("deleteFilter");
	$(el).find(".filtered").append(element);
	$(el).find(".filtered").append(deleteFilter);
	$(el).find(".filtered").css("display", "flex");

	$(".deleteFilter").click((event) => {
		event.stopImmediatePropagation();

		$(".search-input").val("");
		let filtered = $(el).find(".filtered");

		appearence(fullEl);
				
		if($(el).hasClass("type")) {
			filters = {};
			filters[$(el).data("filter-type")] = null;

			applyFilters = [];

			for(let key in filters) {
				if(filters[key] == null) continue;
					applyFilters.push(filters[key]);
			}

		} 

		if ($(el).hasClass("brand")) {
			applyBrandFilters = [];
			brandsFilter[$(el).data("filter-type")] = null;
		}

		if($(el).hasClass("type") || $(el).hasClass("brand")) {
			merged = applyFilters.concat(applyBrandFilters);
			shuffleInstance.filter(merged);
		}

		if($(el).hasClass("pricing")) {
			shuffleInstance.filter(merged, {
				by: undefined
			});
		}

	});

	if($(el).hasClass("type")) {
		for(let key in filters) {
			if(filters[key] == null) continue;
				applyFilters.push(filters[key]);
			}
		} 
				
		if($(el).hasClass("brand")) {
			for(let key in brandsFilter) {
				if(brandsFilter[key] == null) continue;
					applyBrandFilters.push(brandsFilter[key]);
				}
			}
		

			if($(el).hasClass("type") || $(el).hasClass("brand")) {
				merged = applyFilters.concat(applyBrandFilters);
				shuffleInstance.filter(merged);
			}

			if($(el).hasClass("pricing")) {
				if($(tg).data("filter-select") == "low-to-high") {
					shuffleInstance.filter(merged, {
			 			by: sortingFunc
				});
			} else {
				shuffleInstance.filter(merged, {
					by: sortingFunc,
						reverse: true
					});
				}
			}

			if(merged.length === 0 && $(".search-input").val() === "") {
				shuffleInstance.filter(Shuffle.ALL_ITEMS);
			}
			
			$(".search-input").val("");
			resolve();
			
			}).then(() => {
				setTimeout(() => {
					$(el).find(".filtered").animate({opacity: 1}, 400);
				}, 100);
			});
		
	
}

// When trying to search - shuffle resets other filters
$(".search-input").keyup((e) => {

	closeDropdown($("[data-filter-type]"));

	var searchText = e.target.value.toLowerCase();

	shuffleInstance.filter((element) => {
		var titleElement = $(element).find(".model");
	    var titleText = titleElement.html().toLowerCase().trim();

	    return titleText.indexOf(searchText) !== -1;
	}, {by: undefined});

	merged = [];
	$(".filtered").animate({opacity: 0}, 400, () => {
		$(this).empty();
		$(".filtered").css("display", "none");
	});

});

function appearence(fullEl) {
	 fullEl.animate({opacity: 0}, 400, () => {
		fullEl.css("display", "none");
		fullEl.closest(".filter").find(".filter-tag").remove();
		fullEl.closest(".filter").find(".deleteFilter").remove();
	});
}

function filtering(groups, func) {
	shuffleInstance.filter(groups, func);
}

function resetViewportHeight() {
	let h = $("#wrapper").outerHeight()  + "px"
	$("body").css({
		"height": h,
		"overflow-y": "hidden"
	})
}

$(".item").css("z-index", "3");
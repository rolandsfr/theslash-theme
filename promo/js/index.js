let modalIsOpen = false;

$(".explore-cta").click(() => {
  modalIsOpen = true;
  $(".bg-overlay").css("display", "block");
  $(".bg-overlay").animate({ opacity: 1 }, 300, () => {
    $(".version-screen").css("display", "block");
    $(".version-screen").animate({ opacity: 1 }, 300);
    $(".version-screen").addClass("scaleIn");
  });
});

$(".close-screen, .bg-overlay").click(() => {
  closeModal();
});

$(document).keyup((e) => {
  if (modalIsOpen && e.keyCode == 27) {
    closeModal();
  }
});

$(window).on("load", () => {
  setTimeout(() => {
    $(".preloading-screen").animate({ opacity: 0 }, 400, () => {
      $(".preloading-screen").css("display", "none");
    });
  }, 400);

  if ($(window).width() >= 1024) {
    new WOW().init();
  }
});

function closeModal() {
  $(".bg-overlay").css("display", "block");
  $(".bg-overlay").animate({ opacity: 1 }, 300, () => {});

  $(".version-screen").removeClass("scaleIn");
  $(".version-screen").animate({ opacity: 0 }, 400, () => {
    $(".version-screen").hide();
    $(".bg-overlay").animate({ opacity: 0 }, 200, () => {
      $(".bg-overlay").hide();
    });
  });

  modalIsOpen = false;
}

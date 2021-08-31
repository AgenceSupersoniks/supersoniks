(function($) {
  "use strict";

  alert('plop');

  let root = document.documentElement;

  function tocssvar($elt, propertyName) {
    // Calcul le css Calculé par le navigateur
    var propertyValue = window
      .getComputedStyle($elt["0"], null)
      .getPropertyValue(propertyName);

    // Nom de variable à partir de l'id ou la première classe
    let varName = $elt.attr("id") || $elt.attr("class").split(" ")[0];

    // Set var dans le root
    root.style.setProperty("--" + varName + "-" + propertyName, propertyValue);
  }

  function updateCssVar($elts) {
    $elts = $elts || $("[data-to-cssvar]");
    $elts.each(function() {
      // Recupere la propriété passée en data
      let props = $(this).data("to-cssvar");
      props = props.split(",");

      for (const propertyName of props) {
        tocssvar($(this), propertyName.trim());
      }
    });
  }

  // Attach pour js drupal
  Drupal.behaviors.tocssvar = {
    attach: function(_context) {
      updateCssVar();
    }
  };

  // UPDATE VALEUR
  $(window).on("resize", function() {
    updateCssVar();
  });


})(jQuery);

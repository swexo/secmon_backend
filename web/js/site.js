$(function () {
    // Initialize collapse button
    $('.button-collapse').sideNav({
        menuWidth: 250, // Default is 240
        draggable: true // Choose whether you can drag to open on touch screens
    });
    
    $(".compact-button").on("click", _compactBtn_onClick);
    // Inicializovanie selectov.
    $('select').material_select();
    // Aktivovanie datepickera
    activateDatePicker();

    $("body").removeClass("preload");
});

/*
 * Inicializovanie datepickera.
 */
function activateDatePicker(element) {
    if (element !== undefined)
        element = $(element).find('.datepicker');
    else
        element = '.datepicker';

    $(element).pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        format: 'yyyy-mm-dd',
        closeOnSelect: true,
        firstDay: 1
    });
}

/*
 * Event handler pre zmensenie/zvacsenie siderbaru.
 */
function _compactBtn_onClick (e) {
    event.preventDefault(e);
    
    $("body").toggleClass("compact");
    
    // ulozenie stavu sidebaru
    window.localStorage.setItem("isCompact", $("body").hasClass("compact"));
}
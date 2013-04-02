$(document).ready(function() {
  $.ajax('./pages.html')
  .then(function (data) {
    $('body').append(data);
    $.getScript('./js/main.js');
    $.getScript('./js/help.js');
    $.getScript('./js/license.js');
  });
});

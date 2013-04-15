/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

$(document).ready(function() {
  var body = document.querySelector('body');

  var loadScript = function (url) {
    var elt = document.createElement('script');
    elt.setAttribute('src', url);
    elt.setAttribute('async', 'async');
    body.appendChild(elt);
  };

  $.ajax({
    url: './pages.html',
    success: function (data) {
      $('body').append(data);
      loadScript('./js/main.js');
      loadScript('./js/help.js');
      loadScript('./js/license.js');
    }
  });
});


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAl9dOoxfYyfKZAcvopxCRAhBeEkgNAQeA",
    authDomain: "interstock-9002d.firebaseapp.com",
    databaseURL: "https://interstock-9002d.firebaseio.com",
    projectId: "interstock-9002d",
    storageBucket: "interstock-9002d.appspot.com",
    messagingSenderId: "154569829116"
  };
  firebase.initializeApp(config);




//mobilizing the carousel
        $('.carousel[data-type="multi"] .item').each(function() {
            var next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));

            for (var i = 0; i < 2; i++) {
                next = next.next();
                if (!next.length) {
                    next = $(this).siblings(':first');
                }
                next.children(':first-child').clone().appendTo($(this));
            }
        });

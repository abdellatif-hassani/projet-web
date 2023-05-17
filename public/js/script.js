// JavaScript code goes here
$(document).ready(function() {
    $('.nav-link').click(function(e) {
        e.preventDefault();
        var link = $(this).data('link');
        $('.content').addClass('d-none');
        $('#' + link).removeClass('d-none');
    });

    // $('#loginForm').submit(function(e) {
    //     e.preventDefault();
    //     var username = $('#username').val();
    //     var password = $('#password').val();
    //     // Perform login logic here
    //     console.log('Login:', username, password);
    //     // Clear form fields
    //     $('#username').val('');
    //     $('#password').val('');
    // });

    // $('#registerForm').submit(function(e) {
    //     e.preventDefault();
    //     var username = $('#regUsername').val();
    //     var password = $('#regPassword').val();
    //     // Perform registration logic here
    //     console.log('Register:', username, password);
    //     // Clear form fields
    //     $('#regUsername').val('');
    //     $('#regPassword').val('');
    // });


    //script for logout 
    $('#logoutButton').click(function() {
        // Send AJAX request to the server to clear the cookie
        $.ajax({
            url: '/logout',
            type: 'POST',
            success: function(response) {
              // Check the response message
              if (response.message === 'Logged out successfully') {
                // Redirect to the home page after successful logout
                console.log('loged out')
                window.location.href = '/';
              } else {
                console.log('Logout failed:', response);
              }
            },
            error: function(error) {
              console.log('Error occurred during logout:', error);
            }
        });
      });


    //Loging using a json request 
    // Event handler for the login form submission
    $('#s').on('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get the form data
        var email = $('#email').val();
        var password = $('#password').val();
        console.log(email)
        // Send a POST request to the server
        $.ajax({
          url: '/login',
          method: 'POST',
          data: { email, password },
          success: function(response) {
            window.location.href = response.redirect;
          },
          error: function(xhr, status, error) {
            alert('Login failed: ' + xhr.responseJSON.error);
          }
        });
      });



      //validation of the of creatign account
      $('#registerForm').submit(function(e) {
        e.preventDefault(); // Prevent form submission
        // Perform name, email, and password validation
        var name = $('#nameR').val();
        var email = $('#emailR').val();
        var password = $('#passwordR').val();
        var repassword = $('#repasswordR').val();
        // Validate name: accept characters that can be used in a name (letters, spaces, and hyphens)
        var nameRegex = /^[a-zA-Z\s-]+$/;
        if (!nameRegex.test(name)) {
          alert('Please enter a valid name.');
          return;
        }
        // Validate email format using a regular expression
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log(repassword.length)
          alert('Please enter a valid email address.');
          return;
        }
        // Validate password length
        if (password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
        }
        // Check if password and re-entered password match
        if (password !== repassword) {
          alert('Passwords do not match.');
          return;
        }
    
        // If validation passes, send the data to the server
        var userData = {
          name: name,
          email: email,
          password: password
        };
    
        $.ajax({
          url: '/account/newAccount',
          method: 'POST',
          data: userData,
          success: function(response) {
            // Handle the server response
            alert('User registered successfully!');
            // Perform any additional client-side operations if needed
          },
          error: function() {
            alert('An error occurred. Please try again later.');
          }
        });
      });

  
});


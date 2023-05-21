// JavaScript code goes here
$(document).ready(function() {
    $('.nav-link').click(function(e) {
        e.preventDefault();
        var link = $(this).data('link');
        $('.content').addClass('d-none');
        $('#' + link).removeClass('d-none');
    });


    //script for logout 
    $('#logoutButton').click(function() {
        // Send AJAX request to the server to clear the cookie
        $.ajax({
            url: '/logout',
            type: 'POST',
            success: function(response) {
              // Check the response message
              if (response.message === 'Logged out successfully') {
                // Store logout status in sessionStorage
                sessionStorage.setItem('isLoggedOut', 'true');
                // Redirect to the home page
                window.location.href = response.redirect;
                  
              } else {
                console.log('Logout failed:', response);
              }
            },
            error: function(error) {
              console.log('Error occurred during logout:', error);
            }
        });
      });
      
      $(document).on('click', '#closeAlertBtnLogout', function() {
        $('#logoutAlert').fadeOut();
        sessionStorage.removeItem('isLoggedOut'); // Remove login status from sessionStorage when the alert is closed manually
      });


    //Loging using a json request 
    // Event handler for the login form submission
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        // Get the form data
        var email = $('#email').val();
        var password = $('#password').val();
        // Send a POST request to the server
        $.ajax({
          url: '/login',
          method: 'POST',
          data: { email, password },
          success: function(response) {
            sessionStorage.setItem('isLoggedIn', 'true'); // Store login status in sessionStorage
            window.location.href = response.redirect;
            // $('.content').addClass('d-none');
            // $('#home').removeClass('d-none');
          },
          error: function(xhr) {
            $('#errorDivP').html(xhr.responseJSON.error)
            $('#errorDiv').fadeIn();
          }
        });
      });

      // Attach event listener for the close button using event delegation
      $(document).on('click', '#closeAlertBtn', function() {
        $('#successAlert').fadeOut();
        sessionStorage.removeItem('isLoggedIn'); // Remove login status from sessionStorage when the alert is closed manually
      });

      $('#incorrectDataBtn').click(function() {
        $('#errorDiv').fadeOut();
      });

      
      // Show the alert to notify the user that they are logged in successfully
      // dynamically after the page finishes loading
      // Show the alert dynamically after the page finishes loading
      $(window).on('load', function() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const isLoggedOut  = sessionStorage.getItem('isLoggedOut');
        if (window.location.pathname === '/' && isLoggedIn) {
          $('#successAlert').fadeIn();
          // Automatically hide the alert after 1 minute (60000 milliseconds)
          setTimeout(function() {
            $('#successAlert').fadeOut();
            sessionStorage.removeItem('isLoggedIn'); // Remove login status from sessionStorage after hiding the alert
          }, 20000);
        }
        if (window.location.pathname === '/' && isLoggedOut) {
          
          $('#logoutAlert').fadeIn();
          // Automatically hide the alert after 1 minute (60000 milliseconds)
          setTimeout(function() {
            $('#logoutAlert').fadeOut();
            sessionStorage.removeItem('isLoggedOut'); // Remove login status from sessionStorage after hiding the alert
          }, 20000);
        }
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
        $('#nameR, #emailR, #passwordR, #repasswordR').removeClass('invalid-input'); // Remove 'invalid-input' class from all input fields
        if (!nameRegex.test(name)) {
          $('#errorDiv').html('Invalid Name').fadeIn();
          $('#nameR').addClass('invalid-input');
          return;
        }
        // Validate email format using a regular expression
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#emailR').addClass('invalid-input');
            $('#errorDiv').html('Invalid Email').fadeIn();
          return;
        }
        // Validate password length
        if (password.length < 6) {
          $('#passwordR').addClass('invalid-input');
          $('#errorDiv').html('Password must be more than 6 characters').fadeIn();
          return;
        }
        // Check if password and re-entered password match
        if (password !== repassword) {
          $('#errorDiv').html('password doesn\'t match').fadeIn();
          $('#passwordR, #repasswordR').addClass('invalid-input');
          // alert('Passwords do not match.');
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
            // Hide the register content
            $('#register').addClass('d-none');
            // Show the login content
            $('#login').removeClass('d-none');
            // window.location.href = '/';
            // alert('User registered successfully!');
          },
          error: function(xhr) {
            var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An error occurred. Please try again later.';
            $('#errorDiv').html(errorMessage).fadeIn();
          }
        });
      });

  

      // Fetch and display post titles on the home page
      function home(){
          $.ajax({
            url: '/articles', // Change the URL to the appropriate server route for fetching post titles
            method: 'GET',
            success: function(response) {
              // Assuming the response is an array of post objects
              var posts = response.posts; // Adjust this based on the actual response format
              var postsContainer = $('#postTitles');
              $('#postDetail').fadeOut();
              // Iterate over the posts and append them to the container
              for (var i = 0; i < posts.length; i++) {
                var post = posts[i];
                var postTitle = post.title;
                var createdAt = new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
    
                // Create the card element
                var cardElement = $('<div>').addClass('card');
    
                // Create the card body element
                var cardBodyElement = $('<div>').addClass('card-body');
    
                // Create the title element as a link to the post content
                var titleElement = $('<a>')
                  .addClass('card-title post-title')
                  .attr('href', '#') // Placeholder link, change this to match your route for displaying a single post
                  .data('post-id', post.id) // Add the post ID as a data attribute
                  .text(postTitle);
    
                // Create the publication date element
                var createdAtElement = $('<p>').addClass('card-text').text('Published on: ' + createdAt);
    
                // Append the title and publication date elements to the card body
                cardBodyElement.append(titleElement, createdAtElement);
    
                // Append the card body to the card
                cardElement.append(cardBodyElement);
    
                // Append the card to the container
                postsContainer.append(cardElement);
              }
            },
            error: function(error) {
              console.log('Error occurred while fetching post titles:', error);
            }
          });
      }

      home()

      $(document).on('click', '#linkToHome', function() {
        $('#postDetail').fadeOut();
        $('#postTitles').fadeIn();
      });


      // Event handler for clicking on a post title
      $(document).on('click', '.post-title', function() {
        var postId = $(this).data('post-id'); 

        // Call the fetchPostData function to retrieve and display the post data
        fetchPostData(postId);
      });

      // Function to fetch post content and comments
      function fetchPostData(postId) {
        $.ajax({
          url: '/articles/' + postId, // Change the URL to the appropriate server route for fetching post data
          method: 'GET',
          success: function(response) {
            $('#postTitles').fadeOut()
            $('#postDetail').fadeIn()
            // Assuming the response contains post data (content and comments)
            var postData = response.post; // Adjust this based on the actual response format
            // Update the post content
            $('#titleofSection').html(postData.title)
            var postContentContainer = $('#postContent');
            postContentContainer.html(postData.content);
            // Update the comments
            var commentsContainer = $('#postComments');
            commentsContainer.empty();
            const commentTitle = $('<h3>').addClass('card-subtitle mb-2 text-muted').text('Comments');
            commentsContainer.append(commentTitle);
            for (var i = 0; i < postData.comments.length; i++) {
              var comment = postData.comments[i];
              var commentElement = $('<div>').addClass('comment card').text(comment.content);
              commentsContainer.append(commentElement);
            }
            $('#postDetail').append(postContentContainer, commentsContainer);
          },
          error: function(error) {
            console.log('Error occurred while fetching post data:', error);
          }
        });
      }



      //get listes of categories for database
      // Fetch and display post titles on the home page
      $.ajax({
        url: '/categories', // Change the URL to the appropriate server route for fetching post titles
        method: 'GET',
        success: function(response) {
          // Assuming the response is an array of post titles
          var categories = response.categories;
          // Iterate over the post titles and append them to the container
          var categoriesListContainer = $('#categoriesList');
          for (var i = 0; i < categories.length; i++) {
            var category = categories[i].name;
            var liElement = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').text(category);
            var spanBodyElement = $('<span>').addClass('badge bg-primary').text(categories[i].postCount);
            liElement.append(spanBodyElement);
            categoriesListContainer.append(liElement);
          }
        },
        error: function(error) {
          console.log('Error occurred while fetching post titles:', error);
        }
      });










});


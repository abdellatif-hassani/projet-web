// JavaScript code goes here
$(document).ready(function() {
  
    $('.nav-link').click(function(e) {
        e.preventDefault();
        var link = $(this).data('link');
        $('.content').addClass('d-none');
        $('#' + link).removeClass('d-none');
        $('.nav-link').removeClass('active')
        $(this).addClass('active')
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
        var email = $('#emailLogin').val();
        var password = $('#passwordLogin').val();
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
        var email = $('#emailRegister').val();
        var password = $('#passwordRegister').val();
        var repassword = $('#repasswordRegister').val();
        // Validate name: accept characters that can be used in a name (letters, spaces, and hyphens)
        var nameRegex = /^[a-zA-Z\s-]+$/;
        $('#nameR, #emailRegister, #passwordRegister, #repasswordRegister').removeClass('invalid-input'); // Remove 'invalid-input' class from all input fields
        if (!nameRegex.test(name)) {
          $('#errorDivP').html('Invalid Name')
          $('#errorDiv').fadeIn();
          $('#nameR').addClass('invalid-input');
          return;
        }
        // Validate email format using a regular expression
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#emailRegister').addClass('invalid-input');
            $('#errorDivP').html('Invalid Email')
            $('#errorDiv').fadeIn();
          return;
        }
        // Validate password length
        if (password.length < 6) {
          $('#passwordRegister').addClass('invalid-input');
          $('#errorDivP').html('Password must be more than 6 characters')
          $('#errorDiv').fadeIn();
          return;
        }
        // Check if password and re-entered password match
        if (password !== repassword) {
          $('#errorDivP').html('password doesn\'t match')
          $('#errorDiv').fadeIn();
          $('#passwordRegister, #repasswordRegister').addClass('invalid-input');
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
            $('#errorDivP').html(errorMessage)
            $('#errorDiv').fadeIn();
          }
        });
      });

  

      // Fetch and display post titles on the home page
      function home(idCategorie=''){
          var requestUrl = '/articles/'
          if(idCategorie){
            console.log(idCategorie)
            requestUrl += 'categorie/' + idCategorie;
          }
          console.log(requestUrl)
          $.ajax({
            url: requestUrl, // Change the URL to the appropriate server route for fetching post titles
            method: 'GET',
            success: function(response) {
              // Assuming the response is an array of post objects
              var posts = response.posts; // Adjust this based on the actual response format
              console.log(posts)
              var postsContainer = $('#postTitles');
              $('#postDetail').fadeOut();
              if(idCategorie){
                $('#postTitles').fadeIn();
                $('#postTitles').empty();
              }
              if(!idCategorie){
                var lastPosts = $('<h2>').addClass('card-title headTitle')
                                                .attr('id','titleofSection')
                                                .text('Last posts')
                $('#postTitles').append(lastPosts)
              }
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
                var createdByElement = $('<span>').addClass('card-text').text('Published By: ');
                var createdByElementLink = $('<a href=\'#\'>').addClass('postAuthor').text(post.author.name);
                createdByElement.append(createdByElementLink)
                // Append the title and publication date elements to the card body
                cardBodyElement.append(titleElement, createdAtElement,createdByElement);
    
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
        $('#postContent').empty();
        $('#commentsContainer').empty();
        $('#postTitles').fadeIn();
        $('#postTitles').empty();
        home()
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
            const titlePost =  $('<h2>').addClass('card-title headTitle').text(postData.title)
            var postContentContainer = $('#postContent');
            postContentContainerText = $('<span>').addClass('postContentText').text(postData.content)
            postContentContainer.append(titlePost,postContentContainerText)
            // postContentContainer.html(postData.content);
            // Update the comments
            var commentsContainer = $('#commentsContainer');
            commentsContainer.empty();
            for (var i = 0; i < postData.comments.length; i++) {
              var comment = postData.comments[i];
              var card_body = $('<div>').addClass('card-body px-4 py-2')
              var commentWriter = $('<h6>').addClass('fw-bold mb-1').text(comment.user.name)
              var commentContent = $('<p>').addClass('mb-0').text(comment.content)
              card_body.append(commentWriter, commentContent)
              var lineHr = $('<hr>').addClass('my-0')
              commentsContainer.append(card_body, lineHr);
            }
            $('#postComments').append(commentsContainer)
            $('#postDetail').append(postContentContainer, $('#postComments'));
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
            var liElementLink = $('<a>')
                  .addClass('category-title')
                  .attr('href', '#') // Placeholder link, change this to match your route for displaying a single post
                  .data('categorie-id', categories[i].id) // Add the post ID as a data attribute
                  .text(category)
                  .on('click', function(event) {
                    event.preventDefault(); // Prevent the default link behavior
                
                    var idCategorie = $(this).data('categorie-id');
                    // console.log(idCategorie)
                    home(idCategorie); // Call the home method with the idCategorie parameter
                  });
            var liElement = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center');
            liElement.append(liElementLink)
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


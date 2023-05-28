
$(document).ready(function() {

    //testToken : test if the user is loged in or not 
    testToken()

    $('.nav-link').click(function(e) {
        e.preventDefault();
        var link = $(this).data('link');
        $('.content').addClass('d-none');
        $('#' + link).removeClass('d-none');
        
        $('.nav-link').removeClass('active')
        $(this).addClass('active')
    });
    
    //testToken : test if the user is loged in or not 
    function testToken() {
      var token = $.cookie('token')
      if (token !== undefined){
        // User is logged in
        const userRole = getUserRoleFromToken();
        $('.nav-link[data-link="login"]').hide();
        $('.nav-link[data-link="register"]').hide();
        const profileDropdown = $('.profileDropdown')
        profileDropdown.show();
        if(userRole==='ADMIN'){
          $('#adminPanelLi').removeClass('d-none')
        }else{
          $('#adminPanelLi').addClass('d-none')
        }
      }else{
        // User is not logged in
        $('.nav-link[data-link="login"]').show();
        $('.nav-link[data-link="register"]').show();
        $('.profileDropdown').hide();
      }
    }


    //script for logout 
    $('#logoutButton').click(function() {
        $.ajax({
            url: '/logout',
            type: 'POST',
            success: function(response) {
              if (response.message === 'Logged out successfully') {
                testToken();
                $('.content').addClass('d-none');
                $('#home').removeClass('d-none');
                $('#postContent').empty();
                $('#postTitles').fadeIn();
                $('#logoutAlert').fadeIn();
                
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

      $(document).on('click', '.dropdown-toggle', function() {
        $('#home').removeClass('d-none');
      });
      

    //Loging using a json request 
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); 
        // Get the form data
        var email = $('#emailLogin').val();
        var password = $('#passwordLogin').val();
        $.ajax({
          url: '/login',
          method: 'POST',
          data: { email, password },
          success: function(response) {
            // Update the navigation bar
            testToken();
            $('.content').addClass('d-none');
            $('#home').removeClass('d-none');
            $('#postContent').empty();
            $('#postTitles').fadeIn();
            $('#successAlert').fadeIn();
          },
          error: function(xhr) {
            $('#errorDivP').html(xhr.responseJSON.error)
            $('#errorDiv').fadeIn();
          }
        });
      });

      $(document).on('click', '#closeAlertBtn', function() {
        $('#successAlert').fadeOut();
        sessionStorage.removeItem('isLoggedIn'); 
      });

      $('#incorrectDataBtn').click(function() {
        $('#errorDiv').fadeOut();
      });

      
      // Show the alert to notify the user that they are logged in successfully
      // dynamically after the page finishes loading
      $(window).on('load', function() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const isLoggedOut  = sessionStorage.getItem('isLoggedOut');
        if (window.location.pathname === '/' && isLoggedIn) {
          $('#successAlert').fadeIn();
          setTimeout(function() {
            $('#successAlert').fadeOut();
            sessionStorage.removeItem('isLoggedIn');
          }, 20000);
        }
        if (window.location.pathname === '/' && isLoggedOut) {
          
          $('#logoutAlert').fadeIn();
          setTimeout(function() {
            $('#logoutAlert').fadeOut();
            sessionStorage.removeItem('isLoggedOut');
          }, 20000);
        }
      });

      //validation of the of creatign account
      $('#registerForm').submit(function(e) {
        e.preventDefault(); 
        // Perform name, email, and password validation
        var name = $('#nameRegister').val();
        var email = $('#emailRegister').val();
        var password = $('#passwordRegister').val();
        var repassword = $('#repasswordRegister').val();
        // Validate name: accept characters that can be used in a name (letters, spaces, and hyphens)
        var nameRegex = /^[a-zA-Z\s-]+$/;
        $('#nameRegister, #emailRegister, #passwordRegister, #repasswordRegister').removeClass('invalid-input'); // Remove 'invalid-input' class from all input fields
        if (!nameRegex.test(name)) {
          $('#errorDivP').html('Invalid Name')
          $('#errorDiv').fadeIn();
          $('#nameRegister').addClass('invalid-input');
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
            $('#register').addClass('d-none');
            $('#login').removeClass('d-none');
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
            requestUrl = '/articles/categorie/' + idCategorie;
          }
          console.log(requestUrl)
          $.ajax({
            url: requestUrl,
            method: 'GET',
            success: function(response) {
              var posts = response.posts;
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
              for (var i = 0; i < posts.length; i++) {
                var post = posts[i];
                var postTitle = post.title;
                var createdAt = new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                var cardElement = $('<div>').addClass('card');
                var cardBodyElement = $('<div>').addClass('card-body');
                var titleElement = $('<a>')
                  .addClass('card-title post-title')
                  .attr('href', '#')
                  .data('post-id', post.id) 
                  .text(postTitle);
    
                var createdAtElement = $('<p>').addClass('post-date').text('Published on: ' + createdAt);
                var createdByElement = $('<span>').addClass('card-text').text('Published By: ');
                var src = post.photo;
                var createdByElementLink = $("<a href=\'#\'>").addClass('postAuthor').text(post.author.name);
                var postPhoto = $(`<img src=${src}>`).addClass('postPhoto')
                createdByElement.append(createdByElementLink)
                cardBodyElement.append(titleElement, postPhoto, createdAtElement,createdByElement);
                cardElement.append(cardBodyElement);
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
        fetchPostData(postId);
      });

      // Function to fetch post content and comments
      function fetchPostData(postId) {
        $.ajax({
          url: '/articles/' + postId, 
          method: 'GET',
          success: function(response) {
            $('#postTitles').fadeOut()
            $('#postDetail').fadeIn()
            var postData = response.post; 
            // Update the post content
            const titlePost =  $('<h2>').addClass('card-title headTitle').text(postData.title)
            var postContentContainer = $('#postContent');
            const src = postData.photo
            var postPhoto = $(`<img src=${src}>`).addClass('postPhoto')
            postContentContainerText = $('<span>').addClass('postContentText').text(postData.content)
            postContentContainer.append(titlePost, postPhoto,postContentContainerText)
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
            var token = $.cookie('token')
            if (token == undefined){
              var commentSection=`
                <div class="alert alert-warning">
                  You need to sign in to add comments.
                  <a href="#" class='nav-link alert-link" id="loginFromComment" data-link='loginFromComment'>
                    Sign in
                  </a>
                </div>
              `
            }else{
              var commentSection = `
              <div class="cardComment">
              <div class="row">
              <div class="col-10">
              <div class="comment-box ml-2">
              <h4>Add a comment</h4>
              <form method='post' id='commentSection'>
                <div class="comment-area">
                <textarea class="form-control" placeholder="what is your view?" rows="4"></textarea>
                </div>
                <div class="comment-btns mt-2">
                <div class="row">
                <div class="col-6">
                  <div class="pull-right">
                    <button class="btn btn-success send btn-sm">Add</button> 
                  </div>
                </div>
              </form>
              </div>
              </div>
              </div>
              </div>
              </div>
              </div> 
              `;
            }
            commentsContainer.append(commentSection);
            if(postData.comments.length<1)
              $('.subTitle').text('No comments')
            else{
              $('.subTitle').text('Recent comments')
            }
            $('#postComments').append(commentsContainer)
            $('#postDetail').append(postContentContainer, $('#postComments'));
          },
          error: function(error) {
            console.log('Error occurred while fetching post data:', error);
          }
        });
      }

      $(document).on('click', '#loginFromComment', function(e) {
          e.preventDefault();  
          console.log('HASSANI')
          $('.content').addClass('d-none');
          $('#login').removeClass('d-none');
      });

      //get listes of categories for database
      $.ajax({
        url: '/categories', 
        method: 'GET',
        success: function(response) {
          var categories = response.categories;
          var categoriesListContainer = $('#categoriesList');
          for (var i = 0; i < categories.length; i++) {
            var category = categories[i].name;
            var liElementLink = $('<a>')
                  .addClass('category-title')
                  .attr('href', '#') 
                  .data('categorie-id', categories[i].id) 
                  .text(category)
                  .on('click', function(event) {
                    event.preventDefault();
                    $('#postContent').empty();
                    var idCategorie = $(this).data('categorie-id');
                    home(idCategorie); 
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


      //Selecting user's info from DB 
      $('.nav-link[data-link="userProfile"]').click(function(e) {
          e.preventDefault(); 
          const {userId, userName, userEmail,userRole}=getUserInformationFromToken();
          $('#userName').text(userName);
          $('#userprofileEmail').text(userEmail);
          $('#userprofileRole').text(userRole);
      });


      //get user's info from token 
      function getUserInformationFromToken(){
          const token = $.cookie('token')
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const userId = tokenPayload.userId;
          const userName = tokenPayload.name;
          const userEmail = tokenPayload.email;
          const userRole = tokenPayload.role;
          return {userId, userName, userEmail,userRole}
      }

      //get user's ID from token 
      function getUserIDFromToken(){
          const token = $.cookie('token')
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const userId = tokenPayload.userId;
          return userId;
      }

      //get user's ID from token 
      function getUserRoleFromToken(){
        const token = $.cookie('token')
        // Decode the token payload using the atob function
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        // Access the user ID from the decoded token payload
        const userRole = tokenPayload.role;
        return userRole;
    }


      //Edit Profile By User : 
      //Selecting user's info from DB 
      $('.nav-link[data-link="profileEdit"]').click(function(e) {
          e.preventDefault(); 
          const {userId, userName, userEmail}=getUserInformationFromToken();
          // Update the user's name in the profile section
          $('#idEdit').val(userId);
          $('#nameEdit').val(userName);
          $('#emailEdit').val(userEmail);
    });




    // validation of the of creatign account
    $('#EditProfileForm').submit(function(e) {
        e.preventDefault(); 
        var id = $('#idEdit').val();
        var name = $('#nameEdit').val();
        var email = $('#emailEdit').val();
        var password = $('#passwordEdit').val();
        var repassword = $('#repasswordEdit').val();
        // Validate name: accept characters that can be used in a name (letters, spaces, and hyphens)
        var nameRegex = /^[a-zA-Z\s-]+$/;
        $('#nameEdit, #emailEdit, #passwordEdit, #repasswordEdit').removeClass('invalid-input'); // Remove 'invalid-input' class from all input fields
        if (!nameRegex.test(name)) {
          $('#errorDivP').html('Invalid Name')
          $('#errorDiv').fadeIn();
          $('#nameEdit').addClass('invalid-input');
          return;
        }
        // Validate email format using a regular expression
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#emailEdit').addClass('invalid-input');
            $('#errorDivP').html('Invalid Email')
            $('#errorDiv').fadeIn();
          return;
        }
        // Validate password length
        if (password.length < 6) {
          $('#passwordEdit').addClass('invalid-input');
          $('#errorDivP').html('Password must be more than 6 characters')
          $('#errorDiv').fadeIn();
          return;
        }
        // Check if password and re-entered password match
        if (password !== repassword) {
          $('#errorDivP').html('password doesn\'t match')
          $('#errorDiv').fadeIn();
          $('#passwordEdit, #repasswordEdit').addClass('invalid-input');
          // alert('Passwords do not match.');
          return;
        }
    
        // If validation passes, send the data to the server
        var userData = {
          id:id,
          name: name,
          email: email,
          password: password
        };
        $.ajax({
          url: '/users',
          method: 'PATCH',
          data: userData,
          success: function(response) {
            // $('.nav-link[data-link="profileMyPosts"]').trigger('click');
            $('.content').addClass('d-none');
            $('#userProfile').removeClass('d-none');

            $('#editSuccessP').html('Modification is done')
            $('#editSuccess').fadeIn();
            $('#closeEditSuccess').click(function() {
            $('#editSuccess').fadeOut();
        });
          },
          error: function(error) {
            console.log('Error occurred', error);
          }
        });
    });

    //adding a post 
    $('#addPostForm').submit(function(e) {
        e.preventDefault(); 
        var title = $('#postTitleAdd').val();
        var content = $('#postContentAdd').val();
        var photo = $('#postPhotoAdd').val(); 
        const userId = getUserIDFromToken()
        var postData = {
          authorId:userId,
          title: title,
          content: content,
          photo: photo
        };
        console.log(postData)
        $.ajax({
          url: '/articles',
          method: 'POST',
          data: postData,
          success: function(response) {
            $('.nav-link[data-link="profileMyPosts"]').trigger('click');
          },
          error: function(error) {
            console.log('Error adding post:', error);
          }
        });
  });


  //Editing a post 
  $('#editPostForm').submit(function(e) {
      e.preventDefault(); 
      var title = $('#postTitleEdit').val();
      var content = $('#postContentEdit').val();
      var photo = $('#postPhotoEdit').val(); 
      var postId = $('#postIDEdit').val(); 
      var postData = {
        id:postId,
        title: title,
        content: content,
        photo: photo
      };
      console.log(postData)
      $.ajax({
        url: '/articles',
        method: 'PATCH',
        data: postData,
        success: function(response) {
          $('.nav-link[data-link="profileMyPosts"]').trigger('click');
        },
        error: function(error) {

          console.log('Error adding post:', error);
        }
      });
  });


  //Selecting user's info from DB 
  $('.nav-link[data-link="profileMyPosts"]').click(function(e) {
    e.preventDefault(); 
    const userId=getUserIDFromToken();
    console.log(userId)
    $.ajax({
      url: '/articles/user/'+userId,
      method: 'GET',
      success: function(response) {
        var postsHTML = '';
        response.posts.forEach(function(post) {
          const datePub = new Date(post.createdAt);
          formatedDate = datePub.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const postId = post.id;
          const editButton = `<button class="btn btn-primary edit-post" data-post-id="${postId}" data-link="profileEditPost">Edit Post</button>`;
          const deleteButton = `<button class="btn btn-danger delete-post" data-post-id="${postId}">Delete Post</button>`;
          postsHTML += `
            <div class="col-md-8 offset-md-2">
              <div class="post-container">
                <h1 class="post-title">${post.title}</h1>
                <p class="post-date">Published on ${formatedDate}</p>
                <div class="post-content">
                  <p>${post.content}</p>
                </div>
                <div class="action-buttons">
                  ${editButton}
                  ${deleteButton}
                </div>
              </div>
            </div>
          `;
        });
        $('#profileMyPosts').html(postsHTML);
      },
      error: function(error) {
        // Handle error response
        console.log('Error in Retreiving posts:', error);
      }
    });
});

// script for edit post
$(document).on('click', '.edit-post', function(e) {
    e.preventDefault()
    const postId = $(this).data('post-id');
    $.ajax({
      url: '/articles/' + postId, 
      method: 'GET',
      success: function(response) {
        $('.content').addClass('d-none');
        $('#profileEditPost').removeClass('d-none');  
        
        $('#postIDEdit').val(response.post.id);
        $('#postTitleEdit').val(response.post.title);
        $('#postContentEdit').val(response.post.content);
      },
      error: function(error) {
        console.log('Error retrieving post data:', error);
      }
    });
});



//delete post 
  $(document).on('click', '.delete-post', function(e) {
      e.preventDefault();
      const postId = $(this).data('post-id');
      console.log('Deleting post with ID:', postId);
      $.ajax({
        url: '/articles/' + postId,
        method: 'DELETE',
        success: function(response) {
          $('.nav-link[data-link="profileMyPosts"]').trigger('click');
        },
        error: function(error) {
          // Handle error response
          console.log('Error deleting post:', error);
        }
      });
  });








});


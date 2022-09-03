"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();
  try {

    // grab the username and password
    const username = $("#login-username").val();
    const password = $("#login-password").val();

    // User.login retrieves user info from API and returns User instance
    // which we'll make the globally-available, logged-in user.
    currentUser = await User.login(username, password);

    $loginForm.trigger("reset");

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  } catch (error) {
    loginSignupERROR(error)
  }
  //rebuild page to reflect favorits
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();
  try {

    const name = $("#signup-name").val();
    const username = $("#signup-username").val();
    const password = $("#signup-password").val();

    // User.signup retrieves user info from API and returns User instance
    // which we'll make the globally-available, logged-in user.
    currentUser = await User.signup(username, password, name);

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();

    $signupForm.trigger("reset");
  } catch (error) {
    loginSignupERROR(error)
  }
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
  //shouldnt you update the UI here after setting current user. not on main.js line54
  // if (currentUser) updateUIOnUserLogin();
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  //I changed this section to hide the login and signup forms
  //and to update the stories list incase new stories were submited during login/signup
  //this also marks stories as favorits if user has some in current user.favorits
  // $allStoriesList.show();
  hidePageComponents();

  //this will make another api call
  // getAndShowStoriesOnStart();

  //this will rebuild the current list of stories that we have in memory
  putStoriesOnPage()

  updateNavOnLogin();
}
function showUserProfile(username) {
  hidePageComponents();
  $profileEditForm.show()
  $deleteAccount.show()
}
async function editProfile(evt) {
  evt.preventDefault();
  try {
    const fullName = $('#full-name').val();
    const { token, username } = localStorage;
    const res = await axios({
      url: `${BASE_URL}/users/${username}`,
      method: "PATCH",
      data: {
        token,
        user: { name: fullName }
      },
    });
    alert('Name has been updated')
    $profileEditForm.trigger('reset');
    await checkForRememberedUser();
    $("#nav-all").trigger('click');
  } catch (error) {
    handleErrors(error)
  }
}
$profileEditForm.on('submit', editProfile)
$navUserProfile.on('click', showUserProfile)


async function goodBye(e) {
  e.preventDefault();
  hidePageComponents();
  try {
    const { token, username } = localStorage;
    const res = await axios({
      url: `${BASE_URL}/users/${username}`,
      method: "DELETE",
      data: { token },
    });
    alert('GOODBYE :( ')
    $navLogOut.trigger('click');
  } catch (error) {
    handleErrors(error)
  }
}
$deleteAccount.on('click', goodBye)
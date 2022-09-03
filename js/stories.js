"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  $storiesLoadingMsg.show();
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.hide();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let isFav = 'bi-pin'
  let fav = false;
  let canDelete = 'hidden';
  let canFav = 'hidden';
  if (currentUser) {
    isFav = currentUser.favorites.some((fav) => fav.storyId === story.storyId) ? 'bi-pin-fill' : 'bi-pin';
    if (isFav === 'bi-pin-fill') { fav = true; }
    canDelete = currentUser.ownStories.some((own) => own.storyId === story.storyId) ? 'trash' : 'hidden';
    canFav = 'fav';
  }
  const hostName = story.getHostName();
  return $(`
      <li data-fav="${fav}" id="${story.storyId}">
      <a href="#" id="favorite" class="${canFav}"><i class="bi ${isFav}"></i></a>
      <a href="#" id="trash" class="${canDelete}"><i class="bi bi-trash"></i></a>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//handles submiting new story
async function submitStory(evt) {
  evt.preventDefault()
  const story = {
    author: $('#author').val(),
    title: $('#title').val(),
    url: $('#url').val(),
  }
  const newStoryRES = await storyList.addStory(currentUser, story);
  if (newStoryRES) { alert('New Story Created'); }
  $storyForm.trigger("reset");
  // storyList.stories.push(newStory);
  //reset the DOM to show the new story. 
  //if you use reload here you will not be able to show errors to the user unless you alert first. 
  // location.reload();
  await checkForRememberedUser();
  $("#nav-all").trigger('click');
}
$storyForm.on('submit', submitStory)


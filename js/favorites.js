async function UpdateFavorite(username, storyId, favICON, METHOD) {
    try {
        const token = localStorage.token;
        const res = await axios({
            url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
            method: METHOD,
            data: { token },
        });
        if (METHOD === 'POST') {
            favICON.removeClass('bi-pin').addClass('bi-pin-fill');
            favICON.parents('li').data('fav', true);
        } else {
            favICON.removeClass('bi-pin-fill').addClass('bi-pin');
            favICON.parents('li').data('fav', false);
        }
        //this logs in again and will updated the favorits array from the Database
        await checkForRememberedUser();
    } catch (error) {
        handleErrors(error)
    }
}

$storyContainer.on('click', '#favorite', (e) => {
    e.preventDefault();
    const favICON = $(e.target);
    const storyId = favICON.parents('li').attr('id');
    const username = currentUser.username;
    const METHOD = favICON.parents('li').data('fav') ? 'DELETE' : 'POST';
    UpdateFavorite(username, storyId, favICON, METHOD);
});



async function deleteStory(storyId, storyLI) {
    try {
        const token = localStorage.token;
        const res = await axios({
            url: `${BASE_URL}/stories/${storyId}`,
            method: "DELETE",
            data: { token },
        });
        await checkForRememberedUser();
        storyLI.remove();
    } catch (error) {
        handleErrors(error)
    }
}

$storyContainer.on('click', '#trash', (e) => {
    e.preventDefault();
    const storyLI = $(e.target).parents('li');
    const storyId = storyLI.attr('id');
    deleteStory(storyId, storyLI);
})


function getAndShowFavoriteStories() {
    hidePageComponents();
    storyList = new StoryList(currentUser.favorites);
    putStoriesOnPage();
}
const $favStories = $('#fav-stories');
$favStories.on('click', getAndShowFavoriteStories);

function getAndShowMyStoies() {
    hidePageComponents();
    storyList = new StoryList(currentUser.ownStories);
    putStoriesOnPage();
}
const $navMyStories = $('#nav-my-stories');
$navMyStories.on('click', getAndShowMyStoies);

function handleErrors(error) {
    const message = error.response.data.error.title || 'something went wrong';
    alert(message);
    $("#nav-all").trigger('click');
}
function loginSignupERROR(error) {
    const message = error.response.data.error.title || 'something went wrong';
    alert(message);
}
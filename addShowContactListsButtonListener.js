function addShowContactListsButtonListener(platformClient) {
  const showContactListsButton = document.getElementById('showContactLists');
  showContactListsButton.addEventListener('click', function() {
    fetchContactLists(platformClient);
  });
}

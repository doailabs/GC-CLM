function addShowContactListsButtonListener(platformClient) {
  console.log('addShowContactListsButtonListener called');

  const showContactListsButton = document.querySelector('#showContactLists');
  const contactListsContainer = document.querySelector('#contactLists');

  showContactListsButton.addEventListener('click', () => {
    contactListsContainer.innerHTML = '';
    fetchContactLists(platformClient);
  });
}

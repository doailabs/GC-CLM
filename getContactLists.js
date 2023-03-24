// getContactLists.js
function fetchContactLists(platformClient) {
    console.log('getContactLists called');

    function displayContactLists(contactLists) {
        console.log('displayContactLists', contactLists);
        const contactListsContainer = document.getElementById('contactLists');

        contactLists.forEach(list => {
            const listItem = document.createElement('p');
            listItem.textContent = `${list.name} - ${list.id}`;
            contactListsContainer.appendChild(listItem);
        });
    }

    function fetchContactListsFromApi() {
        console.log('fetchContactListsFromApi');
        const apiInstance = new platformClient.OutboundApi();

        apiInstance.getOutboundContactlists()
            .then(response => {
                console.log('getOutboundContactlists response', response);
                const contactLists = response.entities;
                displayContactLists(contactLists);
            })
            .catch(error => console.error('Error al cargar las contact lists:', error));
    }

    fetchContactListsFromApi();
}

function setupContactListButton(clientId) {
    document.addEventListener('DOMContentLoaded', function () {
        const showContactListButton = document.getElementById('showContactListButton');
        if (showContactListButton) {
            showContactListButton.addEventListener('click', function () {
                startGCSDKs(clientId).then(platformClient => {
                    fetchContactLists(platformClient);
                });
            });
        }
    });
}

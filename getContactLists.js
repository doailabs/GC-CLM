function addShowContactListsButtonListener(platformClient) {
    const showContactListsBtn = document.getElementById('showContactListsBtn');

    showContactListsBtn.addEventListener('click', function () {
        fetchContactLists(platformClient);
    });
}

function fetchContactLists(platformClient) {
    console.log('Starting fetchContactLists');
    const apiInstance = new platformClient.OutboundApi();

    apiInstance.getOutboundContactlists()
        .then(response => {
            console.log('getOutboundContactlists response', response);
            const contactLists = response.entities;
            displayContactLists(contactLists);
        })
        .catch(error => console.error('Error al cargar las contact lists:', error));
}

function displayContactLists(contactLists) {
    console.log('displayContactLists', contactLists);
    const contactListsContainer = document.getElementById('contactLists');

    contactLists.forEach(list => {
        const listItem = document.createElement('p');
        listItem.textContent = `${list.name} - ${list.id}`;
        contactListsContainer.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const clientId = '479255ae-cf23-4c2e-9209-555370df882c';
    startGCSDKs(clientId).then(platformClient => {
        addShowContactListsButtonListener(platformClient);
    });
});

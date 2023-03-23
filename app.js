document.addEventListener('DOMContentLoaded', function () {
    const platformClient = require('platformClient');
    const clientApp = require('purecloud-client-app-sdk');

    const client = platformClient.ApiClient.instance;
    clientApp.init(client);

    // Reemplaza YOUR_CLIENT_ID con tu Client ID
    const clientId = '479255ae-cf23-4c2e-9209-555370df882c';
    const redirectUri = `${window.location.protocol}//${window.location.host}`;

    client.setEnvironment('mypurecloud.com');
    client.setPersistSettings(true, 'GenesysCloudApp');

    function displayContactLists(contactLists) {
        const contactListsContainer = document.getElementById('contactLists');

        contactLists.forEach(list => {
            const listItem = document.createElement('p');
            listItem.textContent = `${list.name} - ${list.id}`;
            contactListsContainer.appendChild(listItem);
        });
    }

    function fetchContactLists() {
        const apiInstance = new platformClient.OutboundApi();

        apiInstance.getOutboundContactlists()
            .then(response => {
                const contactLists = response.entities;
                displayContactLists(contactLists);
            })
            .catch(error => console.error('Error al cargar las contact lists:', error));
    }

    client.loginImplicitGrant(clientId, redirectUri)
        .then(fetchContactLists)
        .catch(error => console.error('Error al autenticar:', error));
});

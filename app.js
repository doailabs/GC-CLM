document.addEventListener('DOMContentLoaded', function () {
    
    console.log('DOMContentLoaded');

    const platformClient = require("purecloud-platform-client-v2");
    console.log('platformClient', platformClient);

    const clientApp = require('purecloud-client-app-sdk');
    console.log('clientApp', clientApp);

    const client = platformClient.ApiClient.instance;
    console.log('client', client);

    clientApp.init(client);

    const clientId = '479255ae-cf23-4c2e-9209-555370df882c';
    const redirectUri = `${window.location.protocol}//${window.location.host}`;
    console.log('clientId', clientId);
    console.log('redirectUri', redirectUri);

    client.setEnvironment('mypurecloud.com');
    client.setPersistSettings(true, 'GenesysCloudApp');

    function displayContactLists(contactLists) {
        console.log('displayContactLists', contactLists);
        const contactListsContainer = document.getElementById('contactLists');

        contactLists.forEach(list => {
            const listItem = document.createElement('p');
            listItem.textContent = `${list.name} - ${list.id}`;
            contactListsContainer.appendChild(listItem);
        });
    }

    function fetchContactLists() {
        console.log('fetchContactLists');
        const apiInstance = new platformClient.OutboundApi();

        apiInstance.getOutboundContactlists()
            .then(response => {
                console.log('getOutboundContactlists response', response);
                const contactLists = response.entities;
                displayContactLists(contactLists);
            })
            .catch(error => console.error('Error al cargar las contact lists:', error));
    }

    console.log('before loginImplicitGrant');
    client.loginImplicitGrant(clientId, redirectUri)
        .then(() => {
            console.log('loginImplicitGrant success');
            fetchContactLists();
        })
        .catch(error => console.error('Error al autenticar:', error));
});

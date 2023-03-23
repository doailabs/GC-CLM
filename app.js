document.addEventListener('DOMContentLoaded', function () {
    
    console.log('DOMContentLoaded');

    const platformClient = require('platformClient');
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
        const contactListsTableBody = document.querySelector('#contactListsTable tbody');

        contactLists.forEach(list => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = list.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = list.name;
            row.appendChild(nameCell);

            const createdByCell = document.createElement('td');
            createdByCell.textContent = list.createdBy;
            row.appendChild(createdByCell);

            const dateCreatedCell = document.createElement('td');
            dateCreatedCell.textContent = new Date(list.dateCreated).toLocaleString();
            row.appendChild(dateCreatedCell);

            const dateModifiedCell = document.createElement('td');
            dateModifiedCell.textContent = new Date(list.dateModified).toLocaleString();
            row.appendChild(dateModifiedCell);

            contactListsTableBody.appendChild(row);
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

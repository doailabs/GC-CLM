document.addEventListener('DOMContentLoaded', function () {
    const platformClient = require('platformClient');
    const clientApp = require('purecloud-client-app-sdk');

    const client = platformClient.ApiClient.instance;
    clientApp.init(client);

    const clientId = '479255ae-cf23-4c2e-9209-555370df882c';
    const redirectUri = `${window.location.protocol}//${window.location.host}`;

    client.setEnvironment('mypurecloud.de');
    client.setPersistSettings(true, 'GenesysCloudApp');

    const downloadListsButton = document.getElementById('downloadListsButton');
    downloadListsButton.addEventListener('click', downloadContactLists);

    const contactListsTableBody = document.getElementById('contactListsTable').getElementsByTagName('tbody')[0];

    function displayContactLists(contactLists) {
        contactListsTableBody.innerHTML = '';

        contactLists.forEach(list => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = list.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = list.name;
            row.appendChild(nameCell);

            const createdByCell = document.createElement('td');
            createdByCell.textContent = list.createdBy.name;
            row.appendChild(createdByCell);

            const createdDateCell = document.createElement('td');
            createdDateCell.textContent = new Date(list.dateCreated).toLocaleDateString();
            row.appendChild(createdDateCell);

            const modifiedDateCell = document.createElement('td');
            modifiedDateCell.textContent = new Date(list.dateModified).toLocaleDateString();
            row.appendChild(modifiedDateCell);

            contactListsTableBody.appendChild(row);
        });
    }

    function downloadContactLists() {
        const apiInstance = new platformClient.OutboundApi();

        apiInstance.getOutboundContactlists()
            .then(response => {
                const contactLists = response.entities;
                downloadCsv(contactLists);
            })
            .catch(error => console.error('Error al descargar las contact lists:', error));
    }

    function downloadCsv(contactLists) {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Nombre,Creado por,Fecha de Creación,Fecha de Modificación\n";

        contactLists.forEach(list => {
            csvContent += `${list.id},"${list.name}",${list.createdBy.name},${new Date(list.dateCreated).toLocaleDateString()},${new Date(list.dateModified).toLocaleDateString()}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contactLists.csv");
        document.body.appendChild(link);
        link.click();
    }

    client.loginImplicitGrant(clientId, redirectUri)
        .then(() => {
            const apiInstance = new platformClient.OutboundApi();

            apiInstance.getOutboundContactlists()
                .then(response => {
                    const contactLists = response.entities;
                    displayContactLists(contactLists);
                })
                .catch(error => console.error('Error al cargar las contact lists:', error));
        })
        .catch(error => console.error('Error al autenticar:', error));
});

function fetchContactLists(platformClient) {
    console.log('fetchContactLists start');

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

    const tableBody = document.querySelector('#contactListsTable tbody');
    tableBody.innerHTML = '';

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

        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = list.dateCreated;
        row.appendChild(createdAtCell);

        const updatedAtCell = document.createElement('td');
        updatedAtCell.textContent = list.dateModified;
        row.appendChild(updatedAtCell);

        tableBody.appendChild(row);
    });
}

const clientId = '479255ae-cf23-4c2e-9209-555370df882c';

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

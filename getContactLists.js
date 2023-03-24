// getContactLists.js
function fetchContactLists(platformClient) {
    console.log('getContactLists called');

    function displayContactLists(contactLists) {
        console.log('displayContactLists', contactLists);
        const contactListsTableBody = document.querySelector('#contactListsTable tbody');

        contactLists.forEach(list => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = list.id;
            const nameCell = document.createElement('td');
            nameCell.textContent = list.name;
            const sizeCell = document.createElement('td');
            sizeCell.textContent = list.size;
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(sizeCell);
            contactListsTableBody.appendChild(row);
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

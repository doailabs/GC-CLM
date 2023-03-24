function fetchContactLists(platformClient) {
  console.log('getContactLists called');

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

      const countCell = document.createElement('td');
      countCell.textContent = list.size;
      row.appendChild(countCell);

      const createdByCell = document.createElement('td');
      createdByCell.textContent = list.createdBy.name;
      row.appendChild(createdByCell);

      const createdDateCell = document.createElement('td');
      createdDateCell.textContent = new Date(list.dateCreated).toLocaleString();
      row.appendChild(createdDateCell);

      const modifiedDateCell = document.createElement('td');
      modifiedDateCell.textContent = new Date(list.dateModified).toLocaleString();
      row.appendChild(modifiedDateCell);

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

function setupContactListButton(clientId) {
  document.addEventListener('DOMContentLoaded', function () {
    const showContactListButton = document.getElementById('showContactLists');
    if (showContactListButton) {
      showContactListButton.addEventListener('click', function () {
        startGCSDKs(clientId).then(platformClient => {
          fetchContactLists(platformClient);
        });
      });
    }
  });
}

let currentPage = 1;
let platformClientInstance;
const contactListHandlers = {
  fetchContactLists(platformClient, pageNumber = 1) {
    currentPage = pageNumber;
    platformClientInstance = platformClient;
    console.log('getContactLists called');

    function displayContactLists(contactLists) {
      console.log('displayContactLists', contactLists);
      const contactListsTableBody = document.querySelector('#contactListsTable tbody');
      contactListsTableBody.innerHTML = '';

      contactLists.forEach(list => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = list.id;
        const nameCell = document.createElement('td');
        nameCell.textContent = list.name;
        const dateCreatedCell = document.createElement('td');
        dateCreatedCell.textContent = list.dateCreated;
        const divisionCell = document.createElement('td');
        divisionCell.textContent = list.division.name;
        const radioCell = document.createElement('td');
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'contactList';
        radioButton.value = list.id;
        radioButton.addEventListener('change', () => {
          handleContactListSelection(list.id);
        });
        radioCell.appendChild(radioButton);
        row.appendChild(radioCell);
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(dateCreatedCell);
        row.appendChild(divisionCell);
        contactListsTableBody.appendChild(row);
      });
    }

    function fetchContactListsFromApi(pageNumber) {
      console.log('fetchContactListsFromApi');
      const apiInstance = new platformClient.OutboundApi();
      const pageSize = 25;

      const opts = {
        "pageSize": pageSize,
        "pageNumber": pageNumber
      };

    apiInstance.getOutboundContactlists(opts)
      .then(response => {
        console.log('getOutboundContactlists response', response);
        const contactLists = response.entities;
        const totalPages = response.pageCount;
        displayContactLists(contactLists);
        contactListHandlers.updatePaginationButtons(totalPages); // Corrección aquí
      })
      .catch(error => console.error('Error al cargar las contact lists:', error));
  }

    fetchContactListsFromApi(pageNumber);
  },

  updatePaginationButtons(totalPages) {
    const previousPageBtn = document.querySelector('#previousPageBtn');
    const nextPageBtn = document.querySelector('#nextPageBtn');

    if (currentPage === 1) {
      previousPageBtn.disabled = true;
    } else {
      previousPageBtn.disabled = false;
    }

    if (currentPage === totalPages) {
      nextPageBtn.disabled = true;
    } else {
      nextPageBtn.disabled = false;
    }

    previousPageBtn.onclick = () => {
      currentPage -= 1;
      contactListHandlers.fetchContactLists(platformClientInstance, currentPage); // Corrección aquí
    };
    nextPageBtn.onclick = () => {
      currentPage += 1;
      contactListHandlers.fetchContactLists(platformClientInstance, currentPage); // Corrección aquí
    };
  },
  
  addShowContactListsButtonListener(platformClient) {
    console.log('addShowContactListsButtonListener called');

    const showContactListsButton = document.querySelector('#showContactLists');
    const contactListsContainer = document.querySelector('#contactLists');

    showContactListsButton.addEventListener('click', () => {
      contactListsContainer.innerHTML = '';
      contactListHandlers.fetchContactLists(platformClient);
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.contactListHandlers = contactListHandlers;
});




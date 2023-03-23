function displayContactLists(contactLists) {
    console.log('displayContactLists', contactLists);
    const contactListsContainer = document.getElementById('contactLists');

    contactLists.forEach(list => {
        const listItem = document.createElement('p');
        listItem.textContent = `${list.name} - ${list.id}`;
        contactListsContainer.appendChild(listItem);
    });
}

function fetchContactLists(platformClient) {
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

// No llames a fetchContactLists aquí, ya que ahora se llama desde index.html

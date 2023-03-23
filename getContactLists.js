function fetchContactLists(platformClient) {
    console.log('Inicio de fetchContactLists'); // Agregado

    const outboundApi = new platformClient.OutboundApi();

    outboundApi.getOutboundContactlists()
        .then(response => {
            console.log('Respuesta exitosa de getOutboundContactlists'); // Agregado
            console.log('Response:', response); // Agregado
            const contactLists = response.entities;
            displayContactLists(contactLists);
        })
        .catch(error => {
            console.error('Error al cargar las contact lists:', error);
        });
}

function displayContactLists(contactLists) {
    console.log('Inicio de displayContactLists'); // Agregado
    console.log('ContactLists:', contactLists); // Agregado

    const contactListsContainer = document.getElementById('contactLists');

    contactLists.forEach(list => {
        const listItem = document.createElement('p');
        listItem.textContent = `${list.name} - ${list.id}`;
        contactListsContainer.appendChild(listItem);
    });
}

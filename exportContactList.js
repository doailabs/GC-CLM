let selectedContactListId;
let csvData;

function handleContactListSelection(platformClient, contactListId, clientId) {
  selectedContactListId = contactListId;
  initiateContactListExport(platformClient, contactListId, clientId);
}

function initiateContactListExport(platformClient, contactListId, clientId) {
  const apiInstance = new platformClient.OutboundApi();
  apiInstance.postOutboundContactlistExport(contactListId)
    .then(response => {
      console.log('Export initiated:', response);
      setTimeout(() => {
        downloadExportedCsv(apiInstance, contactListId, response.id, clientId);
      }, 2000);
    })
    .catch(error => console.error('Error al iniciar la exportación de la lista de contactos:', error));
}

function downloadExportedCsv(apiInstance, contactListId, jobId, clientId, tries = 0) {
  
  let opts = { 
    "download": "false"
  };

  apiInstance.getOutboundContactlistExport(contactListId, opts)
    .then(response => {
      console.log('Trabajo de exportación completado, URI de descarga:', response.uri);
      return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(response.uri)}`)//usando proxy api.allorigins.win para evitar error CORS
    })
    .then(response => response.text())
    .then(data => {
      csvData = data;
      showContactListRecords(csvData);
    })
    .catch(error => {
      console.error('Error al descargar el CSV de la contact list exportado. Reintentando en 2 segundos...', error);
      if (tries < 5) {
        setTimeout(() => {
          downloadExportedCsv(apiInstance, contactListId, jobId, tries + 1);
        }, 2000);
      } else {
        console.error('Error exportando el csv de la contact list. Máximo número de reintentos alcanzado');
      }
    });
}

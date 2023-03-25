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
        downloadExportedCsv(platformClient, contactListId, response.id, clientId);
      }, 2000);
    })
    .catch(error => console.error('Error al iniciar la exportación de la lista de contactos:', error));
}

function downloadExportedCsv(platformClient, contactListId, jobId, clientId, tries = 0) {
  const apiInstance = new platformClient.OutboundApi();
  let opts = { 
    "download": "false"
  };
  apiInstance.getOutboundContactlistExport(contactListId, opts)
    .then(response => {
      console.log('response.uri:', response.uri);
      return fetch(response.uri);
    })
    .then(response => {
      console.log('Trabajo de exportación completado, archivo descargado:', response);
      csvData = response.body;
      showContactListRecords(csvData);
    })
    .catch(error => {
      console.error('Error al descargar el CSV de la contact list exportado. Reintentando en 2 segundos...', error);
      if (tries < 3) {
        setTimeout(() => {
          downloadExportedCsv(platformClient, contactListId, jobId, tries + 1);
        }, 2000);
      } else {
        console.error('Error exportando el csv de la contact list. Máximo número de reintentos alcanzado');
      }
    });
}

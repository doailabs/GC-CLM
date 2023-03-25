let selectedContactListId;
let csvData;

function handleContactListSelection(platformClient, contactListId) {
  selectedContactListId = contactListId;
  initiateContactListExport(platformClient, contactListId);
}

function initiateContactListExport(platformClient, contactListId) {
  const apiInstance = new platformClient.OutboundApi();
  apiInstance.postOutboundContactlistExport(contactListId)
    .then(response => {
      console.log('Export initiated:', response);
      setTimeout(() => {
        downloadExportedCsv(apiInstance, contactListId, response.id);
      }, 2000);
    })
    .catch(error => console.error('Error al iniciar la exportación de la lista de contactos:', error));
}

function downloadExportedCsv(apiInstance, contactListId, jobId, tries = 0) {
  const opts = {
    "download": true
  };
  const accessToken = platformClient.ApiClient.instance.authData.accessToken;
  const headers = {
    "Authorization": `Bearer ${accessToken}`
  };
  apiInstance.getOutboundContactlistExport(contactListId, opts, headers)
    .then(response => {
      console.log('Trabajo de exportación completado, URI de descarga:', response.uri);
      return fetch(response.uri);
    })
    .then(response => response.text())
    .then(data => {
      csvData = data;
      showContactListRecords(csvData);
    })
    .catch(error => {
      console.error('Error al descargar el CSV exportado. Reintentando en 2 segundos...', error);
      if (tries < 5) {
        setTimeout(() => {
          downloadExportedCsv(apiInstance, contactListId, jobId, tries + 1);
        }, 2000);
      } else {
        console.error('Error exportando el csv de la contact list');
      }
    });
}

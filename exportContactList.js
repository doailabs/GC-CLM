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
        getDownloadUrl(platformClient, contactListId, clientId);
      }, 2000);
    })
    .catch(error => console.error('Error iniciando contact list export:', error));
}

function getDownloadUrl(platformClient, contactListId, clientId, tries = 0) {
  const apiInstance = new platformClient.OutboundApi();
  apiInstance.getOutboundContactlistExport(contactListId)
    .then((data) => {
      console.log(`getOutboundContactlistExport success! data: ${JSON.stringify(data, null, 2)}`);
      console.log('Download URL recuperada:', data.uri);

      // Extraer el downloadID de la URL
      const downloadId = data.uri.split('/').pop();

      // Realizar la siguiente llamada a la API
      getFinalDownloadUrl(platformClient, downloadId);
    })
    .catch((err) => {
      console.log("Ha habido un fallo recuperando la URL de exportación");
      console.error(err);
    });
}

async function getFinalDownloadUrl(platformClient, downloadId) {
  const apiInstance = new platformClient.DownloadsApi();
  const issueRedirect = false;
  let opts = { 
  "issueRedirect": false,  
  "redirectToAuth": false 
};
  
  try {
    const data = await apiInstance.getDownload(downloadId, opts);
    console.log('Final download URL:', data.uri);
    downloadExportedCsv(data.uri);
  } catch (err) {
    console.error('Error al obtener la URL de descarga final:', err);
  }
}


async function downloadExportedCsv(uri) {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Error al descargar el archivo CSV: ${response.statusText}`);
    }

    const csvData = await response.text();
    showContactListRecords(csvData);
  } catch (error) {
    console.error('Ha ocurrido un error:', error);
  }
}



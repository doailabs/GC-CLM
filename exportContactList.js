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
    .catch(error => console.error('Error initiating contact list export:', error));
}

function getDownloadUrl(platformClient, contactListId, clientId, tries = 0) {
  const apiInstance = new platformClient.OutboundApi();
  apiInstance.getOutboundContactlistExport(contactListId)  
    .then((data) => {
      console.log(`getOutboundContactlistExport success! data: ${JSON.stringify(data, null, 2)}`);
      console.log('data.uri ', data.uri);
    })
    .catch((err) => {
      console.log("There was a failure calling getOutboundContactlistExport");
      console.error(err);
    });
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



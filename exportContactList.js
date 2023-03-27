let selectedContactListId;
let csvData;

async function handleContactListSelection(platformClient, contactListId, clientId) {
  selectedContactListId = contactListId;
  await initiateContactListExport(platformClient, contactListId);
  await downloadExportedCsv(platformClient, contactListId);
}

async function initiateContactListExport(platformClient, contactListId) {
  const apiInstance = new platformClient.OutboundApi();
  try {
    const response = await apiInstance.postOutboundContactlistExport(contactListId);
    console.log('Export iniciado:', response);
  } catch (error) {
    console.error('Error al iniciar la exportación de la lista de contactos:', error);
    throw error;
  }
}

async function downloadExportedCsv(platformClient, contactListId, tries = 0) {
  const apiInstance = new platformClient.OutboundApi();
  try {
    const response = await apiInstance.getOutboundContactlistExport(contactListId, {download: 'false'});
    console.log('Estado de exportación:', response.status);
    if (response.status === 'COMPLETE') {
      const downloadUrl = response.uri + '?issueRedirect=false';
      console.log('URL de descarga:', downloadUrl);
      const response2 = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${platformClient.getAuth().getAccessToken()}`
        }
      });
      const responseBody = await response2.json();
      console.log('URL del archivo de exportación:', responseBody.uri);
      csvData = responseBody.uri;
      showContactListRecords(csvData);
    } else {
      console.log('Esperando que se complete la exportación...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return downloadExportedCsv(platformClient, contactListId, tries + 1);
    }
  } catch (error) {
    console.error('Error al descargar el archivo CSV:', error);
    if (tries < 3) {
      console.log(`Reintentando en ${tries + 1} segundos...`);
      await new Promise(resolve => setTimeout(resolve, (tries + 1) * 1000));
      return downloadExportedCsv(platformClient, contactListId, tries + 1);
    } else {
      throw error;
    }
  }
}

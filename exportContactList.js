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
  let downloadUrl = '';
  try {
    const response = await apiInstance.getOutboundContactlistExport(contactListId, {"download": "false"});
    console.log('Estado de exportación:', response.status);
    if (response.status === 'COMPLETE') {
      downloadUrl = response.uri;
    } else {
      console.log('Esperando que se complete la exportación...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return downloadExportedCsv(platformClient, contactListId, tries + 1);
    }
  } catch (error) {
    console.error('Error al comprobar el estado de la exportación:', error);
    if (tries < 3) {
      console.log(`Reintentando en ${tries + 1} segundos...`);
      await new Promise(resolve => setTimeout(resolve, (tries + 1) * 1000));
      return downloadExportedCsv(platformClient, contactListId, tries + 1);
    } else {
      throw error;
    }
  }

  try {
    const redirectResponse = await fetch(`${downloadUrl}?issueRedirect=false`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${platformClient.getAuth().getAccessToken()}`
      },
      redirect: 'manual'
    });
    console.log('Respuesta de redirección:', redirectResponse);
    if (redirectResponse.status === 307) {
      const redirectUrl = redirectResponse.headers.get('Location');
      console.log('URL de redirección:', redirectUrl);
      const response = await fetch(redirectUrl);
      const responseBody = await response.json();
      console.log('URL del archivo de exportación:', responseBody.url);
      csvData = responseBody.url;
      showContactListRecords(csvData);
    } else {
      console.error('Error al obtener la URL de redirección:', redirectResponse);
      throw new Error('Error al obtener la URL de redirección');
    }
  } catch (error) {
    console.error('Error al descargar el archivo CSV:', error);
    throw error;
  }
}

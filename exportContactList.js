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
  let opts = { 
    "download": "true"
  };
  apiInstance.getOutboundContactlistExport(contactListId, opts)
    .then(response => {
      console.log('Download URL retrieved:', response.uri);
      const modifiedUrl = response.uri + '?issueRedirect=false';
      console.log('Modified URL:', modifiedUrl);
      downloadExportedCsv(modifiedUrl);
    })
    .catch(error => {
      console.error('Error retrieving download URL. Retrying in 2 seconds...', error);
      if (tries < 3) {
    setTimeout(() => {
      getDownloadUrl(platformClient, contactListId, clientId, tries + 1);
    }, 2000);
  } else {
    console.error('Error retrieving download URL. Maximum number of retries reached');
  }
});
}

async function downloadExportedCsv(exportUrl) {
  const nativeFetch = window.fetch.bind(window);

  const response = await nativeFetch(exportUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } else {
    console.error('Error downloading exported CSV:', response.statusText);
  }
}



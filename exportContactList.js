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
    "download": "false"
  };
  apiInstance.getOutboundContactlistExport(contactListId, opts)
    .then(response => {
      console.log('Download URL retrieved:', response.uri);
      const modifiedUrl = response.uri + '?issueRedirect=false';
      downloadExportedCsv(platformClient, modifiedUrl, clientId);
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

function downloadExportedCsv(platformClient, modifiedUrl, clientId) {
  fetch(modifiedUrl, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    const s3Url = data.url;
    console.log('S3 URL:', s3Url);
    return fetch(s3Url); // Removed authorization header
  })
  .then(response => {
    console.log('Export job completed, file downloaded:', response);
    csvData = response.body;
    showContactListRecords(csvData);
  })
  .catch(error => {
    console.error('Error downloading exported CSV:', error);
  });
}

let selectedContactListId;
let csvData;

function handleContactListSelection(platformClient, contactListId) {
  selectedContactListId = contactListId;
  initiateContactListExport(platformClient, contactListId);
}

function initiateContactListExport(platformClient, contactListId) {
  const apiInstance = new platformClient.OutboundApi();
  const opts = {
    "download": false
  };
  apiInstance.postOutboundContactlistExport(contactListId)
    .then(response => {
      console.log('Export initiated:', response);
      setTimeout(() => {
        downloadExportedCsv(apiInstance, contactListId, response.id);
      }, 2000);
    })
    .catch(error => console.error('Error initiating contact list export:', error));
}

function downloadExportedCsv(apiInstance, contactListId, jobId, tries = 0) {
  const opts = {
    "download": false
  };
  apiInstance.getOutboundContactlistExport(contactListId, jobId, opts)
    .then(response => {
      console.log('Export job completed');
      return fetch(response.uri);
    })
    .then(response => response.text())
    .then(data => {
      csvData = data;
      showContactListRecords(csvData);
    })
    .catch(error => {
      console.error('Error downloading exported CSV. Retrying in 2 seconds...', error);
      if (tries < 5) {
        setTimeout(() => {
          downloadExportedCsv(apiInstance, contactListId, jobId, tries + 1);
        }, 2000);
      } else {
        console.error('Error exportando el csv de la contact list');
      }
    });
}

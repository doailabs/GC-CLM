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

function downloadExportedCsv(apiInstance, contactListId, jobId) {
  const opts = {
    "download": false
  };
  apiInstance.getOutboundContactlistExport(contactListId, jobId, opts, '', 'text/plain')
    .then(response => {
      console.log('Export job completed');
      csvData = response;
      showContactListRecords(csvData);
    })
    .catch(error => console.error('Error downloading exported CSV:', error));
}

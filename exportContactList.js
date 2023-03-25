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
        downloadExportedCsv(apiInstance, contactListId, response.id, 0);
      }, 2000);
    })
    .catch(error => console.error('Error initiating contact list export:', error));
}

function downloadExportedCsv(apiInstance, contactListId, jobId, numAttempts) {
  const opts = {
    "download": false
  };
  apiInstance.getOutboundContactlistExport(contactListId, jobId, opts)
    .then(response => {
      console.log('Export job completed');
      return response.text(); // obtener el contenido del CSV como un string
    })
    .then(csvData => {
      showContactListRecords(csvData);
    })
    .catch(error => {
      if (numAttempts < 5) {
        console.error('Error downloading exported CSV. Retrying in 2 seconds...', error);
        setTimeout(() => {
          downloadExportedCsv(apiInstance, contactListId, jobId, numAttempts + 1);
        }, 2000);
      } else {
        console.error('Error exporting the contact list CSV.');
      }
    });
}

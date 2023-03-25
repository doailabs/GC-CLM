let selectedContactListId;

function handleContactListSelection(platformClient, contactListId) {
  selectedContactListId = contactListId;
  initiateContactListExport(platformClient, contactListId);
}

function initiateContactListExport(platformClient, contactListId) {
  const apiInstance = new platformClient.OutboundApi();
  apiInstance.postOutboundContactlistExport(contactListId)
    .then(response => {
      console.log('Export initiated:', response);
      waitForExportCompletion(platformClient, contactListId, response.id);
    })
    .catch(error => console.error('Error initiating contact list export:', error));
}

function waitForExportCompletion(platformClient, contactListId, jobId) {
  const apiInstance = new platformClient.OutboundApi();
  const checkInterval = setInterval(() => {
    console.log('Checking export job status...');
    apiInstance.getOutboundContactlistExport(contactListId, jobId)
      .then(response => {
        if (response.status === 'completed') {
          clearInterval(checkInterval);
          console.log('Export job completed');
          downloadExportedCsv(response.uri);
        } else if (response.status === 'failed') {
          clearInterval(checkInterval);
          console.error('Export job failed');
        } else {
          console.log('Export job still in progress...');
        }
      })
      .catch(error => {
        clearInterval(checkInterval);
        console.error('Error checking export job status:', error);
      });
  }, 2000); // Poll the job status every two seconds
}

function downloadExportedCsv(uri) {
  fetch(uri)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contact_list_${selectedContactListId}.csv`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    })
    .catch(error => console.error('Error downloading exported CSV:', error));
}



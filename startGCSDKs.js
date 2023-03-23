function startGCSDKs(clientId) {
  
    const appName = 'app name';
    const qParamLanguage = 'language';
    const qParamEnvironment = 'environment';

    // Default values are assigned but values should 
    // be set on the function 'assignConfiguration'
    let language = 'en-us';
    let redirectUri = 'https://doailabs.github.io/GC-CLM/'; 
    let userDetails = null;   
    let environment = "mypurecloud.de";//default value
  
    // After page loads...
    window.addEventListener('load', (event) => {
      assignConfiguration();
      console.log(`environment after addEventListener: ${environment}`);
      console.log(`language after addEventListener: ${language}`);

      setupGenesysClients(redirectUri, environment)
      .then(() => { 
        // Display values to the page
        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('span_environment').innerText = environment;
          document.getElementById('span_language').innerText = language;
          document.getElementById('span_name').innerText = userDetails.name;
        });

        console.log('Finished setup.');
      })
    });
  
    /**
     * Configure both the Platform SDK and the Client App SDK
     */
    function setupGenesysClients(redirectUri, environment){
      const platformClient = require('platformClient');
      const client = platformClient.ApiClient.instance;
      document.addEventListener('DOMContentLoaded', function () {
          var ClientApp = window.purecloud.apps.ClientApp;
          var myClientApp = new ClientApp({
             gcHostOriginQueryParam: 'gcHostOrigin',
              gcTargetEnvQueryParam: 'gcTargetEnv'
          });     
          myClientApp.alerting.showToastPopup('Hello', 'Genesys Cloud');
          const region = myClientApp.gcEnvironment;//GC region such as "mypurecloud.ie"
      });              
      
      const usersApi = new platformClient.UsersApi();

      // Configure Client App
      let ClientApp = window.purecloud.apps.ClientApp;
      let myClientApp = new ClientApp({
          pcEnvironment: environment
      });


      // Configure and Authenticate Platform Client
      client.setPersistSettings(true, appName);
      client.setEnvironment(environment);

      return client.loginImplicitGrant(clientId, redirectUri)


        .then(data =>  usersApi.getUsersMe())
        .then(data => {
          userDetails = data;

          myClientApp.alerting.showToastPopup(
            `Hi ${userDetails.name}`, 
            'Implicit grant login successful');
        })
        .catch(err => console.log(err));

    }

    /**
     * Assign the language and environment for the app first through
     * the query parameters. But if non-existent, attempt to get
     * it from localStorage. If none, use default values.
     */
    function assignConfiguration(){
      let url = new URL(window.location);
      let searchParams = new URLSearchParams(url.search);

      if(searchParams.has(qParamLanguage)){
        language = searchParams.get(qParamLanguage);
        localStorage.setItem(`${appName}_language`, language);
      } else {
        let local_lang = localStorage.getItem(`${appName}_language`);
        if(local_lang) language = local_lang;
      }
      if(searchParams.has(qParamEnvironment)){
        environment = searchParams.get(qParamEnvironment);
        localStorage.setItem(`${appName}_environment`, environment);        
      } else {
        let local_env = localStorage.getItem(`${appName}_environment`);
        if(local_env) environment = local_env;
      }
      return (environment);
    }
}

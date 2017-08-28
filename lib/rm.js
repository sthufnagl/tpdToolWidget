/*jslint
 browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */


var rm = (function ( window, undefined ) {

    //Global rm variable
    var actualConfigContext     = '';
    var actualDNGProject        ='';
    var actualDNGUUID           ='';
    var actualStream            = '';
    var artifactType;
    var parameterType;
    var countArtifactChilds     = 0;            //Only used for the Progressbar
    var loginPath               = '/login';
    var testDataUrlBase         = '/';
    var projectAreaURI          = '';
    var rmServerURL             = '';
    var sessionID               = '';
    var userName                = '';
    var userPassword            = '';
	  var pollInterval			      = 5000;


    /******************************************************************************************************************
     ******************************************************************************************************************
     *  Login to the server part of this Script
     *
     *  @param user and password
     *
     */
    function serverLogin() {

        //Async Call ==> Promise
        var  promise = $.ajax({
                            url:       location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.tpdToolService  + loginPath,
                            //url:     'https://SSE-Win2008:9443/tpdtool01/tpdtool01/login',
                            //url:       'http://sse-win2008.tivlab.raleigh.ibm.com:9080/tpdtool01/tpdtool01/login',
                            type:    'POST',
                            headers: {
                                'Content-Type':            "application/json"
                              },
                            data:JSON.stringify({
                                'name':     rm.userName,
                                'password': rm.userPassword,
                                'server':   rm.rmServerURL
                            }),
                            success: function(data) {
                                //init.log.info(data);
                                rm.sessionID = data;
                            },
                            error: function( jqXhr, textStatus, errorThrown ){
                                if (QUINITTESTRUNNING == "false"){
                                    init.log.error( errorThrown );
                                }

                								if(errorThrown == "Not Found"){
                									alert('The tpdTool context root ' + rm.tpdToolService + ' is wrong or the tpdToolService is not deployed.');
                								} else {
                									alert('Username and/or Password is wrong. Please restart the webpage');
                								}
                            }
                       });
      return promise;
    }



    /******************************************************************************************************************
     ******************************************************************************************************************
     *  Analyze the Software Requirements
     *
     *
     *
     */
    function serverTestData() {

        var UUID = '/' + rm.ProjectAreaURI+gc.actualGCStreamURI.substring(gc.actualGCStreamURI.lastIndexOf("/")+1,gc.actualGCStreamURI.length);

        //Async Call ==> Promise
        var  promise = $.ajax({
            url:      location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.tpdToolService + testDataUrlBase + UUID,
            type:    'POST',
            headers: {
                'token':         rm.sessionID,
                Accept :         "application/json",
                'Content-Type':  "application/json",
            },
            data:JSON.stringify({
                projectArea:        rm.ProjectAreaURI,
                artifactType:       rm.artifactType,
                parameterType:      rm.parameterType,
                configContext:      gc.actualLocalStream,
                globalConfig:       gc.actualGCStreamURI
            }),
            success: function(data) {
                init.log.info(data);
            },
            error: function( jqXhr, textStatus, errorThrown ){
                init.log.error( errorThrown );
            }
        });
        return promise;
    }


    /******************************************************************************************************************
     ******************************************************************************************************************
     *  Poll till the analyze is ready
     *
     *
     *
     */
    function serverTestDataPoll() {

        var UUID = '/' + rm.ProjectAreaURI+gc.actualGCStreamURI.substring(gc.actualGCStreamURI.lastIndexOf("/")+1,gc.actualGCStreamURI.length);

        var myInterval = setInterval(function () {
                                $.ajax({
                                    url: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.tpdToolService + testDataUrlBase + UUID,
            headers: {
                'token':         rm.sessionID,
                 Accept :       "application/json",
                'Content-Type': "application/json",
            },
                                    success: function (data) {
										if (data.creation_status <= -1){
											//If something went wrong ==>stop
                                            clearInterval(myInterval);
                                            //Set the progress bar to 0%
                                            progressbar.testdata.setProgress(0);

                                            $('button').prop('hidden', false);
                                            $('button').text('Analyze');
                                            document.getElementById("startWorking").setAttribute("onClick", "javascript: rm.startWorking();");
                                            alert('Error during script execution: ' + data.errors);
                                        } else if (data.creation_status == 2){
											//Ready?
                                            clearInterval(myInterval);
                                            //Set the progress bar to 100%
                                            progressbar.testdata.setProgress(1);

                                            $('button').text('Analyze');
                                            alert('Finished creating test data. ' + data.changed_test_cases + ' test cases have been changed and ' + data.changed_test_scripts + ' test scripts have been changed.');
                                        } else {
											//Update your dashboard gauge
											var actualProgress = data.progress/100;
											progressbar.testdata.setProgress(actualProgress);
										}
                                    }, dataType: "json"
                                });
                            }, pollInterval);
    }


    /******************************************************************************************************************
     ******************************************************************************************************************
     *  Start the with the creation of WI and WI Childs and link them to the related Artifacts
     *  This is the flowcontrol of the program with promises to catch the async REST calls.
     *      -
     *
     */
    function startWorking () {
        //Set all Progressbars to 0
        progressbar.resetAllProgressbars();

        init.log.info('rm.startWorking--> Start');

        //Disable Push Button 'Create Tracks Workitems'
        $('button').text('Please wait...');


        //Login im Java Serverlet
        var promise = serverLogin();

        promise.then(serverTestData)
               .then(serverTestDataPoll);

    }





    // Reveal public pointers to
    // private functions and properties

    return {
        actualConfigContext:     actualConfigContext,       //globale Variable needed for GC and which localo stream we are working
        actualDNGProject:        actualDNGProject,          //globale Variable
        actualDNGUUID:           actualDNGUUID,             //globale Variable
        actualStream:            actualStream,              //globale Variabl
        artifactType:            artifactType,              //globale Variable
        parameterType:           parameterType,             //globale Variable

        countArtifactChilds:     countArtifactChilds,
        ProjectAreaURI:          projectAreaURI,            //globale Variable
        startWorking:            startWorking,
		    serverLogin:             serverLogin,
        rmServerURL:             rmServerURL,               //globale Variable
		    sessionID:               sessionID,                  //globale Variable
        userName:                userName,                   //globale Variable
        userPassword:            userPassword                //globale Variable


    };

})();

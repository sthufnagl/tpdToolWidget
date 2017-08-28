/**
 * Created by eifinger@de.ibm.com
 */

var init = (function ( window, undefined ) {

    var ddData     = [];
    var streamData = [];
    var log        = log4javascript.getLogger();
    var prefs      = new gadgets.Prefs();


    function initAjax() {
        $( document).ajaxError( function(event, jqxhr, settings, thrownError) {
                init.log.error('Ajax Error-->' + settings.url + ' ' + thrownError);
            }
        )
}

    /******************************************************************************************************************
     ******************************************************************************************************************
     * Init Dialogbox to get User and Password
     *
     */
    function initDialogbox () {
      /*  var dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {

                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                allFields.removeClass("ui-state-error");
            }
        });*/
        var modalConfirmation = (function() {
            var $dialog = $('#dialog-form').dialog({
                autoOpen: false,
                modal: true
            });
            var showDialog = function() {
                var def = $.Deferred();
                $dialog.dialog('option', 'buttons',
                    {
                        "OK": function() {
                            def.resolve();
                            $(this).dialog('close');
                        },
                        "Cancel": function() {
                            def.reject();
                            $(this).dialog('close');
                        }
                    });
                $dialog.dialog('open');
                return def.promise();
            };
            return showDialog;
        })();
console.log('test');
    }

    /******************************************************************************************************************
     ******************************************************************************************************************
     * Get all DNG PA that have an "Tracks" association with RTC
     *
     * @param {String} method     - The method name.
     * @param {Array} params      - Params to send in the call.
     * @param {Function} callback - function(error, value) { ... }
     *   - {Object|null} error    - Any errors when making the call, otherwise null.
     *   - {mixed} value          - The value returned in the method response.
     */
    function initDropdown (http, service_url, parentID, childIDs) {
        init.log.info('init.initDropdown--> Start');

        var promise = $.ajax({
            url: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.rmService + '/globalconfig/component?gcurl=' + gc.gcServerURL,
            type: 'GET',
            crossDomain: true,
            headers: {
                'token': rm.sessionID
            },
            success: function (data) {
                // Get the GC PA Details
                data.forEach(function(entry)  {

                    ddData.push({
                        text: entry.name,
                        value: entry.itemId,
                        selected: false,
                        description: entry.webUrl,
                        imageSrc: 'images/gcApp.png'
                    });
                    // Delete old Dropbox ...
                    $('#dngPa').ddslick('destroy');
                    //...create a new Dropbox with the new content. Necessary because no update possible
                    $('#dngPa').ddslick({
                        data: ddData,
                        width: 400,
                        selectText: "Select the Global Config Project...",
                        imagePosition: "left",
                        onSelected: function (data) {
                            updateStreamDropDown(data.selectedData.value);
                        }
                    });
                });
            },
            error: function( jqXhr, textStatus, errorThrown ){
                init.log.error( errorThrown );
            }
        });
        return promise;
    }



    function initLogger() {
        //Logging at the Gadget Preferences enabled?
        if (prefs.getBool('logging')){
            init.log = log4javascript.getLogger();

            // Create a PopUpAppender with default options
            var popUpAppender = new log4javascript.PopUpAppender();

            // Change the desired configuration options
            popUpAppender.setFocusPopUp(true);
            popUpAppender.setNewestMessageAtTop(true);

            // Add the appender to the logger
            init.log.addAppender(popUpAppender);

        } else {
            init.log = log4javascript.getNullLogger();
        }

    }


    function initSettings() {

        if (prefs.getString('ProjectAreaURI')) {
            rm.ProjectAreaURI = prefs.getString('ProjectAreaURI');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No ProjectAreaURI in the Settings found ');
        }

        if (prefs.getString('artifactType')) {
            rm.artifactType = prefs.getString('artifactType');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No artifactType in the Settings found ');
        }

        if (prefs.getString('parameterType')) {
            rm.parameterType = prefs.getString('parameterType');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No parameterType in the Settings found ');
        }

        if (prefs.getString('userName')) {
            rm.userName = prefs.getString('userName');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No userName in the Settings found ');
        }

        if (prefs.getString('userPassword')) {
            rm.userPassword = prefs.getString('userPassword');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No userPassword in the Settings found ');
        }

        if (prefs.getString('tpdToolService')) {
            rm.tpdToolService = prefs.getString('tpdToolService');
        }else {
            //alert('Please set the Viewname in the Settings');
            init.log.error('init.initSettings--> No tpdToolService in the Settings found ');
        }

        //Get the DNG Server URL from the Gadget Settings
        if (prefs.getString('rmServerURL')) {
            rm.rmServerURL = prefs.getString('rmServerURL');
            init.log.info('init.initSettings-->DNG Server URL from the Settings is: '+ rm.rmServerURL);
        }else {
            rm.rmServerURL = document.location.protocol + '//'+ document.location.host + '/rm';
            init.log.info('init.initSettings--> No DNG Server URL in the Settings found. Use ' + rm.rmServerURL + ' instead');
        }

		 //Get the GC Server URL from the Gadget Settings
        if (prefs.getString('gcServerURL')) {
            gc.gcServerURL = prefs.getString('gcServerURL');
            init.log.info('init.initSettings-->DNG Server URL from the Settings is: '+ gc.gcServerURL);
        }else {
            gc.gcServerURL = document.location.protocol + '//'+ document.location.host + '/gc';
            init.log.info('init.initSettings--> No DNG Server URL in the Settings found. Use ' + rm.rmServerURL + ' instead');
        }
    }

     function updateStreamDropDown(gCProjectId) {


        $('#stream').ddslick("destroy");
        $("#stream").empty();
        streamData = [];

        $.ajax({ //RMService03/globalconfig/stream?gcurl=https://ssejtsserver:9443/gc&componentid=_8Y9eoBwEEeWSjNkenSP4qQ
            url:  location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.rmService + '/globalconfig/stream?gcurl=' + encodeURIComponent(gc.gcServerURL) + '&componentid=' + gCProjectId,
            type:     'GET',
            crossDomain: true,
 /*
            xhrFields: {
                withCredentials: true
            },
    */
            dataType: 'json',
            headers: {
                'token': rm.sessionID
            },
            success: function(data) {
                data.forEach(function(entry)  {
                    streamData.push({
                        text:        entry.title,
                        value:       entry.uri,
                        selected:    false,
                        description: entry.type,
                        imageSrc:    'images/stream24.png'
                    });
                });
                $("#stream").ddslick({
                    data: streamData,
                    width: 400,
                    imagePosition: "left",
                    selectText: "Select GC Stream...",
                    imagePosition: "left",
                    onSelected: function (data) {
                        gc.actualGCStreamName  = data.selectedData.text;
                        gc.actualGCStreamURI   = data.selectedData.value;
                        //Now we can analyse ==> Button visible
                        $('button').prop('hidden', false);
                        $.ajax({ //RMService03/globalconfig/stream/https%3A%2F%2Fssejtsserver%3A9443%2Fgc%2Fconfiguration%2F34?gcurl=https://ssejtsserver:9443/gc&componentid=_8Y9eoBwEEeWSjNkenSP4qQ
                            url:  location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/' + rm.rmService + '/globalconfig/stream/' + encodeURIComponent(gc.actualGCStreamURI) + '?gcurl=' + gc.gcServerURL + '&componentid='  +gCProjectId,
                            type:     'GET',
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            dataType: 'json',
                            headers: {
                                'token': rm.sessionID
                            },
                            success: function(data) {
                                // Get the local Stream of DNG, we expect only one DNG in the GC Stream
                                for (var i=0;i<data.children.length;++i) {
                                    if(data.children[i].appName === 'Requirements Management'){
                                        gc.actualLocalStream = data.children[i].uri;
                                    }

                                }
                            }

                        });

                    }
                });
            }
        });
    }


    return {
        ddData:                 ddData,             //global variable
        log:                    log,
        initAjax:               initAjax,
        initLogger:             initLogger,
		    initDialogbox:          initDialogbox,
        initDropdown:           initDropdown,
        initSettings:           initSettings,
        prefs:                  prefs

    };

})();

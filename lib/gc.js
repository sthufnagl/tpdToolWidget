
/******************************************************************************************************************
 ******************************************************************************************************************
 * Everything that is related to Global Config (GC)
 */

/*jslint
 browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

var gc = (function ( window, undefined ) {

    var actualGC            = '';
    var actualGCStreamName  = '';
    var actualGCStreamURI   = '';
    var actualLocalStream   = '';
	var gcServerURL         = '';
	var GLOBAL_CONFIG_PROJECTAREAS = '/service/com.ibm.team.process.internal.service.web.IProcessWebUIService/allProjectAreas?userId='+rm.userName;
    var GLOBAL_CONFIG_SEARCH       = '/gc.webui.search?scope=STREAMS&q=*&projectAreasToSearch=CURRENT';
    var GLOBAL_CONFIG_GETTREE      = '/gc.webui.getTreeNode?uri=';





    return {
        actualGC:               actualGC,               //globale Variable
        actualGCStreamName:     actualGCStreamName,     //globale Variable
        actualGCStreamURI:      actualGCStreamURI,      //globale Variable
        actualLocalStream:      actualLocalStream,       //globale Variable
		gcServerURL:            gcServerURL,             //globale Variable
        GLOBAL_CONFIG_GETTREE:      GLOBAL_CONFIG_GETTREE,       //globale Constant
        GLOBAL_CONFIG_PROJECTAREAS: GLOBAL_CONFIG_PROJECTAREAS,  //globale Constant
        GLOBAL_CONFIG_SEARCH:       GLOBAL_CONFIG_SEARCH         //globale Constant

    };

})();
/*jslint
 browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test Script that investigate the "tpdtool REST API".
 *
 *  @param  url:      REST API path
 *          type:     Http method type like POST, GET, PUT etc.
 *          data:     HTTP Body for POST, PUT
 *          callback: When ready then call back this callback function
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Before the REST API Tests will run, we have to prepare the settings and login()
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
var authorizationToken;
var url;

QUnit.module("tpdTool REST API tests", {
  //Before we could call the REST API we need to login and get the authorizationToken
  before: function (assert) {
    //Test if the authorizationToken is empty or with planks pnly
    if(config.authorizationToken.replace(/\s/g,"") == ""){
        var tpdToolService      = config.tpdtool;
        var userName            = config.testUser;
        var userPassword        = config.testpasswd;
        var rmServerURL         = config.jtsURL;
        this.url                = '/' + config.tpdtool + '/';
        this.authorizationToken = null;

        //Login to the REST API
        var method = 'login';
        var type = 'POST';
        var data = {
           'name': userName,
           'password': userPassword,
           'server': rmServerURL
        }

        api_test(this.url + method, type, data, function (result) {
          this.authorizationToken = result.responseText;
          QUnit.assert.ok(result.statusText == "OK", "API token " + this.authorizationToken + " is OK");
        });
      } else {
        this.url = '/' + config.tpdtool + '/';
        this.authorizationToken = config.authorizationToken;
      }
  }
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  start Test of the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: POST /start', function (assert) {

  var method = 'start';
  var type = 'POST';
  var data = {
    "projectAreaRM": "GCRM",
    "projectAreaQM": "GCQM",
    "projectAreaCCM": "GCCCM",
    "templateTCER": "C:\\\\temp\\\\RunConfig\\\\TemplateTCER.txt",
    "defaultTCER": "C:\\\\temp\\\\RunConfig\\\\DefaultTCER.properties",
    "xmlFileName": "C:\\\\temp\\\\RunConfig\\\\Document.xml",
    "workItemID": 16,
    "testPlanID": 2,
    "configContext": "https://vm.uetersen.com:9443/gc/configuration/2",
    "reqAttributes": "C:\\\\temp\\\\RunConfig\\\\AttributeMapping.csv",
    "environmentMapping": "C:\\\\temp\\\\RunConfig\\\\EnvironmentMapping.csv",
    "csvSeparator": ","
  }

  //Call of the REST API,
  api_test(this.url + method, type, JSON.stringify(data), function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: GET /command', function (assert) {

  var method = 'command';
  var type = 'GET';
  var data = {};

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: POST /command', function (assert) {

  var method = 'command';
  var type = 'POST';
  var data = "stop";

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: GET /logging/currentlevel', function (assert) {

  var method = 'logging/currentlevel';
  var type = 'GET';
  var data = {};

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});

/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: PUT /logging/currentlevel', function (assert) {

  var method = 'logging/currentlevel';
  var type = 'PUT';
  var data = "trace";

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: GET /logging/log', function (assert) {

  var method = 'logging/log';
  var type = 'GET';
  var data = {};

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Test the REST API
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
QUnit.test('REST API: GET /progress', function (assert) {

  var method = 'progress';
  var type = 'GET';
  var data = {};

  //Call of the REST API
  api_test(this.url + method, type, data, function (result) {
    assert.ok(result.statusText == "OK", result.status + "   " + result.statusText + " Progress is " + result.responseText);
  });
});



/******************************************************************************************************************
 ******************************************************************************************************************
 *  Login to the server part of this Script
 *
 *  @param  url:      REST API path
 *          type:     Http method type like POST, GET, PUT etc.
 *          data:     HTTP Body for POST, PUT
 *          callback: When ready then call back this callback function
 *  @Author: shufnagl
 *  @Date:   08/2017
 *
 *******************************************************************************************************************/
function api_test(url, type, data, callback) {
  if (type == "GET") {
    $.ajax({
      url: url,
      type: type,
      processData: false,
      headers: {
        'Authorization': this.authorizationToken,
        Accept: "application/json",
        'Content-Type': "application/json",
      },
      async: false,
      complete: function (result) {
        if (result.status == 0) {
          QUnit.assert.ok(false, '0 status - browser could be on offline mode');
        } else if (result.status != 200) {
          QUnit.assert.ok(false, result.responseText);
        } else {
          callback(result);
        }
        return result;
      }
    });
  }
  // It must be POST or PUT?
  else {
    $.ajax({
      url: url,
      type: type,
      processData: false,
      headers: {
        'Authorization': this.authorizationToken,
        Accept: "application/json",
        'Content-Type': "application/json",
      },
      data: JSON.stringify(data),
      dataType: 'json',
      async: false,
      complete: function (result) {
        if (result.status == 0) {
          QUnit.assert.ok(false, '0 status - browser could be on offline mode');
        } else if (result.status != 200) {
          QUnit.assert.ok(false, result.responseText);
        } else {
          callback(result);
        }

      }
    });
  }

}

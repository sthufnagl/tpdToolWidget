/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */


$(function() {
      var modalConfirmation = (function() {
        var $dialog = $('#dialog-form').dialog({
            open: function () {
                $(this).off('submit').on('submit', function () {
                    $(this).parent().find("button:eq(1)").trigger("click");
                    $(this).dialog('close');
                    return false;
                });
            },
            autoOpen: false,
            modal: true
        });
        var showDialog = function() {
            var def = $.Deferred();
            $dialog.dialog('option', 'buttons',
                {
                    "OK": function() {
                        rm.userName     = username.value;
                        rm.userPassword = password.value;
                        def.resolve();
                        $(this).dialog('close');
                    },
                    "Cancel": function() {
                        alert('Please restart the webpage to get this Login once again');
                        def.reject();
                        $(this).dialog('close');
                    }
                });
            $dialog.dialog('open');
            return def.promise();
        };
        return showDialog;
    })();
    init.initLogger();
    progressbar.initProgressBar();
    init.initSettings();

    //Login im Java Serverlet
    modalConfirmation()
        .then(rm.serverLogin)
        .then(init.initDropdown);


  });

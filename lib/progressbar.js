var progressbar = (function ( window, undefined ) {

    var testdata   = '';

    function initProgressBar() {

        progressbar.testdata = $("#testdata").percentageLoader({
            width: 128, height: 128, controllable: false, progress: 0, onProgressUpdate: function (val) {
                childs.setValue(Math.round(val * 100.0));
            }
        });
        progressbar.testdata.setValue('PROCESSED');
    }

    function resetAllProgressbars() {
        progressbar.testdata.setProgress( 0 );
        progressbar.testdata.setValue( 'PROCESSED' );
    }


    return {
       testdata:                testdata,
       initProgressBar:         initProgressBar,
       resetAllProgressbars:    resetAllProgressbars
    };

})();
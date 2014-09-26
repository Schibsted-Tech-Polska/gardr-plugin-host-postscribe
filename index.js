'use strict';

var gardrPostscribe = function(gardrPluginApi) {

    var superglobal = global || window || {};

    gardrPluginApi.on('item:beforerender', function(item) {
        if(item.options.postscribe === true && typeof superglobal.postscribe === 'function') {
            setTimeout(function() { // wait until iframe is in the DOM to remove it
                item.iframe.remove();
                superglobal.postscribe(item.options.container, '<script src="' + item.options.url + '"></script>', item.options.postscribeOptions);
            }, 0);
        }
    });

};

module.exports = gardrPostscribe;

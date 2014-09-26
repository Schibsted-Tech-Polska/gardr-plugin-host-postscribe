/*global describe, beforeEach, it */

'use strict';


var superglobal = global || window || {},
    assert = require('assert'),
    gardrPostscribe = require('./index.js'),
    PluginApi = require('gardr-core-plugin').PluginApi,
    sinon = require('sinon');

superglobal.postscribe = sinon.spy();

var mockItem = function() {
    return {
        options: {},
        iframe: {
            remove: sinon.spy(),
        }
    };
};


describe('gardr-postscribe', function() {
    var pluginApi;

    beforeEach(function() {
        pluginApi = new PluginApi();
    });
    
    it('should be a function', function() {
        assert.equal(typeof gardrPostscribe, 'function');
    });

    it('should not call postscribe for option without postscribe option', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(!superglobal.postscribe.called, 'postscribe was called');
            done();
        }, 10);
    });

    it('should call postscribe for option with postscribe === true option', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);
        item.options.postscribe = true;

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(superglobal.postscribe.called, 'postscribe was not called');
            done();
        }, 10);
    });
    
    it('should remove Gardr iframe  with postscribe === true option', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);
        item.options.postscribe = true;

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(item.iframe.remove.called, 'item.iframe.remove was not called');
            done();
        }, 10);
    });

    it('should build proper script tag for postscribe', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);
        item.options.postscribe = true;
        item.options.container = 'banner1';
        item.options.url = 'scripturl';

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(superglobal.postscribe.calledWith('banner1', '<script src="scripturl"></script>'), 'postscribe was not called with proper script tag');
            done();
        }, 10);
    });

    it('should pass proper options object for postscribe', function(done) {
        var item = mockItem();
        var options = {
            some: 'option'
        };
        gardrPostscribe(pluginApi);
        item.options.postscribe = true;
        item.options.postscribeOptions = options;
        item.options.container = 'banner1';
        item.options.url = 'scripturl';

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(superglobal.postscribe.calledWith('banner1', '<script src="scripturl"></script>', options), 'postscribe was not called with proper options');
            done();
        }, 10);
    });

});

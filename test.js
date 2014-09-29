/*global describe, beforeEach, it */

'use strict';

// window mock for xde
global.addEventListener = function(name, handler) {
    if(!Array.isArray(this.eventHandlers[name])) {
        this.eventHandlers[name] = [];
    }
    this.eventHandlers[name].push(handler);
};

global.triggerEvent = function(name, data) {
    if(Array.isArray(this.eventHandlers[name])) {
        this.eventHandlers[name].forEach(function(handler) {
            handler(data);
        });
    }
};

var assert = require('assert'),
    gardrPostscribe = require('./index.js'),
    PluginApi = require('gardr-core-plugin').PluginApi,
    sinon = require('sinon');


var mockItem = function() {
    return {
        id: '' + Math.random(),
        options: {},
        iframe: {
            remove: sinon.spy(),
        }
    };
};


describe('gardr-postscribe', function() {
    var pluginApi;

    beforeEach(function() {
        global.postscribe = sinon.spy();
        global.eventHandlers = {};
        pluginApi = new PluginApi();
    });
    
    it('should be a function', function() {
        assert.equal(typeof gardrPostscribe, 'function');
    });

    it('should not call postscribe without postscribe option', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(!global.postscribe.called, 'postscribe was called');
            done();
        }, 10);
    });

    it('should call postscribe with postscribe === true option', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);
        item.options.postscribe = true;

        pluginApi.trigger('item:beforerender', item);
        setTimeout(function() {
            assert(global.postscribe.called, 'postscribe was not called');
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
            assert(global.postscribe.calledWith('banner1', '<script src="scripturl"></script>'), 'postscribe was not called with proper script tag');
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
            assert(global.postscribe.calledWith('banner1', '<script src="scripturl"></script>', options), 'postscribe was not called with proper options');
            done();
        }, 10);
    });

    it('should call postscribe when requested from inside of an iframe', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);

        pluginApi.trigger('item:beforerender', item);
        global.triggerEvent('message', {
            origin: '*',
            data: {
                __xde: true,
                name: 'plugin:postscribe',
                data: {
                    id: item.id
                }
            }
        });

        setTimeout(function() {
            assert(global.postscribe.called, 'postscribe was not called');
            done();
        }, 10);
    });
    
    it('should remove Gardr iframe when requested from inside of an iframe', function(done) {
        var item = mockItem();
        gardrPostscribe(pluginApi);

        pluginApi.trigger('item:beforerender', item);
        global.triggerEvent('message', {
            origin: '*',
            data: {
                __xde: true,
                name: 'plugin:postscribe',
                data: {
                    id: item.id
                }
            }
        });

        setTimeout(function() {
            assert(item.iframe.remove.called, 'item.iframe.remove was not called');
            done();
        }, 10);
    });

});

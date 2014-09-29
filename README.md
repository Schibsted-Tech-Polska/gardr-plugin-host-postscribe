# Gardr Postscribe Plugin

Gardr plugin to enable content rendering with Postscribe.
It takes script pointed at options.url and renders it into host page (no iframe) using Postscribe. Element chosen as Gardr container will be used to render a script.

## Install

```
npm install gardr-plugin-host-postscribe --save
```

## Using with gardr-plugin-ext-postscribe

gardr-plugin-ext-postscribe is an Ext plugin that allows to call replace action from inside of an iframe.

## Bundle
In your host bundle file:

```javascript
    var gardrHost = require('gardr-host');
    var postscribe = require('gardr-plugin-host-postscribe');

    gardrHost.plugin(postscribe);

    module.exports = gardrHost;
```

## Options

```postscribe``` - boolean, enables/disables Postscribe rendering.

```postscribeOptions``` - object, options that will be passed to Postscribe.

## Example

```javascript
var gardr = gardrHost(...);
gardr.queue('ad', {
    url: 'my-adserver.com/ad.js',
    container: 'ad',
    postscribe: true,
    postscribeOptions: {
        done: function() {
            console.log('Ad rendered with Postscribe');
        }
    },
    ...
});
```

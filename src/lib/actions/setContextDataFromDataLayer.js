'use strict';

// recover tracker
var getTracker = turbine.getSharedModule("adobe-analytics","get-tracker");

module.exports = function(settings) {
    var namespace = settings.namespace;
    var joinCharacter = settings.joinCharacter;
    var rootElement = settings.dataLayerRoot;

    getTracker().then( function(tracker) {
        if (tracker) {
            addElementsFromObjectToTrackerRecursively(window[rootElement], [ namespace ], tracker, joinCharacter);
        } else {
            _satellite.logger.warn('no tracker here!');
        }
    });
}

function addElementsFromObjectToTrackerRecursively(root, prefix, tracker, joinCharacter) {
    if ('undefined' !== root && root) {
        if (Array.isArray(root)) {
            // join
            tracker.contextData[prefix.join('.')] = root.join(joinCharacter);
        } else if ('object' === typeof root) {
            // drill down
            for (var key in root) {
                if (root.hasOwnProperty(key)) {
                    prefix.push(key);
                    addElementsFromObjectToTrackerRecursively(root[key], prefix, tracker, joinCharacter);
                }
            }
        } else {
            // set the value
            tracker.contextData[prefix.join('.')] = root;
        }
    }
}

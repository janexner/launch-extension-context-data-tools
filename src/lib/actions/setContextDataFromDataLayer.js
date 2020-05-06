'use strict';

// recover tracker
var getTracker = turbine.getSharedModule("adobe-analytics","get-tracker");

module.exports = function(settings) {
    var namespace = settings.namespace;
    var joinCharacter = settings.joinCharacter;
    var rootElement = settings.dataLayerRoot;

    getTracker().then( function(tracker) {
        if (tracker) {
            var baseNamespace = "" === namespace ? [] : [ namespace ];
            addElementsFromObjectToTrackerRecursively(window[rootElement], baseNamespace, tracker, joinCharacter);
        } else {
            _satellite.logger.warn('no tracker here!');
        }
    });
}

function addElementsFromObjectToTrackerRecursively(root, prefix, tracker, joinCharacter) {
    if ('undefined' !== root && root) {
        if (Array.isArray(root)) {
            // join
            var anyComplexTypesInHere = false;
            for (var i = 0; i < root.length; i++) {
                if ('object' === typeof root[i] || Array.isArray(root[i])) {
                    anyComplexTypesInHere = true;
                    break;
                }
            }
            if (anyComplexTypesInHere) {
                // TODO - we need to flatten the array here
                for (var i = 0; i < root.length; i++) {
                    var element = root[i];
                    var newPrefix = Array.from(prefix);
                    newPrefix.push(i);
                    addElementsFromObjectToTrackerRecursively(element, newPrefix, tracker, joinCharacter);
                }
            } else {
                tracker.contextData[prefix.join('.')] = root.join(joinCharacter);
            }
        } else if ('object' === typeof root) {
            // drill down
            for (var key in root) {
                if (root.hasOwnProperty(key)) {
                	var newPrefix = Array.from(prefix);
                	newPrefix.push(key);
                    addElementsFromObjectToTrackerRecursively(root[key], newPrefix, tracker, joinCharacter);
                }
            }
        } else {
            // set the value
            tracker.contextData[prefix.join('.')] = root;
        }
    }
}

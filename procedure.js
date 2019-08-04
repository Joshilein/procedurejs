/*
 * ------------------------------------------------------------
 * "THE BEERWARE LICENSE" (Revision 42):
 * Joshilein wrote this code. As long as you retain this
 * notice, you can do whatever you want with this stuff. If we
 * meet someday, and you think this stuff is worth it, you can
 * buy me a beer in return.
 * ------------------------------------------------------------
 */

; (function ($, window, document, undefined) {

    // constants

    let pluginName = 'procedure',
        defaults = {
            propertyName: "value"
        };
    //-------------------------------------------------------------------------------
    //-------------------------------CLASSES-----------------------------------------
    //-------------------------------------------------------------------------------

    // main plugin
    class Plugin {
        constructor(element, options) {
            this.element = element;
            this.options = $.extend({}, defaults, options);
            this.connections = [
                {
                    from: 'lol',
                    to: 2,
                },
                {
                    from: 'lol',
                    to: 3,
                },
                {
                    from: 3,
                    to: 4,
                },
                {
                    from: 2,
                    to: 3,
                },
            ]
            this.nodes = this.getNodes(this.connections);
            this.setLevels(this.nodes);
            this.drawingBoard = new DrawingBoard(this.nodes);
            this.init();
        }

        // init
        init() {
        }

        getNodes(connections) {
            let elementsArray = new Array;
            connections.forEach(element => {
                if (!elementsArray[element.from]) {
                    elementsArray[element.from] = new Node(element.from, connections);
                }
                if (!elementsArray[element.to]) {
                    elementsArray[element.to] = new Node(element.to, connections);
                }
            });
            return elementsArray;
        }

        setLevels(nodes) {
            var allNodesSet = false;
            let currentlvl = 0;
            while (!allNodesSet) {
                allNodesSet = true;
                for (let nodeIndex in nodes) {
                    if (nodes[nodeIndex].isRoot) {
                        nodes[nodeIndex].level = 0;
                    }
                    if (nodes[nodeIndex].level == currentlvl) {
                        for (let connectionIndex in nodes[nodeIndex].connections) {
                            nodes[nodes[nodeIndex].connections[connectionIndex].to].level = currentlvl + 1;
                        }
                    }
                    if (nodes[nodeIndex].level == null) {
                        allNodesSet = false;
                    }
                }
                currentlvl++;
            }
        }

        /**
         * checks if method exists
         * and calls it
         * @param {*} command 
         */
        execute(command, options) {
            try {
                this[command](options);
            }
            catch (error) {
                console.log("Procedure js: Function " + command + " not found..");
            }
        }

        /**
         * description
         * @param {Array} options 
         */
        highlightPaths(options) {
        }
    }
    //-------------------------------------------------------------------------------

    // node
    class Node {
        constructor(id, connections) {
            this.id = id;
            this.level = null;
            this.isRoot = false;
            this.connections = this.getConnections(connections);
        }
        getConnections(connections) {
            this.isRoot = true;
            let connectionArray = new Array;
            connections.forEach(connection => {
                if (connection.from == this.id) {
                    connectionArray[connection.from + "-" + connection.to] = new Connection(connection.from, connection.to, connection.from + "-" + connection.to);
                }
                if (connection.to == this.id) {
                    this.isRoot = false;
                }
            })
            return connectionArray;
        }
    }
    //-------------------------------------------------------------------------------

    // connection
    class Connection {
        constructor(from, to, id) {
            this.from = from;
            this.to = to;
            this.id = id;
        }
    }
    //-------------------------------------------------------------------------------

    // canvas
    class DrawingBoard {
        constructor(nodes) {
            this.locations = this.getLocations(nodes);
        }
        getLocations(nodes) {
            let board = new Array;
            let positions = new Array;
            positions[0] = new Array;
            positions[1] = new Array;
            positions[2] = new Array;
            positions[3] = new Array;
            let horizontalOffset = new Array;
            horizontalOffset[0] = 0;
            horizontalOffset[1] = 0;
            horizontalOffset[2] = 0;
            horizontalOffset[3] = 0;

            for (var nodeIndex in nodes) {
                positions[nodes[nodeIndex].level][horizontalOffset[nodes[nodeIndex].level]] = nodes[nodeIndex];
                horizontalOffset[nodes[nodeIndex].level]++;
            };
            return 'sdf';
        }
    }
    //-------------------------------------------------------------------------------
    //-------------------------------REGISTRATION------------------------------------
    //-------------------------------------------------------------------------------

    /**
     * registration of the plugin
     * checks wheter the Plugin is intitiated on the element yet
     * and calls its functions
     * @param command the command to be executed
     * @param options some configuration
     */
    $.fn[pluginName] = function (command, options) {
        return this.each(function () {
            if (command == 'init') {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName,
                        new Plugin(this, options));
                }
                else {
                    console.log('Procedure js: Plugin already exists');
                }
            }
            else if ($.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName).execute(command, options);
            }
            else {
                console.log('Procedure js: Plugin not yet initiated..');
            }
        });
    }
})(jQuery, window, document);
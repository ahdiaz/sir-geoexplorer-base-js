/**
 * Copyright (C) 2012
 *
 * This file is part of the project ohiggins
 *
 * This software is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option) any
 * later version.
 *
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this library; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 *
 * As a special exception, if you link this library with other files to produce
 * an executable, this library does not by itself cause the resulting executable
 * to be covered by the GNU General Public License. This exception does not
 * however invalidate any other reasons why the executable file might be covered
 * by the GNU General Public License.
 *
 * Author: Antonio Hernández <ahernandez@emergya.com>
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LoadAdditionalLayersAction
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LoadAdditionalLayersAction(config)
 *
 *    Provides an action for showing the default search dialog.
 */
gxp.plugins.LoadAdditionalLayersAction = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_extendedtoolbar */
    ptype: "gxp_loadadditionallayers",
    
    /** api: config[buttonText]
     *  ``String`` Text to show next to the zoom button
     */
    buttonText: 'Ver más capas',
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: 'Ver más capas',

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: 'Ver más capas',
    
    /** private: property[iconCls]
     */
    iconCls: "gxp_loadadditionallayers",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.LoadAdditionalLayersAction.superclass.constructor.apply(this, arguments);
    },

    /** private: method[init]
     * :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        gxp.plugins.LoadAdditionalLayersAction.superclass.init.apply(this, arguments);
        this.target.on('beforerender', this.addActions, this);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        return gxp.plugins.ChannelToolsAction.superclass.addActions.apply(this, [{
            buttonText: this.showButtonText ? this.buttonText : '',
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function(action, evt) {

                var ds = Viewer.getComponent('AdditionalLayersTools');
                if (ds === undefined) {
                    var mapPanel = Viewer.getMapPanel();
                    ds = new Viewer.dialog.ChannelTools({
                        mapPanel: mapPanel,
                        map: mapPanel.map, 
                        showLayers: true,
                        persistenceGeoContext: this.target.persistenceGeoContext
                    });
                    Viewer.registerComponent('AdditionalLayersTools', ds);
                }
                if (ds.isVisible()) {
                    ds.hide();
                } else {
                    ds.show();
                }

            },
            scope: this
        }]);
    }
        
});

Ext.preg(gxp.plugins.LoadAdditionalLayersAction.prototype.ptype, gxp.plugins.LoadAdditionalLayersAction);

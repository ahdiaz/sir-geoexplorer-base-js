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
 * Author: Alejandro Díaz <adiaz@emergya.com>
 */

Viewer.dialog.ChannelTools = Ext.extend(Ext.Window, {

    /** i18n **/
    titleText: 'Canales Temáticos',
    loadText: 'Load',
    closeText: 'Close',

    showLayers: false,
    restBaseUrl: "rest",

    LOAD_CHANNEL_URL: '{0}/persistenceGeo/loadFoldersById/',

    persistenceGeoContext: null,

    loadButton: null,
    selectedChannel: null,


    constructor: function(config) {

        Viewer.dialog.ChannelTools.superclass.constructor.call(this, Ext.apply({
            title: config.showLayers ? 'Carpetas' : this.titleText,
            width: 500,
            height: 400,
            layout: 'fit',
            closeAction: 'hide'
        }, config));

        this.on({
            beforerender: this.onBeforeRender,
            scope: this
        });

        this.restBaseUrl = this.persistenceGeoContext.defaultRestUrl;
        this.LOAD_CHANNEL_URL = String(this.LOAD_CHANNEL_URL, this.restBaseUrl);
    },

    onBeforeRender: function() {

        var padding = 'padding: 10px 16px;';
        var border = 'border: 0px solid transparent;'
        
        this.layersTree = new Viewer.widgets.ChannelToolsLayersTree({
            restBaseUrl: this.restBaseUrl,
            showLayers: this.showLayers,
            listeners: {
                click: this.onTreeNodeClick,
                scope: this
            }
        });
        
        this.add(this.layersTree);
        this.addButton(this.loadButton = new Ext.Button({
            text: this.loadText,
            disabled:!this.showLayers,
            listeners: {
                click: this.onLoadButtonClicked,
                scope: this
            }
        }));
        this.addButton(new Ext.Button({
            text: this.closeText,
            listeners: {
                click: this.onCancelButtonClicked,
                scope: this
            }
        }));
    },

    onCancelButtonClicked: function() {
        this.hide();
    },

    onShow: function() {
        this.layersTree.reload();
    },

    showLoading: function(show) {
        //TODO: Show a loading mask...
    },

    onTreeNodeClick: function(node, checked) {

        if(!this.showLayers){
            if(node.isLeaf()){
                this.selectedChannel = node.id;
                this.selectedChannelName = node.text;
                this.loadButton.enable();
            }else{
                this.loadButton.disable();
            }
        }
    },

    addedLayers: new Array(),

    clearLayers: function (){
        for(var i=0; i< this.addedLayers.length; i++){
            try{
                this.persistenceGeoContext.map.removeLayer(this.addedLayers[i]);
            }catch (e){
                // nothing to do
            }
        }
        this.addedLayers = new Array();
    },

    onLoadButtonClicked: function() {
        this.clearLayers();
        if(this.showLayers){
            var checkedNodes = this.layersTree.getChecked();
            for(var i = 0 ; i<checkedNodes.length; i++){
                var layer = this.persistenceGeoContext.getLayerFromData(checkedNodes[i].attributes.data);                
                layer.groupLayers = null;
                layer.groupLayersIndex = null;
                this.persistenceGeoContext.map.addLayer(layer);
                this.addedLayers.push(layer);
            }
        }else{
            if(!!this.selectedChannel){
                Viewer.trackUrl('channels/' + this.selectedChannelName);
                this.persistenceGeoContext.loadChannel(this.selectedChannel, this.selectedChannelName);    
            }
        }
    }

});

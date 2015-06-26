var map,
    lonLat,
    pLOC,
    layerLOC,
    layerPREDIOS,
    layerSELECT,
    layerUNION,
    layerREGIONES,
    selectControl

var chgFoto = false;
var chgProp = false;

function activateControl(id) {
    for (var i in map.controls) {
        var control = map.controls[i]; if (control.id == id) { control.activate(); }
    }
}

function deactivateControl(id) {
    for (var i in map.controls) {
        var control = map.controls[i]; if (control.id == id) { control.deactivate(); }
    }
}

window.onload = function () {

    OpenLayers.ProxyHost = 'proxy.ashx?url=';

    //test renderer for vector layers
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    //define map object with base layers
    map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection('EPSG:3857'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: 'm',
        layers: [ new OpenLayers.Layer.Google('Google Satellite', { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20 }) ],
        controls: [ new OpenLayers.Control.Navigation(), new OpenLayers.Control.ArgParser() ],
        center: new OpenLayers.LonLat(-87.099, 20.667).transform('EPSG:4326', 'EPSG:3857'),
        zoom: 13
    });

    //tile layer
    layerXYZ = new OpenLayers.Layer.XYZ("MapTiler layer", "http://argeomatica2012.cloudapp.net/SOLIDARIDAD_vuelo/${z}/${x}/${y}.png", {
        format: 'image/png',
        transitionEffect: 'resize',
        isBaseLayer: false
    });
    map.addLayer(layerXYZ);

    //styleLookup fillColor (layerPREDIOS)
    var styleLookupFillColor = {
        '': { fillColor: '' },
        'Verificado': { fillColor:'#FF0' },
        'Union': { fillColor:'#00F' },
        'Baldio': { fillColor:'#0F0' },
        'Abandonado': { fillColor: '#000' },
        'Construcion': { fillColor: '#F0F' }
    };
    var styleLookupFillOpacity = {
        '': { fillOpacity: 0 },
        'Verificado': { fillOpacity: 0.3 },
        'Union': { fillOpacity: 0.3 },
        'Baldio': { fillOpacity: 0.3 },
        'Abandonado': { fillOpacity: 0.5 },
        'Construcion': { fillOpacity: 0.3 }
    };

    //stylelookup strokeColor (layerPredios)
    var styleLookupStrokeColorDefault = {
        1: { strokeColor: '#0FF' },
    };

    //defaultStyle (layerPREDIOS)
    var defaultStyle = new OpenLayers.Style({
        fillColor: '',
        fillOpacity: 0,
        strokeColor: '#FF0',
        strokeWidth: 2
    })

    //selectStyle (layerPREDIOS)
    var selectStyle = new OpenLayers.Style({
        fillColor: '',
        fillOpacity: 0,
        strokeColor: '#FF0',
        strokeWidth: 2
    })

    //stylemap (LayerPREDIOS)
    var styleMapLayerPREDIOS = new OpenLayers.StyleMap({ 'default': defaultStyle, 'select': selectStyle });
    styleMapLayerPREDIOS.addUniqueValueRules('default', 'status', styleLookupFillColor);
    styleMapLayerPREDIOS.addUniqueValueRules('default', 'status', styleLookupFillOpacity);
    styleMapLayerPREDIOS.addUniqueValueRules('default', 'cloudfoto', styleLookupStrokeColorDefault);

    //layerPREDIOS
    layerPREDIOS = new OpenLayers.Layer.Vector('layerPREDIOS', {
        projection: 'EPSG:3857',
        maxExtent: new OpenLayers.Bounds(-170, -80, 170, 80).transform('EPSG:4326', 'EPSG:3857'),
        sphericalMercator: true,
        strategies: [ new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Refresh({ force: true, active: true }) ],
        protocol: new OpenLayers.Protocol.WFS({
            url: 'http://argeomatica2012.cloudapp.net/wxs/wfs.exe?',
            srsName: 'EPSG:3857',
            featureType: 'PREDIOS',
            geometryName: 'GML_Geometry'
        }),
        styleMap: styleMapLayerPREDIOS,
        visibility: false
    });
    map.addLayer(layerPREDIOS);
    
    //layerSELECT
    layerSELECT = new OpenLayers.Layer.Vector('layerSELECT', { rendererOptions: { zIndexing: true } });
    layerSELECT.style = { fillColor: '', fillOpacity: 0, strokeColor: '#F00', strokeWidth: 5 };
    map.addLayer(layerSELECT);

    //layerUNION
    layerUNION = new OpenLayers.Layer.Vector('layerUNION', { rendererOptions: { zIndexing: true } });
    layerUNION.style = { fillColor: '', fillOpacity: 0, strokeColor: '#F0F', strokeWidth: 5 };
    map.addLayer(layerUNION);
    
    //selectControlUnion (layerPREDIOS)
    selectControlUnion = new OpenLayers.Control.SelectFeature(layerPREDIOS, {
        onSelect: function (e) {
            $('#tbUnion').val(e.attributes.uid);
            layerUNION.removeAllFeatures();
            f = layerPREDIOS.getFeaturesByAttribute('uid', $('#tbUnion').val())[0].clone();
            layerUNION.addFeatures([f]);
        },
        clickout: false
    });
    selectControlUnion.id = 'selectControlUnion';
    selectControlUnion.handlers.feature.stopDown = false;
    map.addControl(selectControlUnion);

    //selectControl (layerPREDIOS)
    selectControl = new OpenLayers.Control.SelectFeature(layerPREDIOS, {
        onSelect: function (e) {
            $('#ddNivels').val(e.attributes.nivels);
            $('#tbDepartmentos').val(e.attributes.departmentos);
            $('#tbTiendas').val(e.attributes.tiendas);
            $('#tbGastronomia').val(e.attributes.gastronomia);
            $('#tbHotel').val(e.attributes.hotel);
            $('#tbInstitucional').val(e.attributes.institucional);
            $('#ddStatus').val(e.attributes.status);
            $('#tbUnion').val(e.attributes.unionwith);
            $('#tbNotas').val(e.attributes.notas);
            $('#tbUltimoCambio').val(e.attributes.ultimocambio);
            $('#tbUsario').val(e.attributes.usuario);
            $('#tbUID').val(e.attributes.uid);
            $('#tbCloudFoto').val(e.attributes.cloudfoto);
            lonLat = e.geometry.getBounds().getCenterLonLat();
            map.setCenter(lonLat);

            //show selected Feature
            layerSELECT.removeAllFeatures();
            f = layerPREDIOS.getFeaturesByAttribute('uid', e.attributes.uid)[0].clone();
            layerSELECT.addFeatures([f]);
            
            onSelect();

        },
        clickout: false
    });
    selectControl.id = 'selectControl';
    selectControl.handlers.feature.stopDown = false;
    map.addControl(selectControl);
    activateControl('selectControl');
    
    //layerLOC
    var layerLOC = new OpenLayers.Layer.Vector('layerLOC', { strategies: [new OpenLayers.Strategy.Refresh({ force: true, active: true })] });
    layerLOC.style = { fillColor: '#ffffff', strokeColor: '#000000', strokeWidth: 3, pointRadius: 9 };
    map.addLayer(layerLOC);
    pLOC = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0), null, null);
    layerLOC.addFeatures([pLOC]);
    
    //style (layerREGIONES)
    var styleREGIONES = new OpenLayers.Style({
        fillOpacity: 0,
        strokeColor: '#F0F',
        strokeWidth: 2,
        label: '${ID}',
        fontColor: '#F00',
        fontSize: 15
    });

    //layerREGIONES
    layerREGIONES = new OpenLayers.Layer.Vector('layerREGIONES', {
        projection: 'EPSG:3857',
        maxExtent: new OpenLayers.Bounds(-170, -80, 170, 80).transform('EPSG:4326', 'EPSG:3857'),
        sphericalMercator: true,
        strategies: [
            new OpenLayers.Strategy.BBOX(),
            new OpenLayers.Strategy.Refresh({ force: true, active: true })],
        protocol: new OpenLayers.Protocol.WFS({
            url: 'http://argeomatica2012.cloudapp.net/wxs/wfs.exe?',
            srsName: 'EPSG:3857',
            featureType: 'REGIONES',
            geometryName: 'GML_Geometry'
        }),
        styleMap: new OpenLayers.StyleMap({ 'default': styleREGIONES })
    });
    map.addLayer(layerREGIONES);

    //scale threshold
    map.events.on({
        "zoomend": function (e) {
            if (this.getZoom() < 17) {
                layerPREDIOS.setVisibility(false);
                layerREGIONES.setVisibility(true);
            }
            else {
                layerREGIONES.setVisibility(false);
                layerPREDIOS.setVisibility(true);
                layerPREDIOS.refresh({ force: true });
            }
        }
    });

}

function zoomLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform('EPSG:4326', map.getProjectionObject());
            pLOC.move(lonLat);
            map.setCenter(lonLat,19);
        });
    }
}

function onSelect() {
    //show unionWith feature
    layerUNION.removeAllFeatures();
    if ($('#tbUnion').val() != '') {
        f = layerPREDIOS.getFeaturesByAttribute('uid', $('#tbUnion').val())[0].clone();
        layerUNION.addFeatures([f]);
    }

    activateControl('selectControl');
    if (chgProp == true) {
        chgFoto = false;
        chgProp = false;
        layerPREDIOS.refresh({ force: true });
    }
    document.getElementById('saveIcon').className = "fa fa-sort-down fa-3x";
    $('#tbNOW').val(Date.now());
    $('#tbUltimoCambio').val(new Date(parseInt($('#tbUltimoCambio').val())).toLocaleString());
    if ($('#pnlPredio').is(":hidden")) {
        $('#pnlPredio').slideToggle('fast');
        $('#map').height('55%');
        map.updateSize();
        $('.btnPnl').show();
    }
    $('#mask').hide();
    loadPicture();
}

function save() {
    if (chgFoto == true) {
        $('#mask').show();
        imgUpload();
    }
    else if (chgProp == true) {
        if ($('#ddStatus').val() == '') {
            alert('No status.')
        }
        else {
            $('#mask').show();
            document.getElementById('ASPsave').click();
        }
    }
    else {
        $('#pnlPredio').slideToggle('fast');
        $('#map').height('100%');
        map.updateSize();
        $('.btnPnl').hide();
        selectControl.unselectAll();
        layerSELECT.removeAllFeatures();
        layerUNION.removeAllFeatures();
    }
}

function tbChange(tb) {
    deactivateControl('selectControl');
    chgProp = true;
    tb.style.background = '#FFC';
    document.getElementById('saveIcon').className = "fa fa-lock fa-3x";
    if ($('#ddStatus').val() == 'Union') {
        activateControl('selectControlUnion');
    } else { $('#tbUnion').val(''); layerUNION.removeAllFeatures(); }
}

function SQLsavedFail() { alert('SQL save FAIL'); }

function loadPicture(file) {
    //clear canvas element
    var canvasHold = document.getElementById('canvasHold');
    canvasHold.innerHTML = '';
    canvasHold.innerHTML = '<canvas id="imgCanvas" width="0" height="0"></canvas>';
    //check whether load from file or URL
    if (file) {
        var imgURL = window.URL.createObjectURL(file);
        chgFoto = true;
        chgProp = true;
        deactivateControl('selectControl');
        document.getElementById('saveIcon').className = "fa fa-lock fa-3x";
    } else {
        var imgURL = 'http://portalvhds3dfldyxyc9m64.blob.core.windows.net/playadelcarmen/' + $('#tbUID').val() + '.jpg' + '?t=' + new Date().getTime();
    }
    //load image
    var img = new Image();
    var imgCanvas = document.getElementById('imgCanvas');
    var ctx = imgCanvas.getContext('2d');

    img.onload = function () {
        var maxWidth = document.getElementById('tbUID').offsetWidth;
        var width = img.width;
        var height = img.height;
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
        imgCanvas.width = width;
        imgCanvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    }
    img.src = imgURL;
}

function imgUpload() {
    var r = new FileReader();
    r.onloadend = function (e) {
        var baseUrl = $("#tbSAS").val();
        var fileName = $('#tbUID').val() + '.jpg';
        var indexOfQueryStart = baseUrl.indexOf("?");
        var submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + fileName + baseUrl.substring(indexOfQueryStart);
        var requestData = e.target.result;
        var XHR = new XMLHttpRequest();
            XHR.open("PUT", submitUri);
            XHR.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            XHR.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
            XHR.setRequestHeader('Content-Length', requestData.length);
            XHR.addEventListener('readystatechange', function (e) {
                if (this.readyState === 4) {
                    chgFoto = false;
                    document.getElementById('progressBarActual').style.width = '0%';
                    console.log('Upload: 100%');
                    $('#tbCloudFoto').val('1');
                    document.getElementById('ASPsave').click();
                }
            });
            XHR.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var percentComplete = parseInt((e.loaded / e.total) * 100);
                    document.getElementById('progressBarActual').style.width = percentComplete + '%';
                    console.log('Upload: ' + percentComplete + '%');
                }
            };
            XHR.send(requestData);
    }
    var imgCanvas = document.getElementById('imgCanvas');
    try {
        var dataURL = imgCanvas.toDataURL('image/jpeg');
    }
    catch (err) {
        alert(err);
    }
    var dataBlob = dataURItoBlob(dataURL);
    r.readAsArrayBuffer(dataBlob);
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for (var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], { type: mimeString });
}
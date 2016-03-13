// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

// Taken from http://bootsnipp.com/snippets/Oe5XM
var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);

var merge = function(left, right) {
    console.log("Merging");
    console.log(left);
    console.log(right);
    for (var key in right) {
        if (right.hasOwnProperty) {
            left[key] = right[key];
        }
    }
    
    return left;
}

/* global google */
var googleMapsApiLoaded = false;
function createMap() {
    
    return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            var options = {
                enableHighAccuracy: true,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(function(position) {
                resolve(position);
            }, function(error) {
                reject(error.code);
            },options);
        } else {
            reject(null); // Something other than null should be used.
        }
    }).then(function(position) {
        return new Promise(function(resolve, reject) {
            if (!googleMapsApiLoaded) { // Javascript only excutes single-threaded, so this works without race conditions.
                window['onGoogleMapsApiLoad'] = function() {
                    googleMapsApiLoaded = true;
                    resolve(position);
                }
            } else {
                resolve(position);
            }
        });
    }).then(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var accuracy = position.coords.accuracy;
        
        window['position'] = {lat: lat, long: long, accuracy: accuracy};
        
        
        window['map'] = new google.maps.Map(document.getElementById('map'), {
           center: {lat: lat, lng: long},
           zoom: 14
        });
    });
}

function addSelfPosition(markerOptions, circleOptions) {
    var lat = window['position'].lat;
    var long = window['position'].long;
    var accuracy = window['position'].accuracy;
    console.log("Options? " + markerOptions + " " + circleOptions);
    
    markerOptions = markerOptions || {};
    circleOptions = circleOptions || {};
    
    var marker = new google.maps.Marker(merge({
        map: window['map'],
        position: {lat: lat, lng: long},
        title: "Your position",
        label: 'P'
    }, markerOptions));
    
    
    var circle = new google.maps.Circle(merge({
        strokeColor: '#0000FF',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.2,
        map: window['map'],
        center: {lat: lat, lng: long},
        radius: accuracy
    }, circleOptions));
    
    return {marker: marker, circle: circle};
}

function addRacks(racks) {

    for (var i = 0; i < racks.length; i++) {
        new google.maps.Marker({
            map: window['map'],
            position: {lat: racks[i].lat, lng: racks[i].long}
        });
    }
}

function onGoogleMapsApiLoad() {
    googleMapsApiLoaded = true;
}

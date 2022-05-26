(function ($, Drupal, drupalSettings) {
    'use strict';
    Drupal.behaviors.citizen_fm_media_edit = {
        attach: function (context, settings) {
            // Get all 'media' <a> tags.
            var media_anchors = document.querySelectorAll('a[data-entity-type=media], span.file a');
            // Add the event listener.
            media_anchors.forEach(function (a) {
                a.addEventListener('click', function (e) {
                    // Add special functionality for Shift+click.
                    if (e.shiftKey) {
                        e.preventDefault();
                        // Get the current path so we know what page to return to.
                        var path = window.location.pathname;
                        // Pull the UUID from the data-entity-uuid attribute.
                        var uuid = a.getAttribute('data-entity-uuid');
                        // Preferably, we'll use the uuid to retrieve the Media ID.
                        if (uuid) {
                            $.ajax({url: '/media/uuid/' + uuid,}).done(function (mid) {
                                window.location = '/media/' + mid + '/edit?destination=' + path;
                            });
                        }
                        // For file links displayed in Paragraphs, use the filename.
                        else {
                            var filename = decodeURI(a.href.substring(a.href.lastIndexOf('/') + 1));
                            $.ajax({url: '/media/filename/' + filename,}).done(function (mid) {
                                window.location = '/media/' + mid + '/edit?destination=' + path;
                            });
                        }
                    }
                });
            });
        }
    };
})(jQuery, Drupal, drupalSettings);

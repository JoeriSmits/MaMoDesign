/* global $:false */
'use strict';

$(document).ready(function() {
    // Variable to hold request
    var request;

    // Bind to the submit event of our form
    $('#contact').submit(function(event){

        // Prevent default posting of form
        event.preventDefault();

        // Abort any pending request
        if (request) {
            request.abort();
        }
        // setup some local variables
        var $form = $(this);

        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = {
            name: $inputs[0].value,
            email: $inputs[1].value,
            message: $inputs[2].value
        };

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);

        // Fire off the request to /form.php
        request = $.ajax({
            url: "/API/Mail.php",
            type: "post",
            data: JSON.stringify(serializedData),
            contentType: 'application/json'
        });

        //message
        var $message = $('#notify-toast');

        // Callback handler that will be called on success
        request.done(function (){
            $inputs[3].classList.add('btn-success');
            $inputs[3].classList.remove('btn-outline');
            $message[0].classList.add('success');
            $message[0].setAttribute('open', '');
            $message[0].innerHTML = 'Uw bericht is verstuurd. Wij nemen zo snel mogelijk contact met uw op.';

            setTimeout(function() {
                $message[0].classList.remove('success');
                $message[0].removeAttribute('open');
            }, 3500);
        });


        // Callback handler that will be called on failure
        request.fail(function (){
            $inputs[3].classList.add('btn-danger');
            $inputs[3].classList.remove('btn-outline');

            $message[0].classList.add('danger');
            $message[0].setAttribute('open', '');
            $message[0].innerHTML = 'Helaas is er iets mis gegaan. U kunt ons bereiken op het volgende email address: info@mamodesign.nl, excuses.';

            setTimeout(function() {
                $message[0].classList.remove('danger');
                $message[0].removeAttribute('open');
            }, 10000);
        });

        // Callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // Reenable the inputs
            $inputs.prop("disabled", false);
        });
    });
});
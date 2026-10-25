/*==============================================================*/
// Klev Contact Form  JS
/*==============================================================*/
(function ($) {
    "use strict"; // Start of use strict
    var $contactForm = $("#contactForm");

    if (!$contactForm.length) {
        return;
    }

    var EMAILJS_SERVICE_ID = "service_sl1s6hj";
    var EMAILJS_TEMPLATE_ID = "template_bcxffpi";
    var EMAILJS_PUBLIC_KEY = "rxLeyjJjEz5WKVMMy";

    $contactForm.validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formError();
            submitMSG(false, "Did you fill in the form properly?");
        } else {
            // everything looks good!
            event.preventDefault();
            submitForm();
        }
    });


    function submitForm(){
        var config = [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY];
        var submitButton = $contactForm.find('[type="submit"]');
        var originalButtonContent = submitButton.html();

        if (config.some(function (value) { return !value || value.indexOf("YOUR_") === 0; })) {
            submitMSG(false, "EmailJS is not configured. Add your service ID, template ID, and public key in contact-form-script.js.");
            return;
        }

        if (!window.emailjs) {
            submitMSG(false, "The email service could not be loaded. Please try again later.");
            return;
        }

        submitButton.prop("disabled", true).text("Sending...");

        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, $contactForm[0], {
            publicKey: EMAILJS_PUBLIC_KEY
        }).then(function () {
            formSuccess();
        }).catch(function (error) {
            console.error("EmailJS submission failed:", error);
            formError();
            submitMSG(false, "Sorry, your message could not be sent. Please try again.");
        }).finally(function () {
            submitButton.prop("disabled", false).html(originalButtonContent);
        });
    }

    function formSuccess(){
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!")
    }

    function formError(){
        $contactForm.addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('shake animated');
        });
    }

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h4 text-left tada animated text-success";
        } else {
            var msgClasses = "h4 text-left text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
}(jQuery)); // End of use strict
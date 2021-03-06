let PHRASES_DATA;
let MESSAGE;
let TIMER;
let COUNTER = 0;
let LISTENING = false;
let TEXT_DETECT_MSG = "Click in the text to listen the sentence!";

$(document).ready(function () {
    //https://www.youtube.com/watch?v=p4wsvdHSOPQ
    let AUDIO = new Audio('static/media/tada.mp3');
    
    $("#text").click(function () {
        var msg = new SpeechSynthesisUtterance();
        if (COUNTER == 0) {
            msg.rate = 1.5;
            COUNTER += 1;
        } else {
            msg.rate = 0.4;
            COUNTER = 0
        }
        msg.volume = 2;
        msg.text = this.textContent;
        window.speechSynthesis.speak(msg);
    });

    const settings = {
        "url": "static/data/quotes.json",
        "method": "GET"
    };

    $.ajax(settings).done(function (response) {

        PHRASES_DATA = response;
        generate_random_phrase(PHRASES_DATA);

        $("#skip").click(function () {
            generate_random_phrase(PHRASES_DATA);
        });

        $("#button-start").click(function () {
            if (LISTENING) {
                $("#button-text").text("SPEAK");
                recognition.stop()
                clearInterval(TIMER);
                LISTENING = false;
            }
            else {
                $("#button-text").text("PRESS AFTER DONE");
                recognition.continuous = true;
                recognition.start();
                LISTENING = true;
            }
        });
    });

    try {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.continuous = true;
    }
    catch (e) {
        console.error(e);
        $('.no-browser-support').show();
        $('.app').hide();
    }

    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        TIMER = setInterval(update, 1)
    }

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            clearInterval(TIMER);
            var text_detected = $("#text-detected");
            text_detected.css('color', 'red');
            text_detected.text("No speech was detected")
            $("#button-text").text("SPEAK");
        };
    }

    recognition.onspeechend = function () {
        clearInterval(TIMER);
        recognition.stop();
    }

    recognition.onresult = function (event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript.toLowerCase().replace(/[^a-z0-9]+/gi, " ");
        var text_detected = $("#text-detected");

        if (transcript == MESSAGE) {
            AUDIO.play();
            text_detected.css('color', 'white');
            text_detected.text("Congratulations you nailed it!")
            let button_div = $(".flexbox-item-2");
            button_div.hide();
            sleep(3000).then(() => {
                generate_random_phrase(PHRASES_DATA);
                text_detected.text();
                button_div.show();
                init_waves()
            });
        } else {
            compare_sentences(transcript, MESSAGE)
        }
    }
});
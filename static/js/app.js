$(document).ready(function () {
    let data;
    let message;
    let timer;
    let counter = 0;

    //https://www.youtube.com/watch?v=p4wsvdHSOPQ
    let audio = new Audio('static/media/tada.mp3');

    $("#text").click(function () {
        var msg = new SpeechSynthesisUtterance();
        if (counter == 0){
            msg.rate = 1.5;
            counter +=1;
        } else {
            msg.rate = 0.4;
            counter = 0
        }
        msg.volume= 2;
        msg.text = this.textContent;
        window.speechSynthesis.speak(msg);
    });

    const settings = {
        "url": "quotes.json",
        "method": "GET"
    }

    $.ajax(settings).done(function (response) {
        data = response
        position = Math.floor(Math.random() * data.length)
        message = data[position]["text"].toLowerCase().replace(/[^a-z0-9]+/gi, " ").trim()
        $("#text").text(data[position]["text"])

        $("#button-start").click(function () {
            recognition.start();
        });

        $("#button-stop").click(function () {
            console.log("stopped")
            recognition.stop()
            clearInterval(timer);
        });

    });

    try {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
    }
    catch (e) {
        console.error(e);
        $('.no-browser-support').show();
        $('.app').hide();
    }

    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        timer = setInterval(update, 1)
        document.getElementById("button-start").disabled = true;
    }

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            clearInterval(timer);
            $("#text-detected").text("No speech was detected");
            document.getElementById("button-start").disabled = false;
        };
    }

    recognition.onspeechend = function () {
        clearInterval(timer);
        document.getElementById("button-start").disabled = false;
        recognition.stop();
    }

    recognition.onresult = function (event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript.toLowerCase().replace(/[^a-z0-9]+/gi, " ");
        if (transcript == message) {
            confetti_loop()
            audio.play();

            $("#text-detected").text("Congratulations you nailed it!");
        } else {
            $("#text-detected").text(transcript);
        }
        $("#result").text()
    }

});
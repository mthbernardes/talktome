function compare_sentences(sentence_provided,sentence_original) {
    let s1Parts = sentence_provided.split(' ');
    let s2Parts = sentence_original.split(' ');
    let msg = document.getElementById('text-detected')
    msg.innerHTML= ""

    for (let i = 0; i < s1Parts.length; i++) {
        if (i == s1Parts.length) {
            word = s1Parts[i]
        } else {
            word = s1Parts[i] + " "
        }
        if (s1Parts[i] == s2Parts[i]) {
            msg.appendChild(document.createTextNode(word))
        } else {
            wrong_word = document.createElement("p")
            wrong_word.textContent = word
            wrong_word.style.display = "inline"
            wrong_word.style.color = "red"
            msg.appendChild(wrong_word)
        }
    }
}

function generate_random_phrase(data) {
    position = Math.floor(Math.random() * data.length);
    raw_message = data[position]["text"];
    MESSAGE = raw_message.toLowerCase().replace(/[^a-z0-9]+/gi, " ").trim();
    $("#text-detected").text(TEXT_DETECT_MSG);
    $("#text").text(raw_message);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
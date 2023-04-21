function handleSubmit(event) {
    event.preventDefault()

    let formText = document.getElementById('text').value
    console.log(`::: Form Submitted with text ${formText} :::`)

    return fetch('http://localhost:8080/analyze?text=' + formText)
        .then(res => res.json())
        .then(function (res) {
            console.log(res);
            if (res.error) {
                console.error("ERROR: ", res.error);
                showError(res.error);
            } else {
                showResult(res);
            }
        })
}


function showResult(res) {
    document.getElementById('polarity').innerHTML = res.polarity;
    document.getElementById('subjectivity').innerHTML = res.subjectivity;
    document.getElementById('irony').innerHTML = res.irony;
    document.getElementById('agreement').innerHTML = res.agreement;
    document.getElementById('confidence').innerHTML = res.confidence;

    document.getElementById('status-line').style.visibility = 'hidden';
    document.getElementById('results-table').style.visibility = 'visible';
}

function showError(error) {
    let textToShow = "Webservice call resulted in an error: " + JSON.stringify(error);
    showTextInStatusLine(textToShow);
}

function validateForm() {
    const textarea = document.getElementById('text');

    if (textarea.value.trim() === '') {
        showTextInStatusLine('Please enter some text to analyze');
        return false;
    } else {
        return true;
    }
}

function showTextInStatusLine(textToShow) {
    let statusLine = document.getElementById('status-line');
    statusLine.innerHTML = textToShow;
    statusLine.style.visibility = 'visible';

    document.getElementById('results-table').style.visibility = 'hidden';
}


export {handleSubmit, validateForm}

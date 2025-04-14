let full_scores;
let reduction_analysis;
let my_scores;

async function loadscores() {
    try {
        const response = await fetch('/json/full_scores.json');
        full_scores = await response.json();
    }
    catch (error) {
        console.log('Failed To load full_scores.json:', error);
    }
    try {
        const response = await fetch('/json/scores_reduction_and_analysis.json');
        reduction_analysis = await response.json();
    }
    catch (error) {
        console.log('Failed To load scores_reduction_and_analysis.json:', error);
    }
    try {
        const response = await fetch('/json/my_scores.json');
        const text = await response.text();
        if (text.trim() == "") {

            my_scores = null;
        }
        else {
            my_scores = JSON.parse(text);
        }
    }
    catch (error) {
        console.log('Failed To load my_scores.json:', error);
    }
}

function card(scoresJson, card_container_id) {
    const container = document.getElementById(card_container_id);
    if (!container) {
        return;
    }

    if (scoresJson == null) {
        document.getElementById(card_container_id).innerHTML = `<div class="card">
                        <h3>Soon</h3>
                        <p>${0} sheet</p>
                    </div>`;
    } else {
        let card_HTML = "";
        for (const composer in scoresJson) {
            const count = scoresJson[composer].length;
            if (count == 1) {
                card_HTML += `<div class="card">
                        <h3>${composer}</h3>
                        <p>${count} sheet</p>
                    </div>`
            }
            else {
                card_HTML += `<div class="card">
                        <h3>${composer}</h3>
                        <p>${count} sheets</p>
                    </div>`
            }
        }
        container.innerHTML = card_HTML;
    }
}

function getCardComposerAndId() {
    document.addEventListener("click", function (e) {
        const card = e.target.closest(".card");
        if (!card) return;
        const composer = card.querySelector("h3").textContent;
        const container = card.parentElement.id;
        window.location.href = `scores-listing.html?composer=${encodeURIComponent(composer)}&section=${container}`;
    });
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const composer = params.get("composer");
    const section = params.get("section");
    return { composer, section };
}

function sheetsCardAndHeading(composer, section) {
    const topBar = document.getElementsByClassName("topBar")[0];
    if (topBar) {
        topBar.innerHTML = `<img onclick="window.history.back();" src="/images/arrow_left.svg">
            <h2>${composer}</h2>`;
    }

    const container = document.getElementsByClassName("cardsContainer")[0];
    let cardHTML = "";
    let cardData = full_scores;
    if (section === "full_scores_container") {
        cardData = full_scores;
    }
    else if (section === "reduction_container") {
        cardData = reduction_analysis;

    }
    else if (section === "myscores_container") {
        cardData = my_scores;
    }
    for (let i = 0; i < cardData[composer].length; i++) {
        cardHTML += `<div class="card">
                <h3>${cardData[composer][i].title}</h3>
                <p>${cardData[composer][i].movie}</p>`;
        if ("museScoreLink" in cardData[composer][i]) {
            cardHTML += `<button onClick="window.location.href='${cardData[composer][i].museScoreLink}';">Musescore <img
                        src="/images/external_link_icon.svg"> </button>
            </div>`
        } else {
            const encodedLink = encodeURI(cardData[composer][i].downloadLink);
            cardHTML += `<a href="${encodedLink}" download>
                            <button>Download <img src="/images/external_link_icon.svg"> </button>
                        </a>
                    </div>`
        }
    }

    container.innerHTML = cardHTML;

}

async function main() {
    await loadscores();
    if (window.location.pathname.includes("index.html")) {
        card(full_scores, "full_scores_container");
        card(reduction_analysis, "reduction_container");
        card(my_scores, "myscores_container");
        getCardComposerAndId();
    }

    if (window.location.pathname.includes("scores-listing.html")) {
        const { composer, section } = getQueryParams();
        console.log(composer);
        console.log(section);
        sheetsCardAndHeading(composer, section);
    }

    const hamburger = document.querySelector(".hamburger");
    const message = document.getElementById("hamburgerMessage");

    hamburger.addEventListener("click", () => {
        if (message.classList.contains("hidden")) {
            message.classList.remove("hidden");

            setTimeout(() => {
                message.classList.add("hidden");
            }, 3000);
        }
    });

    const copyright = document.getElementsByClassName("footerBar2")[0];
    const currentYear = new Date().getFullYear();
    copyright.innerHTML = `<p>&copy;${currentYear} tranquillo.manvith</p>`;
}

main();
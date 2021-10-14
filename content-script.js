
const loc = window.location.toString();
const url = new URL(loc);
const path = url.pathname;
const parts = path.split("/").filter(p => p.length > 0);
if (parts.length !== 2) {
    console.log("Not running extension as it is not the repo home page");
} else {
    fetch(`https://api.github.com/repos/${parts[0]}/${parts[1]}/stats/contributors`)
        .then(r => {
            r.text().then(json => {
                const parsed = JSON.parse(json);
                if (parsed.length > 0 && parsed[0].weeks && parsed[0].weeks.length > 0) {
                    const ts = parsed[0].weeks[0].w;
                    const firstCommitDate = new Date(ts * 1000);
                    const diffTime = Math.abs(new Date() - firstCommitDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const firstCommitDateEl = createElement("First Commit: " + firstCommitDate.toLocaleDateString('en-US', options));
                    const msg = `Repo Age: ${formatDays(diffDays)} days old`;
                    const repoAgeEl = createElement(msg);
                    const root = document.querySelector('div.BorderGrid-cell');
                    root.appendChild(firstCommitDateEl);
                    root.appendChild(repoAgeEl);
                }

            })
        });
}


function formatDays(numberOfDays) {
    const years = Math.floor(numberOfDays / 365);
    const months = Math.floor(numberOfDays % 365 / 30);
    const days = Math.floor(numberOfDays % 365 % 30);

    const yearsDisplay = years > 0 ? years + (years == 1 ? " year, " : " years, ") : "";
    const monthsDisplay = months > 0 ? months + (months == 1 ? " month, " : " months, ") : "";
    const daysDisplay = days > 0 ? days + (days == 1 ? " day" : " days") : "";
    return yearsDisplay + monthsDisplay + daysDisplay;
}

function createElement(msg) {
    var el = document.createElement("p");
    el.classList.add('f4');
    el.classList.add('mt-3');
    el.innerText = msg;
    return el;
}


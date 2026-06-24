// ─── P5R Month Loader ─────────────────────────────────────────────────────────

const P5R_MONTHS = ['april'];
// More months will be added as data is compiled:
// 'may', 'june', 'july', 'august', 'september',
// 'october', 'november', 'december', 'january', 'february', 'march'

const p5rDatesArray = [];

async function loadP5RMonths() {
    const container = document.getElementById('p5r-month-container');
    if (!container) return;

    const fetches = P5R_MONTHS.map(month =>
        fetch(`months/p5r/${month}.html`).then(res => {
            if (!res.ok) throw new Error(`Failed to load p5r/${month}.html`);
            return res.text();
        })
    );
    const results = await Promise.all(fetches);
    container.innerHTML = results.join('\n');
}

function saveP5RCheckboxStates() {
    const checkboxes = document.querySelectorAll('#p5r-month-container input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        localStorage.setItem('p5r_' + checkbox.id, checkbox.checked);
    });
}

function loadP5RCheckboxStates() {
    const checkboxes = document.querySelectorAll('#p5r-month-container input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        const savedState = localStorage.getItem('p5r_' + checkbox.id);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        }
        checkbox.addEventListener('change', saveP5RCheckboxStates);
        checkbox.addEventListener('change', p5rDateFinished);
    });
}

function buildP5RDatesArray() {
    const checkboxes = document.querySelectorAll('#p5r-month-container input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if (checkbox.nextElementSibling !== null) {
            if (checkbox.nextElementSibling.childNodes[0] !== null) {
                if (checkbox.nextElementSibling.childNodes[0] !== undefined) {
                    if (checkbox.nextElementSibling.childNodes[0].localName === 'strong') {
                        p5rDatesArray.push(checkbox);
                    }
                }
            }
        }
    });
    p5rSetDefaultCurrentDate();
    p5rDateFinished();
}

function p5rSetDefaultCurrentDate() {
    let dateCheck = document.querySelectorAll('.p5r-currentDate');
    if (dateCheck.length === 0 && p5rDatesArray.length > 0) {
        p5rDatesArray[0].parentNode.classList.add('p5r-currentDate');
        p5rDatesArray[0].parentNode.style.backgroundColor = 'rgb(255, 80, 80)';
    }
}

function p5rDateFinished() {
    const checkboxes = p5rDatesArray;
    for (let i = 0; i < checkboxes.length; i++) {
        let currentCheck = checkboxes[i];
        if (currentCheck.checked) {
            currentCheck.parentNode.style.backgroundColor = 'black';
            currentCheck.parentNode.nextElementSibling.style.visibility = 'hidden';
            currentCheck.parentNode.nextElementSibling.style.height = '0px';
            currentCheck.parentNode.classList.remove('p5r-currentDate');
            if (i + 1 < checkboxes.length && !checkboxes[i + 1].checked) {
                for (let j = 0; j < checkboxes.length; j++) {
                    if (checkboxes[j] === currentCheck) continue;
                    checkboxes[j].parentNode.classList.remove('p5r-currentDate');
                    if (checkboxes[j].checked) {
                        checkboxes[j].parentNode.style.backgroundColor = 'black';
                    } else {
                        checkboxes[j].parentNode.style.backgroundColor = 'rgb(180, 30, 40)';
                    }
                }
                checkboxes[i + 1].parentNode.classList.add('p5r-currentDate');
            }
        } else {
            if (currentCheck.parentNode.classList.contains('p5r-currentDate')) {
                currentCheck.parentNode.style.backgroundColor = 'rgb(255, 80, 80)';
            } else {
                currentCheck.parentNode.style.backgroundColor = 'rgb(180, 30, 40)';
            }
            currentCheck.parentNode.nextElementSibling.style.visibility = 'visible';
            currentCheck.parentNode.nextElementSibling.style.height = 'auto';
        }
    }
    p5rSetDefaultCurrentDate();
}

function resetP5R() {
    let toReset = confirm('You are about to reset the P5R guide. Would you like to proceed?');
    if (toReset) {
        let toResetConfirm = confirm('Are you sure?');
        if (toResetConfirm) {
            const checkboxes = Array.from(document.querySelectorAll('#p5r-month-container input'));
            for (let i = 0; i < checkboxes.length; i++) {
                let currentCheck = checkboxes[i];
                if (currentCheck.checked) {
                    currentCheck.checked = false;
                    p5rDateFinished();
                    saveP5RCheckboxStates();
                }
            }
            alert('The P5R guide has been reset.');
        }
    }
}

function scrollToP5RCurrentDate() {
    let currentDate = document.querySelector('.p5r-currentDate');
    if (currentDate !== null) {
        scrollIntoViewWithOffset(currentDate, 10);
    }
}

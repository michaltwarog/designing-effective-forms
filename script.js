let clickCount = 0;

document.addEventListener('click', () => {
    clickCount++;
    document.getElementById('click-count').innerText = clickCount;
});

document.addEventListener('DOMContentLoaded', () => {
    fetchAndFillCountries();
    getCountryByIP();
});

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        const countryInput = document.getElementById('country');
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');

        countryInput.removeEventListener('input', handleCountryInput);
        countryInput.addEventListener('input', handleCountryInput);
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function handleCountryInput(event) {
    const filterValue = event.target.value.toUpperCase();
    const options = event.target.getElementsByTagName('option');

    for (let i = 0; i < options.length; i++) {
        const optionValue = options[i].textContent.toUpperCase();
        if (optionValue.indexOf(filterValue) > -1) {
            options[i].style.display = '';
        } else {
            options[i].style.display = 'none';
        }
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const countryName = data.country;
            const countryInput = document.getElementById('country');
            countryInput.value = countryName;

            getCountryCode(countryName);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            const countryCodeInput = document.getElementById('countryCode');
            countryCodeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

function getInvoiceData() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const street = document.getElementById('street').value;
    const zipCode = document.getElementById('zipCode').value;
    const city = document.getElementById('city').value;

    const invoiceData = `${firstName} ${lastName}\n${street}\n${zipCode} ${city}`;

    return invoiceData;
}

document.getElementById('vatUE').addEventListener('change', function () {
    const vatNumberContainer = document.getElementById('vatNumberContainer');
    const invoiceDataContainer = document.getElementById('invoiceDataContainer');

    if (this.checked) {
        vatNumberContainer.style.display = 'block';
        invoiceDataContainer.style.display = 'block';
        document.getElementById('invoiceData').value = getInvoiceData();
    } else {
        vatNumberContainer.style.display = 'none';
        invoiceDataContainer.style.display = 'none';
        document.getElementById('invoiceData').value = '';
    }
});

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
    modal.show();
});

document.getElementById('form-feedback-modal').addEventListener('hidden.bs.modal', function () {
    window.location.reload();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('form').dispatchEvent(new Event('submit'));
    }
});

const fromCurrencySelect = document.querySelector("#from-currency");
const toCurrencySelect = document.querySelector("#to-currency");
const amountInput = document.querySelector("#amount");
const resultParagraph = document.querySelector("#result");
const currencyForm = document.querySelector("#currency-form");
const convertBtn = document.querySelector("#convert-button");
const clearBtn = document.querySelector("#clear-button");
const loader = document.querySelector("#loader");

async function convertCurrency() {
  loader.style.display = "block";
  const fromCurrencyCode = fromCurrencySelect.value;
  const toCurrencyCode = toCurrencySelect.value;
  const amount = amountInput.value;

  if (!amount || isNaN(amount) || amount <= 0) {
    resultParagraph.textContent = "Enter a valid amount.";
    resultParagraph.classList.add("text-danger");
    loader.style.display = "none";
    return;
  }

  try {
    const fromResponse = await fetch(
      `https://api.nbp.pl/api/exchangerates/rates/A/${fromCurrencyCode}/?format=json`
    );
    const fromData = await fromResponse.json();
    const fromExchangeRate = fromData?.rates?.[0]?.mid;

    const toResponse = await fetch(
      `https://api.nbp.pl/api/exchangerates/rates/A/${toCurrencyCode}/?format=json`
    );
    const toData = await toResponse.json();
    const toExchangeRate = toData?.rates?.[0]?.mid;

    if (!fromExchangeRate || !toExchangeRate) {
      throw new Error("Exchange rate not available.");
    }

    const result = ((amount * fromExchangeRate) / toExchangeRate).toFixed(2);

    resultParagraph.textContent = `${amount} ${fromCurrencyCode} = ${result} ${toCurrencyCode}`;
    resultParagraph.classList.remove("text-danger");
  } catch (error) {
    resultParagraph.textContent =
      "Exchange rate not available. Please try again.";
    resultParagraph.classList.add("text-danger");
  } finally {
    loader.style.display = "none";
  }
}

function clearApp() {
  amountInput.value = "";
  resultParagraph.textContent = "";
}

clearBtn.addEventListener("click", clearApp);

convertBtn.addEventListener("click", convertCurrency);

currencyForm.addEventListener("submit", function (event) {
  event.preventDefault();
  convertCurrency();
});

fromCurrencySelect.addEventListener("change", function () {
  if (amountInput.value !== "") {
    convertCurrency();
  } else {
    resultParagraph.textContent = "";
  }
});

toCurrencySelect.addEventListener("change", function () {
  if (amountInput.value !== "") {
    convertCurrency();
  } else {
    resultParagraph.textContent = "";
  }
});

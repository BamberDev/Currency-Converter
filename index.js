const currencySelect = document.querySelector("#currency");
const amountInput = document.querySelector("#amount");
const resultParagraph = document.querySelector("#result");
const currencyForm = document.querySelector("#currency-form");
const convertBtn = document.querySelector("#convert-button");
const clearBtn = document.querySelector("#clear-button");
const loader = document.querySelector("#loader");

async function convertCurrency() {
  loader.style.display = "block";
  const currencyCode = currencySelect.value;
  const amount = amountInput.value;

  if (!amount || isNaN(amount) || amount <= 0) {
    resultParagraph.textContent = "Enter a valid amount.";
    resultParagraph.classList.add("text-danger");
    loader.style.display = "none";
    return;
  }

  try {
    const response = await fetch(
      `https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/?format=json`
    );
    const data = await response.json();

    const exchangeRate = data?.rates?.[0]?.mid;

    if (!exchangeRate) {
      throw new Error("Exchange rate not available.");
    }

    const result = (amount * exchangeRate).toFixed(2);

    resultParagraph.textContent = `${amount} ${currencyCode} = ${result} PLN`;
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

currencySelect.addEventListener("change", function () {
  if (amountInput.value !== "") {
    convertCurrency();
  } else {
    resultParagraph.textContent = "";
  }
});

const axios = require("axios");

const data = {
  publicApplicationCreationTO: {
    applicantMessage: "dzien dobry, jes aktualny?",
    email: "waelsy123+1@gmail.com",
    firstName: "Michal",
    lastName: "Nowak",
    phoneNumber: "537884031",
    salutation: "MR",
    street: "Emilii Plater",
    houseNumber: "28",
    zipCode: "02625",
    city: "Poznan",
    additionalAddressInformation: "nic nie ma",
  },
  saveFormDataTO: {
    formData: {
      gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: "1",
      gewobag_fuer_wen_wird_die_wohnungsanfrage_gestellt:
        "Für mich selbst oder meine Angehörigen",
      gewobag_datenschutzhinweis_bestaetigt: true,
    },
    files: [],
  },
};

axios
  .post(
    "https://app.wohnungshelden.de/api/applicationFormEndpoint/3.0/form/create-application/78f041a8-0c9d-45ba-b290-e1e366cf2e27/7100%2F77710%2F0102%2F0034",
    data,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language":
          "en-US,en;q=0.9,ar;q=0.8,pl;q=0.7,fr;q=0.6,de;q=0.5,cs;q=0.4,und;q=0.3,eu;q=0.2,es;q=0.1,sv;q=0.1",
        "Content-Type": "application/json",
        Origin: "https://app.wohnungshelden.de",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
    }
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  });

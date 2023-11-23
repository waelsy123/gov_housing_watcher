import axios from 'axios';
const cheerio = require("cheerio");
import { User } from './data';

export const applyToHouse = async (url, user: User) => {
  const response = await axios.get(url);
  const html = response.data;

  // Load the HTML into cheerio
  const $ = cheerio.load(html);

  // Select the iframe element and get its 'src' attribute
  const iframeUrl = $('#contact-iframe').attr('src');

  console.log("🚀 ~ file: gewobag.ts:16 ~ applyToHouse ~ iframeUrl:", iframeUrl)


  const data = {
    publicApplicationCreationTO: {
      applicantMessage: user.applicantMessage,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      salutation: user.salutation,
      street: user.street,
      houseNumber: user.houseNumber,
      zipCode: user.zipCode,
      city: user.city,
      additionalAddressInformation: user.additionalAddressInformation
    },
    saveFormDataTO: {
      formData: {
        gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: user.gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder,
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
      console.log("🚀 ~ file: gewobag.ts:61 ~ .then ~ response.data:", response.data)
    })
    .catch((error) => {
      console.log("🚀 ~ file: gewobag.ts:63 ~ applyToHouse ~ error:", error.response ? error.response.data : error.message)
    });
}


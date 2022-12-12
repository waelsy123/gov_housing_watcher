const axios = require('axios')

// Set the URL of the server
const url =
  'https://www.sozialbau.at/angebot/sofort-verfuegbar/sofort-verfuegbar/confirm/'

// Set the form data
const formData = {
  tx_wxsozialbau_altbau: {
    __referrer: {
      '@request':
        'a:4:{s:10:"@extension";s:11:"WxSozialbau";s:11:"@controller";s:6:"Altbau";s:7:"@action";s:5:"order";s:7:"@vendor";s:2:"Wx";}2514257d24fb6002f9c01e63fd614daa1fb650ce'
    },
    __trustedProperties:
      'a:5:{s:6:"mobjnr";i:1;s:4:"mlfd";i:1;s:6:"topzim";i:1;s:7:"contact";a:16:{s:6:"gender";i:1;s:9:"last_name";i:1;s:10:"first_name";i:1;s:5:"title";i:1;s:8:"birthday";i:1;s:10:"birthmonth";i:1;s:9:"birthyear";i:1;s:6:"street";i:1;s:6:"hausnr";i:1;s:5:"floor";i:1;s:6:"doornr";i:1;s:3:"zip";i:1;s:4:"city";i:1;s:5:"phone";i:1;s:5:"email";i:1;s:6:"tenant";i:1;}s:5:"check";i:1;}d8dcd077c7a375ffcbf06067fe93232188011dcc',
    mobjnr: 440,
    mlfd: 191,
    topzim: 2,
    contact: {
      gender: 'f',
      last_name: 'Maya',
      first_name: 'Thaeir',
      title: 2,
      birthday: '03',
      birthmonth: '02',
      birthyear: 2003,
      street: 'Salmovska',
      hausnr: '10',
      floor: '',
      doornr: '',
      zip: '03-722',
      city: 'Banias',
      phone: '792535299',
      email: 'waelsy123@gmail.com',
      tenant: 0
    },
    check: ['tx_wxsozialbau_altbau[check]:', 'check']
  }
}

// Send the request
axios
  .post(url, formData)
  .then(response => {
    // Log the response data
    console.log(response.data)
  })
  .catch(error => {
    // Log the error
    console.error(error)
  })

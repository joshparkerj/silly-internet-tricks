/* eslint-disable max-len */
/* eslint-disable prefer-rest-params */
const func = function func() {
  const callback = arguments[arguments.length - 1];
  fetch('/api/v1/view?viewType=PRINCIPAL')
    .then((r) => r.json())
    .then(({
      user: {
        person: {
          givenName, familyName, homeAddress, mobilePhone, birthDate,
        },
      },
    }) => {
      const givenNameMatch = givenName === arguments[0];
      const familyNameMatch = familyName === arguments[1];
      const addressLine1Match = homeAddress?.streetAddressLine1 === arguments[2];
      const addressLine2Match = homeAddress?.streetAddressLine2 === arguments[3];
      const cityMatch = homeAddress?.citySuburb === arguments[4];
      const stateMatch = homeAddress?.stateProvinceRegion === arguments[5];
      const phoneMatch = mobilePhone.value.replace(/\D+/g, '') === arguments[6];
      const zipMatch = homeAddress.postalCode.startsWith(arguments[7]);
      const birthDateMatch = birthDate === arguments[8];
      callback(
        givenNameMatch && familyNameMatch && addressLine1Match && addressLine2Match && cityMatch && stateMatch && phoneMatch && zipMatch && birthDateMatch,
      );
    })
    .catch((err) => { console.error(err); callback(null); });
};

module.exports = func;

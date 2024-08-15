const config = {
  account: {
    validEmailAddressFormat: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
    validPasswordFormat: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
    validPhoneNumberFormat: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    validRoles: ['Player', 'Coach', 'Supporter', 'Admin'],
  },
  coach: {
    minTeamCount: 1,
    maxTeamCount: 10
  }
};

export default config;
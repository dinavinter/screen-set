
/**
 * Gigya Facebook login
 * @param {Object} e - a synthetic event
 */
export const facebookGigyaLogin = () => {
  console.log(`Facebook`);
  const params = {
    //   callback: onLogin(),
    provider: "facebook",
  };
  window.gigya.socialize.login(params);
};

/**
 * Gigya Twitter login
 * @param {Object} e - a synthetic event
 */
export const twitterGigyaLogin = () => {
  console.log(`Twitter`);
  const params = {
    //   callback: onLogin(),
    provider: "Twitter",
  };
  window.gigya.socialize.login(params);
};

/**
 * Gigya LinkedIn login
 * @param {Object} e - a synthetic event
 */
export const linkedinGigyaLogin = () => {
  console.log(`LinkedIn`);
  const params = {
    //   callback: onLogin(),
    provider: "LinkedIn",
  };
  window.gigya.socialize.login(params);
};

/**
 * Gigya Yahoo login
 * @param {Object} e - a synthetic event
 */
export const yahooGigyaLogin = (callback) => {
  console.log(`Yahoo`);
  const params = {
    callback: callback,
    provider: "Yahoo",
  };
  window.gigya.socialize.login(params);
};


export const googleGigyaLogin = (callback) => {
  console.log(`google`);
  const params = {
    callback: callback,
    provider: "google",
  };
  window.gigya.socialize.login(params);
};
export const oconnectGigyaLogin = (callback) => {
  console.log(`oconnect`);
  const params = {
    callback: callback,
    provider: "oidc-oconnect",
  };
  window.gigya.socialize.login({...params, enabledProviders: 'oidc-oconnect'});
};

export const opublicConnectGigyaLogin = (callback) => {
  console.log(`opublicConnect`);
  const params = {
    callback: callback,
    provider: "oidc-opublicConnect",
  };
  window.gigya.socialize.login({...params, enabledProviders: 'oidc-opublicConnect'});
};



export default ()=>window.gigya;

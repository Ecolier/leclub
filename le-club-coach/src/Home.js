import React, { useEffect, useState } from 'react';
import './Home.css';
import getPkce from 'oauth-pkce';

function Home(props) {

  const idpBaseUrl = process.env.REACT_APP_IDP_BASE_URL;
  if (!idpBaseUrl) throw new Error('An identity provider base URL was not provided in environment variables.');

  const clientId = process.env.REACT_APP_IDP_CLIENT_ID;
  if (!clientId) throw new Error('The client ID was not provided in environment variables.');

  const redirectUri = process.env.REACT_APP_IDP_REDIRECT_URI;
  if (!redirectUri) throw new Error('The redirect URI was not provided in environment variables.');

  const [authorizationUrl] = useState<URL>(() => {
    const url = new URL(`${idpBaseUrl}/authorize?`)
    url.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile',
      state: 'RANDOM_STRING'
    }).toString();
    return url;
  });

  useEffect(() => {
    getPkce(50, (error, { verifier, challenge }) => {
      if (error) throw new Error(`Error while generating PKCE challenge.`)
      authorizationUrl.searchParams.append('code_challenge', challenge);
      authorizationUrl.searchParams.append('code_challenge_method', 'S256');
    });
  }, [authorizationUrl]);

  return (
    <div className="home">
      <div className="logo"></div>
      <h1 className="welcome">Bienvenue, Coach.</h1>
      <button className="button" onClick={() => window.location.href = authorizationUrl.toString() }>
        Se connecter
      </button>
    </div>
  );
}

export default Home;

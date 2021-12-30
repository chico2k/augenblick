import { google, Auth } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import axios from 'axios';

const auth2 = {
  'web': {
    'client_id':
      '1055939983301-htjb5shalf4pgbopuvra3sotc4b3ksha.apps.googleusercontent.com',
    'project_id': 'arcane-dynamics-336610',
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://oauth2.googleapis.com/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_secret': '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',
  },
};

const fetchReview = async () => {
  try {
    // const auth = new google.auth.OAuth2({
    //   clientId:
    //     '1055939983301-htjb5shalf4pgbopuvra3sotc4b3ksha.apps.googleusercontent.com',
    //   clientSecret: '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',
    //   redirectUri: 'http://localhost:3000/oauth2callback',
    // });

    const scopes = [
      'https://www.googleapis.com/auth/plus.business.manage',
      'https://www.googleapis.com/auth/business.manage',
    ];

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, './auth.json'),
      scopes: scopes,
    });

    // const bla = (await auth.getRequestHeaders()) as any;

    // const url =
    //   'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
    // const data = await axios.get(url, {
    //   headers: {
    //     bla,
    //   },
    // });

    // console.log('data', data);

    // const defaultScope = ['https://www.googleapis.com/auth/business.manage'];

    // const test = auth.generateAuthUrl({
    //   access_type: 'offline',
    //   prompt: 'consent',
    //   scope: defaultScope,
    // });

    // console.log('bla', bla);

    // const bla = await axios.get(test);

    // console.log('bla', bla);
    // const { tokens } = await auth.getToken(code);

    // const bla = await auth.getRequestHeaders();

    // const auth = await authenticate({
    //   keyfilePath: path.join(__dirname, './auth.json'),
    //   scopes: [],
    // });

    // scopes
    // 1. https://www.googleapis.com/auth/plus.business.manage
    // 2. https://www.googleapis.com/auth/business.manage
    // SoURCE: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list?hl=de

    // console.log('auth', bla);

    const result = await google
      .mybusinessbusinessinformation({
        version: 'v1',
        auth,
      })
      .accounts.locations.list({
        'parent': 'accounts/111062442823621706463',
      });

    console.log('result', result);
  } catch (error) {
    console.log(error);
  }

  return;
};

export { fetchReview };

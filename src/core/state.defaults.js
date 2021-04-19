import appPackage from '../../package.json';

export const SERVER_URL = process.env.REACT_APP_DOOR43_SERVER_URL;

// removed for now (issue 684)
// SERVER_URL + '/api/v1/repos/Door43-Catalog/en_obs-sq',
const config = {
  authentication: {
    server: SERVER_URL,
    tokenid: appPackage.name,
  },
  repository: {
    urls: [
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_ta',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_tw',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_twl',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_tn',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_tq',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_obs',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_obs-tq',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_obs-tn',
      SERVER_URL + '/api/v1/repos/Door43-Catalog/en_obs-sn',
    ],
  },
};

export default {
  validationPriority: 'high',
  expandedScripture: true,
  fontScale: 100,
  config,
};

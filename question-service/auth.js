import axios from 'axios';
import 'dotenv/config.js';

const ROLES = {
  "Admin": 900,
  "User": 100
};

const USER_SERVICE_URL = process.env.NODE_ENV === 'test' ? process.env.USER_SERVICE_LOCAL_URL : process.env.USER_SERVICE_PROD_URL;

const validateAccessTokenAndRole = async (req, role) => {
  console.log('\nVALIDATING TOKEN AND ROLE BY CALLING USER SERVICE...');

  let body = {};
  if (role) {
    body.role = role;
  }

  return await axios.post(`${USER_SERVICE_URL}/verify-token-or-role`, body, {
    headers: {
      'authorization': req.headers.authorization
    },
  });
}

export default { ROLES, validateAccessTokenAndRole };

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const ROLES = {
    "Admin": 900,
    "User": 100	
};

const validateAccessToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({'error': 'Request has no authorization header!'}); // Unauthorized code (authentication fail)
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({'error': 'Request has no JWT!'}); // Unauthorized code (authentication fail)
    }

    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) { 
				return res.status(401).json({'error': 'Invalid/Expired JWT!'}); // Unauthorized code (authentication fail)
			}

            req.user = decoded.username;
            req.roles = decoded.roles;

            next();
        }
    );

	// TODO
	// call user service to find out if token is blacklisted (user logged out / deleted account)
}

const validateRoles = (allowedRoles) => {
    return (req, res, next) => {
		const { roles } = req;
        if (!roles) {
			return res.status(403).json({'error': 'User does not have a role!'}); // Forbidden code, user is unauthorized (no privilege for action)
		}

		console.log(`Looking for: ${allowedRoles}`);
		console.log(`Received: ${roles}`);

        const hasPermission = req.roles
			.map(role => allowedRoles.includes(role))
			.includes(true);
        if (!hasPermission) {
			console.log('DENIED\n');
			return res.status(403).json({'error': 'User does not have permission for this action!'}); // Forbidden code, user is unauthorized (no privilege for action)
		}

		console.log('APPROVED\n');
        next();
    }
}

export default { ROLES, validateAccessToken, validateRoles };

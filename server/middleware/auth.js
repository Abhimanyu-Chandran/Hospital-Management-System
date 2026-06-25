import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const [scheme, token] = authHeader.split(' ');
		if (scheme !== 'Bearer' || !token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token expired' });
		}
		return res.status(401).json({ message: 'Unauthorized' });
	}
};

export { requireAuth };
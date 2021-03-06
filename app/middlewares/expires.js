let nodeEnv = process.env.NODE_ENV;

module.exports = (req, res, next) => {
	req.expires = (gzip, type, expires) => {
		if(gzip === true) {
			if(nodeEnv === 'production') {
				req.url = req.url + '.gz';
				res.set({
					'Content-Type': `${type}`,
					'Content-Encoding': 'gzip'
				});
			}
		}

		res.set({
			'Expires': `${expires}`
		});
	}

	next();
};
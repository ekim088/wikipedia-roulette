const winston = require('winston');
const { format } = winston;
const { combine, label, json } = format;

export const wikiLogger = winston.loggers.add('wikipediaHandler', {
	format: combine(
		label({ label: 'wikipediaHandler' }),
		json()
	),
	transports: [
		new winston.transports.Console()
	]
});

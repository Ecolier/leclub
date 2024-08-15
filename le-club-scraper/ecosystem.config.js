module.exports = {
	apps : [
		{
			name: "scrapper",
			script: "./start.sh",
			instances: 2,
			increment_var: 'WORKER_NUM',
			env: {
				'WORKER_NUM': 0
			}
		},
		{
			name: "scrapper-scheduler",
			script: "./scheduler.sh",
		},
		{
			name: "scrapper-dashboard",
			script: "./dashboard.sh",
		},
	]
}

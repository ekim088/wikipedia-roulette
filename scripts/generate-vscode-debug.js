const fs = require('fs');
const path = require('path');

const widgetDir = process.cwd();
const vscodeDir = path.join(widgetDir, '.vscode');
const launchConfigPath = path.join(vscodeDir, 'launch.json');

if (!fs.existsSync(vscodeDir)) {
	fs.mkdirSync(vscodeDir);
} else if (fs.existsSync(launchConfigPath)) {
	let iteration = 0;
	let oldConfigPath;

	do {
		iteration += 1;
		oldConfigPath = `${launchConfigPath}.old.${iteration}`;
	} while (fs.existsSync(oldConfigPath));

	console.warn(`Moving previous 'launch.json' to '${oldConfigPath}'`);
	fs.renameSync(launchConfigPath, oldConfigPath);
}

const launchConfig = `{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "chrome",
			"request": "launch",
			"name": "Launch Chrome against localhost",
			"url": "http://localhost:3000",
			"webRoot": "\${workspaceFolder}"
		}
	]
}`;

fs.writeFile(launchConfigPath, launchConfig, () => {
	console.log(`Created: ${launchConfigPath}`);
});

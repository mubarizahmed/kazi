import { Theme } from '@/types';

const fs = require('fs');
const path = require('path');

export const defaultTheme: Theme = {
	name: 'Default Dark',
	type: 'Dark',
	primary: {
		'100': [227, 225, 237],
		// '100': [200, 196, 222],
		// '200': [147, 138, 211],
		'200': [174,168,206],
		'400': [90, 87, 162],
		'600': [46, 44, 86],
		'800': [26, 24, 54],
		'900': [13, 12, 28]
	},
	secondary: { '200': [62, 224, 158], '400': [41, 182, 126], '600': [20, 108, 73] },
	danger: [255, 82, 69],
	caution: [234, 144, 51],
	neutral: {
		'100': [226, 225, 239],
		'200': [198, 197, 209],
		'400': [144, 144, 156],
		'600': [94, 93, 105],
		'800': [48, 48, 58],
		'900': [14, 13, 24]
	}
};
const solarizedTheme: Theme = {
	name: 'Solarized',
	type: 'Dark',
	primary: {
		'100': [189, 234, 250],
		'200': [87, 215, 251],
		'400': [28, 160, 192],
		'600': [14, 104, 125],
		'800': [7, 54, 66],
		'900': [6, 31, 38],
	},
	secondary: { '200': [160, 214, 102], '400': [128, 173, 78], '600': [74, 102, 43] },
	danger: [255, 82, 69],
	caution: [234, 144, 51],
	neutral: {
		'100': [226, 225, 239],
		'200': [201, 198, 193],
		'400': [138, 136, 132],
		'600': [96, 94, 91],
		'800': [49, 48, 47],
		'900': [28, 27, 27]
	}
};

const defaultThemes: Theme[] = [defaultTheme, solarizedTheme];

export const getThemes = (userDir: string) => {
	const themeDir = path.join(userDir, 'themes');

	let themes: Theme[] = [...defaultThemes];

	// check if dir exists
	// if not, create dir
	fs.access(themeDir, (err: string) => {
		console.log(err ? 'no dir' : 'dir exists');
		fs.mkdirSync(themeDir, { recursive: true });
	});

	// access each JSON file in the dir
	// parse JSON file
	// if object can be cast into theme type add it to themes array
	fs.readdirSync(themeDir).forEach((file: string) => {
		if (file.endsWith('.json')) {
			const filePath = path.join(themeDir, file);
			try {
				const theme: Theme = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				themes.push(theme);
			} catch (err) {
				console.log(err, 'Error loading theme' + filePath);
			}
		}
	});

  return themes;
};

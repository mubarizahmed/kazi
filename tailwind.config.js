/** @type {import('tailwindcss').Config} */

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`
}

module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        'kdark' : generateColorClass('color-kdark'),
        'kdarker' : generateColorClass('color-kdarker'),
        'kmedium' : generateColorClass('color-kmedium'),
        'klight' : generateColorClass('color-klight'),
        'klighter' : generateColorClass('color-klighter'),
        'kaccent1' : generateColorClass('color-kaccent1'),
        'kaccent2' : generateColorClass('color-kaccent2'),
        
        'color-base': generateColorClass('color-base'),
        'base-contrast': generateColorClass('color-base-contrast'),
        'bg': generateColorClass('color-bg'),
        'bg-contrast': generateColorClass('color-bg-contrast'),
        'button': generateColorClass('color-button'),
        'button-contrast': generateColorClass('color-button-contrast'),
        'button-base': generateColorClass('color-button-base'),
        'nord8': '#0084F5ff',
        'nord9': '#0084F5ff',
        primary: '#1E1E1E',
        secondary: '#F2F2F2',
        accent: '#FFC107',
        'rich-black': '#0A0A1Aff',
        'rich-black-2': '#0D0C1Eff',
        'space-cadet': '#201E3Cff',
        'cool-gray': '#8391B2ff',
        'azure': '#0084F5ff',
        'blue-violet': '#7B3EF2ff',
        'mint': '#29B67Eff',
        'bittersweet': '#F96453ff',
        'todoist-4': '#D1453B',
        'todoist-3': '#eb8909',
        'todoist-2': '#246fe0',
        'todoist-1': 'grey',
        'pd-blue': '#1E1E1E',
        'pd-red': '#D1453B',
        'pd-yellow': '#eb8909',
        'pd-green': '#246fe0',
        'pd-grey': 'grey',
        'pd-charcoal': '#1E1E1E',
        'pd-orange': '#F2F2F2',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%)',
        'gradient-2': 'bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600'
      },
      fontFamily: {
        sans: ['Roboto','Inter','Montserrat', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
      }
    }
  },
  purge: {
    // content: ['./src/**/*.html'],
    options: {
      safelist: ['bg-todoist-1', 'bg-todoist-2', 'bg-todoist-3', 'bg-todoist-4', 'border-todoist-1', 'border-todoist-2','bg-nord8', 'border-todoist-3', 'border-todoist-4', 'gradient-1', 'bg-klighter'],
    },
  },

};
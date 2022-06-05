type translateType = {
	[key: string]: {
		[lang: string]: string
	}
}
export const translateDatas: translateType = {
	resize: {
		fr: 'Redimensionner',
	},
	width: {
		fr: 'Largeur',
	},
	height: {
		fr: 'Hauteur',
	},
	px: {
		fr: 'px',
	},
	activLayerNotVisible: {
		fr: 'Calque actuel inactif. ',
	},
	inactiveClick: {
		fr: 'Activez-le pour pouvoir le modifier.',
	},
	pencil: {
		fr: 'Crayon',
	},
	eraser: {
		fr: 'Gomme',
	},
	line: {
		fr: 'Ligne',
	},
	rect: {
		fr: 'Rectangle',
	},
	circle: {
		fr: 'Cercle',
	},
	bucket: {
		fr: 'Pot de peinture',
	},
	drag: {
		fr: 'Glisser',
	},
	crop: {
		fr: 'Recadrer',
	},
	zoom: {
		fr: 'Zoom',
	},
	unzoom: {
		fr: 'Dézoom',
	},
	handle: {
		fr: 'Déplacer',
	},
	'Set size to 1px': {
		fr: 'Définir la taille à 1px',
	},
	'Set size to 2px': {
		fr: 'Définir la taille à 2px',
	},
	'Set size to 3px': {
		fr: 'Définir la taille à 3px',
	},
	'Set size to 4px': {
		fr: 'Définir la taille à 4px',
	},
	'Choose a color': {
		fr: 'Choisir une couleur',
	},
	'fit to screen size': {
		fr: "Ajuster à l'écran",
	},
	undo: {
		fr: 'Annuler',
	},
	redo: {
		fr: 'Rétablir',
	},
	clear: {
		fr: 'Effacer',
	},
	open: {
		fr: 'Ouvrir',
	},
	save: {
		fr: 'Enregistrer',
	},
	download: {
		fr: 'Télécharger',
	},
	'add layer': {
		fr: 'Ajouter un calque',
	},
	'remove layer': {
		fr: 'Supprimer un calque',
	},
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const lang = urlParams.get('lang')

export default function translation(key: string) {
	const data = translateDatas[key]
	return lang ? data?.[lang] ?? null : null
}

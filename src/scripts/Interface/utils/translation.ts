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
	'Edition impossible': {
		fr: 'Edition impossible',
	},
	inactiveClick: {
		fr: "Pour pouvoir utiliser cette fonctionnalité le calque doit être actif et l'animation doit être stoppée.",
		en: 'To use this feature the layer must be active and the animation must be stopped.',
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
		fr: 'Déplacer',
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
		fr: 'Glisser',
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
	Layers: {
		fr: 'Calques',
	},
	Layer: {
		fr: 'Calque',
	},
	'add layer': {
		fr: 'Ajouter un calque',
	},
	'remove layer': {
		fr: 'Supprimer un calque',
	},
	'merge layer': {
		fr: 'Fusionner les calques',
	},
	'add frame': {
		fr: 'Nouvelle image',
	},
	'remove frame': {
		fr: "Supprimer l'image",
	},
	'If you leave before saving, your changes will be lost.': {
		fr: "Si vous quittez avant d'enregistrer, vos modifications seront perdues.",
	},
	'Onion skin': {
		fr: "Pelure d'oignon",
	},
	Play: {
		fr: "Lire l'animation",
	},
	'File Name': {
		fr: 'Nom du fichier',
	},
	Scale: {
		fr: 'Échelle',
	},
	Columns: {
		fr: 'Colonnes',
	},
	Rows: {
		fr: 'Rangées',
	},
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const lang = urlParams.get('lang')

export default function translation(key: string) {
	const data = translateDatas[key]
	return lang ? data?.[lang] ?? null : null
}

# OubliETS

## Lancer l'application sur un téléphone
1) Installer cordova
```
npm install -g cordova
```

2) Intaller le SDK et installer la plateform désiré
Ex pour android:
Installer le Android SDK standalone a partir de https://developer.android.com/studio/index.html
Ajouter android comme plateform dans cordova
```
cordova plateform add android
```
3) Lancer l'app
```
cd oubliets
npm install
```

Lancer dans un emulateur (Il faut créer l'émulateur en premier avec AVD)
```
npm run emulator
```

Lancer sur un device
```
npm run device
```

## Création de la BD sqlite avec dummy.js
```
cd database
npm install
npm start
```

## Standard de programmation

1. Utilisation de [editor config](editor-config.org)
2. Utilisation du linter `npm run linter` dans le dossier 'oubliets/'

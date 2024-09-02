![Website](https://img.shields.io/website?url=https://horaires.add9.dev/)

# ISFCE_CALENDAR - ISFCE-CALENDRIER

Refonte du visuel des horaires de l'ISFCE et mis en ligne sur [horaires.add9.dev](https://horaires.add9.dev/) pour une utilisation plus simple et rapide.

## Installation

```bash
npm install
npm run start
```

## Installation via Docker

```bash
docker build -t isfce-calendar .
docker run -d -p 8080:80 isfce-calendar
```
![screenshot](https://cdn.discordapp.com/attachments/942581318154342442/1279817080786518036/image.png?ex=66d5d209&is=66d48089&hm=9d7465a0edf4ab9dec06ccb0a9cb11df8b0f0d4f35c0a864cb4610c61bf04af8&)
---

## Outils utilisés

Nous utilisons FullCalendar pour l'affichage des horaires ainsi que des iCal pour l'importation des horaires.
- [React](https://fr.react.dev/)
- [FullCalendar](https://fullcalendar.io/)
- [iCal](https://icalendar.org/)


## Fonctionnement

L'affichage des horaires fonctionne via des fichiers iCal qui sont importés dans le calendrier. Ces fichiers sont
générés manuellement.
Ensuite un fichier sections.json est généré pour permettre de filtrer les horaires par section et par niveau et horaire
de cours (Matin/Après-midi/Soir).
Les chemins vers les .ics (fichiers iCal) sont définis dans ce fichier.

Note : Les fichiers iCal n'ont pas besoin d'être présent localement, ils peuvent être hébergés sur un serveur externe, le path mentionné dans le fichier sections.json doit être accessible.

- Le composant Calendar chargé de l'affichage des horaires va lire le fichier sections.json pour afficher les horaires.
- Le composant DownloadICSSection va permettre de télécharger les fichiers iCal pour les importer dans un calendrier externe.
- Le composant SectionSelector va permettre à l'utilisateur de filtrer les horaires par section et par niveau et horaire de cours.
```json
[
  {
    "name": "Informatique",
    "levels": [
      {
        "name": "Niveau 1 - Après-Midi",
        "icsLink": "/ics/informatiqueN1A.ics",
        "color": "#FF5733"
      },
      {
        "name": "Niveau 1 - Soir",
        "icsLink": "/ics/informatiqueN1S.ics",
        "color": "#AA4499"
      },
      {
        "name": "Niveau 2 - Soir",
        "icsLink": "/ics/informatiqueN2S.ics",
        "color": "#EE5130"
      }
    ...]
```

## Déploiement

Le déploiement en production se fait sur un serveur EC2 AWS. les mises à jours du site sont automatiques via un webhook sur le repository GitHub.

## Contributeurs

- [Add9](https://github.com/Add9Dev/)
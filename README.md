# 🎓 Seeka University — English Club Manager

Application web légère, moderne et **100 % hors-ligne** conçue pour le **Club d'Anglais de Seeka University**. Elle permet aux membres et responsables du club d'enregistrer, d'organiser, de rechercher et d'exporter les informations recueillies lors de chaque séance.

---

## ✨ Fonctionnalités principales

* **Saisie structurée des séances** : Date, catégorie (*Vocabulaire, Débat, Grammaire, Prononciation, Culture*), thème du jour, intervenant et notes détaillées.
* **Carnet de vocabulaire bilingue (EN / FR)** : Ajout dynamique de paires *Mot / Expression anglaise* et *Traduction / Sens en français*.
* **Tableau de bord en temps réel** : Compteur de séances, nombre total d'expressions apprises, catégorie dominante et date de la dernière séance.
* **Recherche & Filtres instantanés** : Filtrage par catégorie et recherche multicritères (thème, mot anglais, traduction française, intervenant).
* **Partage rapide** : Copie d'un compte-rendu formaté en un clic pour diffusion sur WhatsApp, Telegram ou par e-mail.
* **Sauvegarde & Exportation** :
  * Stockage automatique local (`localStorage`) sans serveur requis.
  * Exportation vers **Excel / CSV** (`seeka-english-club-sessions.csv`).
  * Sauvegarde et restauration complète au format **JSON**.

---

## 📁 Structure du projet

```text
seeka-english-club-manager/
├── index.html          # Structure principale de l'interface
├── css/
│   └── styles.css      # Charte graphique (Bleu Marine & Or Seeka University)
├── js/
│   └── app.js          # Logique applicative, CRUD, filtres et exports CSV/JSON
├── assets/
│   └── logo.svg        # Blason vectoriel Seeka University — English Club
├── .gitignore          # Fichiers ignorés par Git
├── LICENSE             # Licence MIT
└── README.md           # Documentation du projet
```

---

## 🚀 Installation et utilisation locale

Aucune installation de Node.js, Python ou base de données n'est nécessaire :

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/VOTRE-UTILISATEUR/seeka-english-club-manager.git
   ```
2. Ouvrez le dossier et double-cliquez sur le fichier `index.html` pour l'ouvrir dans votre navigateur (Chrome, Edge, Firefox, Safari).

---

## 🌐 Déploiement gratuit sur GitHub Pages

1. Créez un nouveau dépôt public sur [GitHub](https://github.com/new) nommé `seeka-english-club-manager`.
2. Poussez les fichiers du projet :
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Seeka University English Club Manager"
   git branch -M main
   git remote add origin https://github.com/VOTRE-UTILISATEUR/seeka-english-club-manager.git
   git push -u origin main
   ```
3. Sur GitHub, allez dans **Settings** → **Pages**.
4. Sous **Build and deployment**, sélectionnez **Deploy from a branch**, choisissez la branche `main` et le dossier `/ (root)`, puis cliquez sur **Save**.
5. Votre application sera accessible en ligne à l'adresse :
   `https://VOTRE-UTILISATEUR.github.io/seeka-english-club-manager/`

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Libre d'utilisation et d'adaptation pour les activités académiques et étudiantes de **Seeka University**.

---

## 💻 Application Windows (.exe)

L'application est empaquetée avec **Electron**. Les données restent stockées localement sur le PC.

* **Télécharger** : onglet *Releases* du dépôt (installateur `Setup.exe` ou version `Portable.exe`), ou onglet *Actions* → dernier build → artefact *Seeka-English-Club-Windows*.
* **Compiler soi-même** (sous Windows) :
  ```bash
  npm install
  npm start        # lancer en mode développement
  npm run dist     # générer les .exe dans dist/
  ```

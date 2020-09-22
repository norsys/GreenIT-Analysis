
inspirations :  
https://gokatz.me/blog/automate-chrome-extension-testing/ 
https://www.twilio.com/blog/how-to-build-a-cli-with-node-js 

Lancer `npm i` pour installer les dépendances
puis npm link pour créer le lien symbolique et pouvoir tester l'exécutable

`npm build -g .`

puis :
`greenit-analysis  
--scenario <chemin vers scenario>/scenario.json --chromePath "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`

sous windows

`greenit-analysis --scenario l:\git\GreenIT-Analysis\cli\ademe-scenario-profil-complete.json --chromePath "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"`

import { makeBadge } from 'badge-maker';
import fse from 'fs-extra';
import os from 'os';
import path from 'path';
import mustache from 'mustache';

export async function createReport(resultPath, endpoint, reportName, measure){
    var dir = `${resultPath}/${reportName}`;

    let errorLog = (err) => {
        if (err) {
          throw new Error(err);
        }
    }
   
    //create folders
    if (!fse.existsSync(dir)){
        fse.mkdirSync(dir,{ recursive: true });
    }

    //create json report
    fse.writeFile(dir+'/ecoIndex.json', JSON.stringify(measure), errorLog);

    //create svg badge
    const svg = createBadge(measure);
    fse.writeFile(dir+'/ecoIndex.svg', svg, errorLog);

    //manage common report static files
    const staticFilePath = findLocalPath('../template/static');
    await fse.copy(staticFilePath, `${resultPath}/commonStatic`, errorLog);

    //manage Mustache report
    const d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    const templateFilePath = findLocalPath('../template/report.html');
    const templateHtml = await fse.readFile(templateFilePath, 'utf-8');
    var rendered = mustache.render(templateHtml, 
        {reportName, endpoint, day, month, year, 
            "responsesSizeRounded": function () { return  Math.round(this.responsesSize / 1000) },
            "responsesSizeUncompressRounded": function () { return  (this.responsesSizeUncompress != 0) ? '('+Math.round(this.responsesSizeUncompress / 1000)+')':'' },
            "analysysDetailsAsList" : function () {
                let r = [];
                for (var key in this.analysysDetails) 
                    if (this.analysysDetails.hasOwnProperty(key)) {
                        r.push({"name":key,"value":this.analysysDetails[key]});
                    }
                return r;
              },
              "titleFor": function () {
                return function (name, render) {
                  return reportLabel[render(name)].label;
                }
              },
              "explainationFor": function () {
                return function (name, render) {
                    return reportLabel[render(name)].explaination;
                }
              },
              ...measure});
    fse.writeFile(dir+'/ecoIndex.html', rendered, errorLog);
}

export function findLocalPath(fileRelativePath){
    let fullPathName = new URL(import.meta.url).pathname;
  if (os.platform().indexOf("win32")!=-1) {
    // delete first '/' in windows file system
     fullPathName = fullPathName.substr(1, fullPathName.length)
  }
  return path.resolve(
    fullPathName.substr(fullPathName.indexOf('/')),
    fileRelativePath
  );
}

export function createBadge(measure) {
    const grade = measure.grade;
    const color = (function (grade) {
      switch (grade) {
        case 'A':
          return '#349A47';
        case 'B':
          return '#51B84B';
        case 'C':
          return '#CADB2A';
        case 'D':
          return '#F6EB15';
        case 'E':
          return '#FECD06';
        case 'F':
          return '#F99839';
        default:
          return '#ED2124';
      }
    })(grade);
    const format = {
      label: 'EcoIndex',
      message: grade,
      color: color,
    };
  
    return makeBadge(format);
  }

  const reportLabel = {
    "AddExpiresOrCacheControlHeaders": {
      "label": "Ajouter des expires ou cache-control headers (>= 95%)",
      "explaination": "Les en-têtes Expires et Cache-Control déterminent la durée pendant laquelle un navigateur doit conserver une ressource dans son cache. Vous devez donc les utiliser et les configurer correctement pour les feuilles de style CSS, les scripts JavaScript et les images. Idéalement, ces éléments doivent être conservés le plus longtemps possible pour que le navigateur ne les demande plus au serveur. Cela permet d'économiser les requêtes HTTP, la bande passante et l'alimentation du serveur."
    },
    "CompressHttp": {
        "label": "Compresser les ressources (>= 95%)",
        "explaination": "Vous pouvez compresser le contenu des pages HTML pour réduire la consommation de bande passante entre le client et le serveur. Tous les navigateurs modernes (smartphones, tablettes, ordinateurs portables et ordinateurs de bureau) acceptent le format HTML compressé via gzip ou Deflate. Le moyen le plus simple consiste à configurer le serveur Web de manière à ce qu'il comprime le flux de données HTML, à la volée ou automatiquement, à la sortie du serveur. Cette pratique (compression à la volée) n’est bénéfique que pour un flux de données HTML, car il évolue constamment. Lorsque cela est possible, nous vous recommandons de compresser manuellement les ressources statiques (par exemple, les bibliothèques CSS et JavaScript) en une seule fois."
    },
    "DomainsNumber": {
        "label": "Limiter le nombre de domaines (<3)",
        "explaination": "Lorsqu'un site Web ou un service en ligne héberge les composants d'une page Web dans plusieurs domaines, le navigateur doit établir une connexion HTTP avec chacun d'entre eux. Une fois la page HTML récupérée, le navigateur appelle les sources lorsqu'il traverse le DOM (Document Object Model). Certaines ressources sont essentielles au bon fonctionnement de la page. S'ils sont hébergés sur un autre domaine qui est lent, cela peut augmenter le temps de rendu de la page. Vous devez donc, lorsque cela est possible, regrouper toutes les ressources sur un seul domaine. La seule exception à cette règle concerne les ressources statiques (feuilles de style, images, etc.), qui doivent être hébergées sur un domaine distinct afin d'éviter l'envoi d'un ou plusieurs cookies pour chaque requête HTTP du navigateur GET. Cela réduit le temps de réponse et la consommation inutile de bande passante."
    },
    "HttpError": {
        "label": "Eviter les requêtes en erreur",
        "explaination": "Les requêtes en erreurs consomment inutilement des ressources."
    },
    "HttpRequests": {
        "label": "Limiter le nombre de requêtes HTTP (<27)",
        "explaination": "Le temps de téléchargement d’une page côté client est directement corrélé au nombre et à la taille des fichiers que le navigateur doit télécharger. Pour chaque fichier, le navigateur envoie un HTTP GET au serveur. Il attend la réponse, puis télécharge la ressource dès qu'elle est disponible. Selon le type de serveur Web que vous utilisez, plus le nombre de demandes par page est élevé, moins le serveur peut gérer de pages. La réduction du nombre de requêtes par page est essentielle pour réduire le nombre de serveurs HTTP nécessaires à l'exécution du site Web et, partant, son impact sur l'environnement."
    },
    "MaxCookiesLength": {
        "label": "Taille maximum des cookies par domaine(<512 Octets)",
        "explaination": "La longueur du cookie doit être réduite car il est envoyé à chaque requête."
    },
    "NoCookieForStaticRessources": {
        "label": "Pas de cookie pour les ressources statiques",
        "explaination": "Pour les ressources statiques, un cookie est inutile, cela consomme donc inutilement de la bande passante. Pour éviter cela, on peut utiliser un domaine différent pour les ressources statiques ou restreindre la portée des cookies crées"
    },
    "NoRedirect": {
        "label": "Eviter les redirections",
        "explaination": "Les redirections doivent être évitées autant que possible car elles ralentissent la réponse et consomment inutilement des ressources."
    },
    "OptimizeBitmapImages": {
        "label": "Optimiser les images bitmap",
        "explaination": "Les images bitmap constituent souvent la plupart des octets téléchargés, juste devant les bibliothèques CSS et JavaScript. Leur optimisation a donc un impact considérable sur la bande passante consommée."
    },
    "SocialNetworkButton": {
        "label": "N'utilisez pas les boutons standards des réseaux sociaux",
        "explaination": "Les réseaux sociaux tels que Facebook, Twiter, Pinterest, etc. fournissent des plugins à installer sur une page WEB pour y afficher un bouton partager et un compteur de j'aime. Ces plugins consomme des ressources inutilement, il est mieux de mettre des liens directs"
    },
    "StyleSheets": {
        "label": "Limiter le nombre de fichiers css (<3)",
        "explaination": "Réduisez le nombre de fichiers CSS pour réduire le nombre de requêtes HTTP. Si plusieurs feuilles de style sont utilisées sur toutes les pages du site Web, concaténez-les dans un seul fichier. Certains CMS et frameworks offrent des moyens d'effectuer cette optimisation automatiquement."
    },
    "UseETags": {
        "label": "Utiliser des ETags (>= 95%)",
        "explaination": "Un ETag est une signature associée à une réponse du serveur. Si le client demande une URL (page HTML, image, feuille de style, etc.) dont l'ETag est identique à celle qu'il a déjà, le serveur Web répondra qu'il n'a pas besoin de télécharger la ressource et qu'il doit utiliser celle-ci. il possède déjà. L'utilisation d'ETags permet d'économiser d'énormes quantités de bande passante."
    },
    "UseStandardTypefaces": {
        "label": "Utiliser des polices de caractères standards",
        "explaination": "Utilisez des polices standards telles qu’elles existent déjà sur l’ordinateur de l’utilisateur et n’ont donc pas besoin d’être téléchargées. Cela économise de la bande passante et améliore le temps de rendu du site Web."
    },
    "JsValidate": {
        "label": "Valider le javascript",
        "explaination": "JSLint est un outil de contrôle de qualité du code qui vérifie que la syntaxe JavaScript utilisée sera comprise par tous les navigateurs. Le code produit est donc conforme aux règles de codage qui permettent aux interpréteurs d’exécuter le code rapidement et facilement. Le processeur est donc utilisé pour un temps plus court."
    },
    "MinifiedCss": {
        "label": "Minifier les css (>= 95%)",
        "explaination": "tilisez un outil tel que YUI Compressor pour supprimer les espaces et les sauts de ligne inutiles. Apache mod_pagespeed de Google peut également automatiser cette opération."
    },
    "MinifiedJs": {
        "label": "Minifier les js (>= 95%)",
        "explaination": "Utilisez un outil tel que YUI Compressor pour supprimer les espaces inutiles, les sauts de ligne, les points-virgules et raccourcir les noms de variables locales. Cette opération peut être automatisée à l’aide du module Apache mod_pagespeed de Google."
    },
    "OptimizeSvg": {
        "label": "Optimiser les images svg",
        "explaination": "Les images svg sont moins lourdes que les images bitmap, elles peuvent cependant être optimisées et minifiées via des outils (par exemple svgo)"
    },
    "DontResizeImageInBrowser": {
        "label": "Ne pas retailler les images dans le navigateur",
        "explaination": "Ne redimensionnez pas les images avec les attributs HTML height et width. Cela envoie des images dans leur taille originale, gaspillant de la bande passante et de la puissance du processeur. Une image PNG-24 de 350 x 300 px est de 41 KB. Si vous redimensionniez le même fichier image en HTML et que vous l’affichez sous forme de vignette de 70 x 60 px, il s’agirait toujours de 41 Ko, alors qu’il devrait en réalité ne pas dépasser 3 Ko! Signification 38 KB téléchargés pour rien. La meilleure solution consiste à redimensionner les images à l'aide d'un logiciel tel que Photoshop, sans utiliser HTML. Lorsque le contenu ajouté par les utilisateurs du site Web n’a pas de valeur ajoutée spécifique, il est préférable de les empêcher d’insérer des images à l’aide d’un éditeur WYSIWYG, par exemple CKEditor."
    },
    "EmptySrcTag": {
        "label": "Eviter les tags SRC vides",
        "explaination": "S'il existe une balise d'image avec un attribut src vide, le navigateur appelle le répertoire dans lequel se trouve la page, générant des requêtes HTTP inutiles et supplémentaires."
    },
    "ExternalizeCss": {
        "label": "Externaliser les css",
        "explaination": "Assurez-vous que les fichiers CSS sont séparés du code HTML de la page. Si vous incluez du CSS dans le corps du fichier HTML et qu'il est utilisé pour plusieurs pages (ou même pour l'ensemble du site Web), le code doit être envoyé pour chaque page demandée par l'utilisateur, augmentant ainsi le volume de données envoyées. Toutefois, si les CSS se trouvent dans leurs propres fichiers distincts, le navigateur peut éviter de les redemander en les stockant dans son cache local."
    },
    "ExternalizeJs": {
        "label": "Externaliser les js",
        "explaination": "Assurez-vous que le code JavaScript est distinct du code HTML de la page, à l’exception de toute variable de configuration pour les objets JavaScript. Si vous incluez du code JavaScript dans le corps du fichier HTML et qu'il est utilisé pour plusieurs pages (ou même pour l'ensemble du site Web), le code doit être envoyé pour chaque page demandée par l'utilisateur, augmentant ainsi le volume de données envoyées. Toutefois, si le code JavaScript se trouve dans son propre fichier séparé, le navigateur peut éviter de les redemander en les stockant dans son cache local."
    },
    "ImageDownloadedNotDisplayed": {
        "label": "Ne télécharger pas des images inutilement",
        "explaination": "Télécharger des images qui ne seront pas nécessairement visibles consomme inutilement des ressources. Il s'agit par exemple d'images qui sont affichées uniquement suite à une action utilisateur."
    },
    "Plugins": {
        "label": "Ne pas utiliser de plugins",
        "explaination": "Évitez d’utiliser des plug-ins (machines virtuelles Flash Player, Java et Silverlight, etc.), car ils peuvent entraîner une lourde charge de ressources (processeur et RAM). C’est particulièrement vrai avec le lecteur Adobe, à tel point qu’Apple a décidé de ne pas installer la technologie sur ses appareils mobiles afin de maximiser la durée de vie de la batterie. Privilégiez les technologies standard telles que HTML5 et ECMAScript"
    },
    "PrintStyleSheet": {
        "label": "Fournir une print css",
        "explaination": "Outre les avantages pour l’utilisateur, cette feuille de style réduit le nombre de pages imprimées et donc réduit indirectement l’empreinte écologique du site Web. Elle doit être aussi simple que possible et utiliser une police de caractères à l'encre claire, par exemple Siècle gothique. Envisagez également de masquer l'en-tête, le pied de page, le menu et la barre latérale, ainsi que de supprimer toutes les images, à l'exception de celles nécessaires au contenu. Cette feuille de style d'impression permet d'obtenir une impression plus nette en réduisant ce qui est affiché à l'écran."
    }
  }
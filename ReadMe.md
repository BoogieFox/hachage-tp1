# COMPTE RENDU

## ETAPE 1

Pour vérifier le bon fonctionnement du serveur, j'ai juste ajouté un ```console.log()``` pour afficher si la requête était acheminée au bon endroit.

## ETAPE 2

Pour cette étape, il fallait coder une fonction permettant de renvoyer au format JSON la liste complète de tous les blocks. En commentaire de cette fonction se trouve la version n°1 que j'ai codée, celle-ci utilise explicitement un objet Promise. J'ai appris un peu plus tard qu'une fonction async renvoie toujours implicitement un objet Promise et que l'on était donc nullement obligés d'écrire ```return new Promise()```. L'ayant appris un peu plus tard dans le TP, on peut retrouver plusieurs fois en commentaires d'autres versions des fonctions.

La chose à comprendre pour réussir cette étape était de comprendre qu'il fallait utiliser ```JSON.parse()``` pour pouvoir retourner le résultat sous forme d'objet JSON et non en tant que String (qui est le type de retour de la fonction ```readFile()```);

## ETAPE 3

Cette étape a permis l'implémentation de la création de blocks dans la blockchain. Pour cela, j'ai utilisé les fonctions ```getDate()``` (qui a été complétée en amont) et ```uuidv4()``` fournie par la bibliothèque uuid. Les paramètres nom et don proviennent du JSON fourni lors de la requête POST. Cela a été un peu compliqué à mettre en place car je n'arrivais pas à avoir un fichier ```blockchain.json``` correctement structuré pour avoir une liste de blocks au format JSON. J'ai finalement réussi à force d'utiliser des ```JSON.parse()``` et ```JSON.stringify()``` mais pour que tout fonctionne bien, le fichier ```blockchain.json``` doit avoir une liste vide au départ.

## ETAPE 4

L'étape la plus compliquée selon moi. Je ne comprenais pas exactement ce qu'il fallait faire car je ne trouvais pas les instructions assez claires. J'avais compris qu'il fallait hacher le block précédent pour créer un champ hash pour le block suivant mais je ne comprenais pas ce qu'il fallait faire pour le premier block. Ce n'est qu'après plusieurs dizaines de minutes de recherche que j'ai trouvé une const ```monSecret``` dans un autre fichier qu'il fallait utiliser pour créer le hash du block initial. 

Pour la bonne implémentation du hachage, j'ai donc complété la fonction ```findLastBlock()``` et utilisé la bibliothèque node: crypto pour ```createHash()```. 

Lors de la création d'un block, je vérifie donc si c'est le premier block de la blockchain. Si oui, le hash sera créé à partir de la variable ```monSecret```, sinon le hash sera créé à partir du block précédent qui sera hacher à partir d'une chaîne de caractères (en utilisant ```JSON.stringify()```). 

## Pour aller plus loin

### Pour la fonction verifBlocks()

Pour pouvoir l'utiliser, j'ai créé la route ```GET:/blockchain/integrity```.

J'ai décidé de parcourir toute la liste des blocks en vérifiant que le hash correspondait bien au hachage du bloc précédent (sauf pour le premier block, pour lequel je vérifie si son hachage correspond à la variable ```monSecret```).

J'ai décidé aussi d'utiliser cette fonction lors de l'ajout de blocks à la blockchain pour d'abord vérifier son intégrité avant d'ajouter de nouveaux blocks. J'ai fait ceci pour ajouter de la valeur à cette fonction et ainsi voir un retour autre que ```true``` ou ```false``` lors de la vérification de l'intégrité de la chaîne.

### Pour la fonction findBlock(id)

Pour pouvoir l'utiliser, j'ai créé la route ```GET:/blockchain/single```. Le paramètre id de la fonction est donc récupéré en paramètre de la requête GET avec ```url.searchParams.get("id")```.

Voici un exemple de l'utilisation de cette requête : ```http://localhost:3000/blockchain/single?id=d307567d-f910-49aa-981a-99679613f43e```

Pour pouvoir trouver le block correspondant, je vais donc parcourir l'entièreté des blocks pour essayer de trouver un block ayant le bon id. Si je l'ai trouvé, je vérifie son intégrité avec la fonctiond de hachage que j'ai créée auparavant : ```calculateHash(toHash)```.
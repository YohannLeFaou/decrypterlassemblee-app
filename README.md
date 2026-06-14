# Décrypter l'Assemblée

## Quesaco ?

Savez-vous comment vote votre député ?

[decrypterlassemblee.fr](https://decrypterlassemblee.fr) est un outil gratuit pour explorer et analyser les votes à l'Assemblée nationale.

L'État met déjà ces données à disposition en open data. Problème : elles sont riches mais quasi-inexploitables sans compétences techniques. Des centaines de milliers de scrutins, des millions de positions de vote individuelles... autant d'informations qui dorment dans des fichiers XML que personne ne lit.

C'est là que l'IA entre en jeu : rendre ces informations lisibles et accessibles à tous. Posez une question en français, obtenez une réponse sourcée et vérifiable. Qui a voté quoi ? Quels groupes s'allient sur quels sujets ? Quels députés votent contre leur propre camp ?

Un exemple concret de ce que la technologie peut apporter à la vie démocratique : transformer des données publiques en connaissance citoyenne.

## Comment ça marche ?

Un agent IA connecté aux données de l'Assemblée nationale répond à vos questions en langage naturel. Lorsque vous posez une question, l'agent interroge automatiquement la base de données des scrutins et formule une réponse sourcée.

Les données couvrent la **16e législature** (juin 2022 - juin 2024) et la **17e législature** (depuis octobre 2024), mises à jour quotidiennement. Les nouveaux scrutins sont disponibles sous 24h.

Les réponses sont basées sur des données officielles. Comme tout système d'IA, des erreurs d'interprétation restent possibles : pour tout usage important, vérifiez directement sur le site de l'Assemblée nationale.

## Sources de données

- [data.assemblee-nationale.fr](https://data.assemblee-nationale.fr) : votes, dossiers législatifs, amendements, réunions de commissions
- [assemblee-nationale.fr](https://www.assemblee-nationale.fr) : informations et analyses sur le site de l'Assemblée nationale

## Projets similaires

- [nosdeputes.fr](https://www.regardscitoyens.org/nosdeputes-fr/) (Regards Citoyens) : référence historique du genre, non maintenu depuis la fin de la XVIe législature (juin 2024)
- [decryptaloi.fr](https://www.decryptaloi.fr/) : analyse des textes législatifs et décryptage d'amendements, sans jargon juridique

## Technologie

- **Modèle IA :** DeepSeek, le plus performant parmi les modèles testés
- **Hébergement :** serveurs européens
- **RGPD :** aucune donnée utilisateur n'est collectée ni conservée. Les questions posées transitent vers l'API DeepSeek mais ne sont pas loggées côté serveur. L'historique de conversation existe uniquement le temps de votre session dans votre navigateur.

## Contribuer

Le projet est open source et ouvert aux contributions. N'hésitez pas à ouvrir une issue ou une pull request.

/**
 * Pages métier : un jeu de fidélisation adapté à chaque type de commerce.
 * Exemples chiffrés présentés comme des calculs d'exemple, jamais comme des résultats promis.
 */
import type { TradePage } from "./types";

export const tradePages: TradePage[] = [
  {
    path: "/jeu-fidelisation-coiffeur",
    trade: "coiffeur",
    label: "Coiffeurs et barbiers",
    title: "Jeu de fidélisation pour coiffeur et barbier",
    description:
      "Une roue à cadeaux pour salon de coiffure ou barbier : le client scanne un QR code, gagne un lot et revient le chercher à sa prochaine coupe. Essai 14 jours.",
    eyebrow: "Coiffeurs et barbiers",
    h1: "Un jeu de fidélisation pour votre salon de coiffure",
    lead:
      "Entre deux coupes, il se passe souvent cinq ou six semaines. C'est long, et c'est pendant ce temps qu'un client essaie le salon d'à côté. Rouelia donne à chaque client une raison simple de revenir chez vous : à la fin de sa prestation, il tourne une roue, gagne un petit cadeau et l'utilise lors de son prochain rendez-vous. Sans application, sans carte à tamponner, avec des lots que vous choisissez.",
    sections: [
      {
        h2: "Pourquoi un client de salon ne revient pas toujours",
        answer:
          "Le rythme de visite est espacé et l'offre est dense dans chaque quartier. Un client satisfait peut tout de même partir ailleurs, simplement parce qu'il a oublié votre salon au moment de prendre rendez-vous.",
        p: [
          "Une coupe homme se refait toutes les trois à six semaines, une coupe femme parfois tous les deux ou trois mois. Entre deux visites, votre client passe devant d'autres vitrines, voit des offres de bienvenue sur les applications de réservation, et finit par tester un autre fauteuil. Ce n'est pas forcément un désaveu : c'est souvent de la commodité ou de la curiosité.",
          "Les barbiers connaissent bien ce phénomène. Une clientèle jeune, habituée à comparer, qui va là où il y a de la place le samedi matin. La carte de fidélité en carton ne suffit plus : elle reste au fond d'un portefeuille, ou elle est perdue avant la dixième coupe.",
        ],
      },
      {
        h2: "Comment la roue Rouelia fonctionne dans un salon",
        answer:
          "Le client scanne le QR code au moment de payer, tourne la roue sur son téléphone et repart avec un cadeau à utiliser lors de sa prochaine visite. Vous validez le code en caisse le jour où il revient.",
        p: [
          "Le meilleur moment, c'est l'encaissement. La coupe est finie, le client se regarde une dernière fois dans le miroir, il est content. Vous lui dites simplement : « Tenez, vous pouvez tourner la roue, c'est cadeau pour la prochaine fois. » Il scanne, indique son prénom et son téléphone, coche l'accord et tourne. Chaque case est un cadeau, il n'y a pas de case perdante.",
          "Il reçoit un code avec une date limite (30 jours par défaut, que vous pouvez allonger pour coller au rythme de vos coupes). S'il laisse son e-mail, le code lui est envoyé, et avec le pack Croissance il reçoit un rappel avant la date limite. Quand il revient, il montre son code, vous le validez dans l'onglet Caisse de votre espace.",
          "Le lien de réservation affiché après le jeu (pack Croissance) est particulièrement utile en salon : le client peut fixer sa prochaine coupe tout de suite, pendant qu'il y pense.",
        ],
      },
      {
        h2: "Où placer le QR code dans un salon de coiffure",
        answer:
          "Sur le comptoir de caisse en priorité, avec un chevalet bien visible. En complément, un rappel discret près des bacs ou sur le miroir du poste.",
        list: [
          "Le chevalet à côté du terminal de paiement : c'est là que le client a déjà son téléphone en main.",
          "Un petit flyer sur la tablette du poste de coupe, pour que le client le voie dans le miroir pendant la prestation.",
          "Près de la zone d'attente, pour ceux qui patientent avant leur tour (ils jouent, puis utilisent le cadeau la fois suivante).",
        ],
        p: [
          "Le flyer et le chevalet sont fournis à imprimer dans tous les packs. Pour aller plus loin sur l'emplacement, lisez notre article sur [où placer un QR code en boutique](/blog/qr-code-commerce-emplacement).",
        ],
      },
      {
        h2: "Combien coûtent les cadeaux pour un coiffeur",
        answer:
          "Vous fixez vous-même le coût de chaque lot et sa chance de sortir. Rouelia calcule le coût moyen d'une partie pour que vous gardiez la main sur votre budget.",
        p: [
          "Prenons un exemple, uniquement pour illustrer le calcul. Votre roue contient surtout des échantillons et des soins rapides, et un brushing offert avec une chance faible. Si le coût moyen d'une partie ressort autour de 2 € et que 40 clients jouent dans le mois, le jeu vous coûte environ 80 € de cadeaux sur le mois. Le cadeau n'est utilisé que si le client revient : un soin profond offert se glisse dans une prestation payante.",
          "Pour savoir si l'opération est intéressante, comparez ce budget avec le panier moyen de vos coupes. Dans cet exemple, si deux ou trois clients de plus reviennent dans le mois au lieu d'aller ailleurs, le calcul devient vite favorable. Ce n'est pas une garantie, c'est une façon de raisonner. Les prix des packs sont détaillés sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Le cadeau ne dépend jamais d'un avis",
        answer:
          "Le client gagne son cadeau en jouant, point final. Après le jeu, il peut se voir proposer de partager son avis sur Google, de façon neutre et facultative.",
        p: [
          "Aucun tri selon la note, aucune condition. Le jeu est gratuit, sans obligation d'achat, avec un règlement et une page données pour votre salon. Tout est expliqué sur la page [utilisation responsable](/utilisation-responsable).",
        ],
      },
    ],
    prizes: [
      { name: "Soin profond offert", note: "Coûte peu, se fait au bac en quelques minutes et donne au client une vraie sensation de cadeau." },
      { name: "-10 % sur la prochaine coupe", note: "Le lot le plus direct pour faire revenir : il n'a de valeur que chez vous." },
      { name: "Échantillon de soin", note: "Idéal en lot fréquent, il fait aussi tester un produit que vous vendez au salon." },
      { name: "Diagnostic cheveux offert", note: "Presque gratuit pour vous, et c'est l'occasion de conseiller une coloration ou un soin." },
      { name: "Taille de barbe offerte", note: "Pour les barbiers : un geste rapide qui fidélise une clientèle qui compare beaucoup." },
      { name: "Coiffant format voyage", note: "Un petit produit que le client emporte, et qui lui rappelle votre salon chaque matin." },
      { name: "Brushing offert", note: "Le gros lot, avec une chance faible : il fait rêver sans peser sur votre budget." },
    ],
    faq: [
      {
        q: "Mes clients reviennent toutes les six semaines, la date limite de 30 jours suffit-elle ?",
        a: "Vous réglez la date limite comme vous le souhaitez. Pour un salon, beaucoup préfèrent l'allonger pour qu'elle couvre au moins un cycle de coupe complet.",
      },
      {
        q: "Un client peut-il jouer à chaque coupe ?",
        a: "Vous choisissez la période : une participation par numéro de téléphone, par exemple une fois par mois ou une fois par trimestre.",
      },
      {
        q: "Mes coiffeurs peuvent-ils proposer la roue eux-mêmes ?",
        a: "Oui, n'importe qui au salon peut inviter le client à scanner. Avec le pack Croissance, des statistiques par employé vous montrent qui fait jouer le plus.",
      },
      {
        q: "Je n'ai pas le temps de configurer la roue, comment faire ?",
        a: "Choisissez le service « Créez-la pour moi » sur la page [créer ma roue](/creer-ma-roue), inclus à partir du pack Croissance : vous envoyez vos infos, nous créons la roue et vous recevez le QR code en quelques heures.",
      },
    ],
    cta:
      "Essayez la roue dans votre salon pendant 14 jours, sans carte bancaire. Vous pouvez aussi [prendre rendez-vous](/rendez-vous) pour en parler, ou voir comment font les [instituts de beauté](/jeu-fidelisation-institut-beaute).",
  },
  {
    path: "/jeu-fidelisation-restaurant",
    trade: "restaurant",
    label: "Restaurants et pizzerias",
    title: "Jeu de fidélisation pour restaurant et pizzeria",
    description:
      "Une roue à cadeaux pour restaurant ou pizzeria : café, dessert ou entrée offerts au prochain repas. Le client scanne un QR code en fin de repas. Essai gratuit.",
    eyebrow: "Restaurants et pizzerias",
    h1: "Un jeu de fidélisation pour votre restaurant",
    lead:
      "Dans une rue où trois restaurants se suivent, le client choisit souvent au dernier moment. Rouelia vous aide à être celui auquel il pense : en fin de repas, il tourne une roue, gagne un café, un dessert ou une entrée, et revient le chercher lors de son prochain passage. Le jeu se fait sur son téléphone, sans application, et vous fixez vous-même le coût de chaque lot.",
    sections: [
      {
        h2: "Pourquoi les clients d'un restaurant changent d'adresse",
        answer:
          "L'offre est abondante et l'envie de nouveauté est forte. Un client qui a bien mangé chez vous peut tout de même tester l'adresse voisine la semaine suivante.",
        p: [
          "Au restaurant, la fidélité se joue sur des décisions rapides : « on va où ce midi ? ». Les applications de livraison, les nouvelles ouvertures et les recommandations des collègues tirent chacun dans une direction différente. Sans raison concrète de revenir, même un client conquis peut vous oublier quelques semaines.",
          "Les pizzerias ont en plus la concurrence de la livraison. Le client qui a découvert votre pâte en salle commande parfois ailleurs le soir, par habitude de l'application. Un cadeau qui l'attend chez vous change la donne : il a une bonne raison de pousser votre porte plutôt qu'une autre.",
        ],
      },
      {
        h2: "Comment la roue Rouelia se passe au restaurant",
        answer:
          "Le QR code est posé avec l'addition ou sur la table. Le client joue en attendant de payer et repart avec un cadeau valable lors d'un prochain repas.",
        p: [
          "Le meilleur moment est la fin du repas : le café arrive, l'addition se prépare, les convives ont leur téléphone sur la table. Le serveur glisse une phrase simple : « Si vous voulez, scannez, il y a un cadeau pour votre prochaine visite. » Chaque case de la roue est gagnante.",
          "Le client indique son prénom et son téléphone, coche l'accord, tourne. Il obtient un code avec une date limite, et peut recevoir ce code par e-mail. Vous pouvez aussi prévoir un délai avant utilisation, pour que le dessert offert serve vraiment lors d'une nouvelle visite et pas dans la minute. Le jour où il revient, il montre son code et vous le validez dans l'onglet Caisse.",
          "Une participation par numéro de téléphone sur la période que vous choisissez : une table de quatre peut jouer quatre fois, mais chacun une seule fois.",
        ],
      },
      {
        h2: "Où placer le QR code dans un restaurant ou une pizzeria",
        answer:
          "Au moment de l'addition, c'est le plus efficace : sur le plateau à addition, sur la table ou sur le comptoir de caisse pour ceux qui paient debout.",
        list: [
          "Un petit chevalet sur chaque table, ou au moins sur les tables de deux et quatre couverts.",
          "Le flyer glissé dans le porte-addition, que le client voit au moment de payer.",
          "Sur le comptoir de vente à emporter, pour les clients qui attendent leur pizza.",
          "Agrafé au ticket ou collé sur la boîte de la commande à emporter.",
        ],
        p: [
          "Plus d'idées dans notre article sur [l'emplacement d'un QR code en commerce](/blog/qr-code-commerce-emplacement).",
        ],
      },
      {
        h2: "Comment fixer le coût des lots au restaurant",
        answer:
          "Mettez beaucoup de lots peu coûteux (café, boisson) et quelques lots plus rares (entrée, repas offert). Rouelia affiche le coût moyen d'une partie au fur et à mesure.",
        p: [
          "Voici un calcul d'exemple, à adapter à vos propres prix. Un café vous revient à quelques dizaines de centimes, un dessert maison autour de 2 €, un repas offert davantage, mais avec une très faible chance. Si le coût moyen d'une partie se situe vers 1,50 € et que 150 clients jouent dans le mois, le budget cadeaux est d'environ 225 € sur le mois.",
          "Ce budget ne part que si le client revient, et un client qui vient chercher son dessert commande en général un plat. Pour juger, rapprochez ce montant de votre ticket moyen et du nombre de retours supplémentaires qu'il vous faudrait. Aucun chiffre n'est garanti, mais vous savez à tout moment ce que le jeu vous coûte. Les packs sont présentés sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Un jeu propre, sans condition d'avis",
        answer:
          "Le cadeau est acquis dès que la roue s'arrête. La proposition de laisser un avis Google, après le jeu, est neutre et facultative.",
        p: [
          "Pas de « laissez un avis pour jouer », pas de filtre selon la note. Le jeu est gratuit et sans obligation d'achat, avec un règlement et une page données propres à votre restaurant. Détails sur la page [utilisation responsable](/utilisation-responsable).",
        ],
      },
    ],
    prizes: [
      { name: "Café offert", note: "Le lot fréquent par excellence : il coûte peu et se rajoute naturellement à un repas payant." },
      { name: "Boisson offerte", note: "Soft ou verre de vin, selon votre carte, pour accompagner le prochain plat." },
      { name: "Dessert offert", note: "Très apprécié, et souvent l'occasion de faire goûter un dessert maison." },
      { name: "Entrée offerte", note: "Un lot plus généreux qui donne envie de revenir à deux." },
      { name: "Pizza enfant offerte", note: "Pour les pizzerias : un excellent prétexte pour revenir en famille." },
      { name: "-10 % sur l'addition", note: "Simple à comprendre, et il s'applique à toute la table." },
      { name: "Un repas offert", note: "Le gros lot, réglé avec une chance faible pour garder un coût moyen maîtrisé." },
    ],
    faq: [
      {
        q: "Le jeu ne va-t-il pas ralentir le service ?",
        a: "Non, le client joue seul sur son téléphone pendant qu'il attend l'addition. Votre équipe n'a qu'une phrase à dire, et la validation en caisse prend quelques secondes.",
      },
      {
        q: "Puis-je empêcher qu'un dessert gagné soit utilisé dans le même repas ?",
        a: "Oui, vous pouvez fixer un délai avant utilisation. Le cadeau ne sera valable qu'à partir d'une prochaine visite.",
      },
      {
        q: "Le jeu fonctionne-t-il pour la vente à emporter ?",
        a: "Oui, il suffit de poser le QR code sur le comptoir ou d'ajouter le flyer à la commande. Le client joue en attendant sa pizza.",
      },
      {
        q: "Puis-je changer les lots selon la saison ?",
        a: "Vous pouvez modifier la roue quand vous voulez. Le pack Croissance permet aussi de programmer des roues saisonnières à l'avance. Voir les [tarifs](/tarifs).",
      },
    ],
    cta:
      "Testez la roue dans votre restaurant pendant 14 jours, sans carte bancaire. Pour une question, [prenez rendez-vous](/rendez-vous) ou voyez comment s'y prennent les [boulangeries](/jeu-fidelisation-boulangerie).",
  },
  {
    path: "/jeu-fidelisation-institut-beaute",
    trade: "institut",
    label: "Instituts de beauté",
    title: "Jeu de fidélisation pour institut de beauté",
    description:
      "Une roue à cadeaux pour institut de beauté : pose de vernis, massage des mains ou soin offert à la prochaine visite. QR code posé en caisse. Essai 14 jours.",
    eyebrow: "Instituts de beauté",
    h1: "Un jeu de fidélisation pour votre institut de beauté",
    lead:
      "Une cliente d'institut peut être très fidèle à une esthéticienne, puis disparaître du jour au lendemain parce qu'une offre de lancement l'a attirée ailleurs. Rouelia vous aide à garder le lien entre deux rendez-vous : après son soin, elle tourne une roue, gagne une attention (vernis, massage des mains, sourcils) et la retrouve lors de sa prochaine visite chez vous.",
    sections: [
      {
        h2: "Ce qui fait partir une cliente d'institut",
        answer:
          "Les offres de bienvenue des concurrents, les plateformes de réservation qui mettent tout le monde côte à côte, et des soins espacés de plusieurs semaines. Le lien se distend vite.",
        p: [
          "Une épilation revient toutes les quatre à six semaines, un soin du visage parfois tous les deux mois. Entre deux rendez-vous, votre cliente reçoit des promotions d'autres instituts, voit passer des offres « première visite » et compare les créneaux disponibles. La qualité de votre travail compte, mais la commodité pèse aussi.",
          "Les instituts ont un atout : une relation de confiance, presque personnelle. Ce qui manque souvent, c'est un petit déclencheur concret qui ramène la cliente au bon moment. Un cadeau qui l'attend chez vous joue exactement ce rôle.",
        ],
      },
      {
        h2: "La roue Rouelia appliquée à un institut",
        answer:
          "Après le soin, en caisse, la cliente scanne le QR code et tourne la roue. Son cadeau est valable lors du prochain rendez-vous et vous le validez en caisse.",
        p: [
          "Le bon moment est le règlement, quand la cliente se sent détendue et a déjà son téléphone pour payer ou reprendre rendez-vous. Une phrase suffit : « Pour vous remercier, vous pouvez tourner la roue, le cadeau est pour la prochaine fois. » Toutes les cases sont gagnantes.",
          "Elle saisit son prénom et son téléphone, son e-mail si elle le souhaite, coche l'accord et joue. Elle reçoit un code avec une date limite. Avec le pack Croissance, un e-mail lui rappelle son cadeau avant l'échéance, et un lien de réservation s'affiche après le jeu pour qu'elle bloque son prochain créneau tout de suite.",
          "Le jour où elle revient, elle montre son code, vous le validez dans l'onglet Caisse, et la pose de vernis offerte se fait en fin de prestation.",
        ],
      },
      {
        h2: "Où poser le QR code dans un institut de beauté",
        answer:
          "Sur le comptoir d'accueil, au moment du règlement. Un rappel en salle d'attente ou dans la cabine fonctionne aussi, à condition de rester discret.",
        list: [
          "Le chevalet à côté du terminal de paiement, aux couleurs et avec le logo de votre institut.",
          "Un petit flyer dans la salle d'attente, pour les clientes qui patientent avant leur soin.",
          "Une carte posée près du miroir de la cabine, à regarder une fois le soin terminé.",
        ],
        p: [
          "Gardez l'ambiance calme de l'institut : un seul support visible par espace suffit. D'autres pistes dans notre article [où placer un QR code](/blog/qr-code-commerce-emplacement).",
        ],
      },
      {
        h2: "Fixer le coût des cadeaux en institut",
        answer:
          "Les meilleurs lots d'institut coûtent surtout quelques minutes de votre temps. Vous réglez coût et chance de chaque lot, Rouelia vous donne le coût moyen d'une partie.",
        p: [
          "Exemple de calcul, à titre indicatif : votre roue mélange des échantillons, des poses de vernis et des massages des mains, avec une réduction plus forte réservée à de rares gagnantes. Si le coût moyen d'une partie est d'environ 2,50 € et que 30 clientes jouent dans le mois, vous consacrez à peu près 75 € de cadeaux sur le mois.",
          "Avec un panier moyen d'institut souvent plus élevé qu'en commerce alimentaire, une seule cliente qui revient au lieu de partir peut déjà représenter plus que ce budget. C'est un raisonnement à faire avec vos propres chiffres, pas une promesse. Les packs sont détaillés sur la page [tarifs](/tarifs), et le pack Premium permet de programmer une roue dédiée à vos heures creuses.",
        ],
      },
      {
        h2: "Conformité : le cadeau ne dépend pas d'un avis",
        answer:
          "Votre cliente gagne son cadeau en jouant, sans aucune condition. Elle peut ensuite, si elle le veut, partager son avis sur Google.",
        p: [
          "La proposition est neutre et facultative, sans tri selon la note. Le jeu est gratuit, sans obligation d'achat, et votre institut dispose de son règlement et de sa page données. Plus d'informations sur la page [utilisation responsable](/utilisation-responsable).",
        ],
      },
    ],
    prizes: [
      { name: "Échantillon de soin", note: "Le lot fréquent qui fait tester une gamme que vous vendez en cabine." },
      { name: "Pose de vernis offerte", note: "Quelques minutes en fin de prestation, et la cliente repart avec les mains soignées." },
      { name: "Massage des mains", note: "Un moment de détente apprécié, qui coûte surtout du temps." },
      { name: "Sourcils offerts", note: "Un soin rapide qui donne envie de revenir pour une prestation plus complète." },
      { name: "Gommage offert", note: "Un lot plus généreux, parfait en complément d'un soin du corps." },
      { name: "-15 % sur un soin", note: "Le gros lot, avec une chance faible, qui peut faire essayer un soin visage." },
    ],
    faq: [
      {
        q: "Mes soins sont espacés de plusieurs semaines, comment régler la date limite ?",
        a: "La date limite est de 30 jours par défaut et vous pouvez l'allonger. Choisissez une durée qui couvre au moins l'intervalle habituel entre deux rendez-vous.",
      },
      {
        q: "Le jeu convient-il à un institut haut de gamme ?",
        a: "Oui, la roue reprend vos couleurs et votre logo. Avec le pack Premium, la mention « Propulsé par Rouelia » disparaît.",
      },
      {
        q: "Puis-je utiliser la roue pour remplir mes créneaux creux ?",
        a: "Avec le pack Premium, vous programmez une roue dédiée aux heures creuses, sur les jours et les heures de votre choix (par exemple en semaine, de 14 h à 17 h). Les clientes qui jouent à ces moments-là tournent cette roue, avec les lots que vous lui avez choisis ; le reste du temps, c'est votre roue habituelle.",
      },
      {
        q: "Mes clientes doivent-elles installer une application ?",
        a: "Non, tout se passe dans le navigateur du téléphone après le scan du QR code. Pour voir le parcours en détail, consultez la [FAQ](/faq).",
      },
    ],
    cta:
      "Essayez la roue dans votre institut pendant 14 jours, sans carte bancaire. Vous préférez en parler ? [Prenez rendez-vous](/rendez-vous), ou voyez l'exemple des [salons de coiffure](/jeu-fidelisation-coiffeur).",
  },
  {
    path: "/jeu-fidelisation-boulangerie",
    trade: "boulangerie",
    label: "Boulangeries et pâtisseries",
    title: "Jeu de fidélisation pour boulangerie pâtisserie",
    description:
      "Une roue à cadeaux pour boulangerie ou pâtisserie : croissant, flan ou gâteau offert au prochain passage. Le client scanne un QR code en caisse. Essai gratuit.",
    eyebrow: "Boulangeries et pâtisseries",
    h1: "Un jeu de fidélisation pour votre boulangerie",
    lead:
      "Vos clients passent souvent, parfois tous les jours, mais ils peuvent aussi changer de boulangerie au gré d'un trajet ou d'un nouveau quartier. Rouelia transforme ce passage quotidien en petit rendez-vous : le client scanne un QR code au comptoir, tourne la roue, gagne un croissant, une part de flan ou une tartelette, et revient le chercher. Des lots à quelques centimes, un effet qui se voit au comptoir.",
    sections: [
      {
        h2: "Pourquoi un client de boulangerie va voir ailleurs",
        answer:
          "Le choix de la boulangerie dépend beaucoup du trajet. Un détour, une file d'attente trop longue ou une nouvelle enseigne sur le chemin suffisent à faire changer d'habitude.",
        p: [
          "La boulangerie vit d'achats fréquents et petits. Le client ne réfléchit pas longtemps : il prend sa baguette là où c'est pratique ce jour-là. Dans les quartiers où deux ou trois boulangeries se partagent la même rue, la différence se joue parfois à peu de chose.",
          "Autre difficulté : beaucoup de clients viennent à des heures différentes selon les jours et ne connaissent pas toujours votre équipe. Un jeu court et sympathique crée une raison de choisir votre comptoir plutôt qu'un autre, sans changer vos prix.",
        ],
      },
      {
        h2: "Comment la roue se joue dans une boulangerie",
        answer:
          "Le client scanne au comptoir en attendant d'être servi ou juste après avoir payé. Son cadeau, souvent une viennoiserie, l'attend lors d'un prochain passage.",
        p: [
          "Ici, le jeu doit rester rapide. Le meilleur moment est la file d'attente : le client a quelques secondes, son téléphone en main, et le chevalet sous les yeux. Il saisit son prénom et son téléphone, coche l'accord, tourne. Toutes les cases gagnent.",
          "Il reçoit un code avec une date limite. Pour éviter que le croissant gagné soit pris tout de suite, vous pouvez fixer un délai avant utilisation : le cadeau sera valable dès le lendemain, par exemple. Au passage suivant, il montre son code et la vendeuse le valide dans l'onglet Caisse, en quelques secondes même en pleine affluence.",
          "Comme vos clients viennent souvent, réglez une période de participation adaptée : une partie par mois et par numéro de téléphone, par exemple, garde le jeu attractif sans le banaliser.",
        ],
      },
      {
        h2: "Où placer le QR code dans une boulangerie",
        answer:
          "Là où les clients attendent : sur le comptoir, devant la vitrine des gâteaux, ou sur la porte d'entrée pour ceux qui patientent dehors le dimanche matin.",
        list: [
          "Le chevalet sur le comptoir, à hauteur des yeux, côté file d'attente.",
          "Un flyer sur la vitrine réfrigérée, là où le regard se pose en choisissant une pâtisserie.",
          "Une affichette sur la porte, utile les jours de forte affluence.",
          "Un flyer glissé avec les commandes de gâteaux, pour les clients des grandes occasions.",
        ],
        p: [
          "Notre article [où placer un QR code en commerce](/blog/qr-code-commerce-emplacement) détaille les bons réflexes de placement.",
        ],
      },
      {
        h2: "Le coût des lots dans une boulangerie",
        answer:
          "Vos produits coûtent peu à fabriquer, ce qui permet une roue très généreuse aux yeux du client. Vous réglez le coût et la chance de chaque lot.",
        p: [
          "Un calcul d'exemple, pour fixer les idées : une roue composée surtout de croissants, pains au chocolat et baguettes, avec un gâteau du dimanche très rare. Si le coût moyen d'une partie tourne autour de 0,50 € et que 300 clients jouent dans le mois, les cadeaux représentent environ 150 € sur le mois.",
          "En boulangerie, le panier est petit mais la fréquence est élevée. Le bon repère est donc le nombre de passages réguliers que vous gardez ou gagnez. Faites le calcul avec vos propres chiffres, Rouelia vous affiche le coût moyen d'une partie et le suivi des retraits pour vérifier. Les packs sont présentés sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Aucun avis demandé en échange du cadeau",
        answer:
          "Le client gagne en jouant, sans condition. Il peut ensuite être invité, de façon neutre et facultative, à donner son avis sur Google.",
        p: [
          "Pas de tri selon la note, pas de cadeau conditionné. Le jeu est gratuit et sans obligation d'achat, avec un règlement et une page données pour votre boulangerie. Tout est expliqué sur la page [utilisation responsable](/utilisation-responsable).",
        ],
      },
    ],
    prizes: [
      { name: "Croissant offert", note: "Le lot fréquent idéal : il coûte quelques centimes et fait toujours plaisir." },
      { name: "Pain au chocolat offert", note: "Une variante appréciée des enfants, et donc des parents qui reviennent avec eux." },
      { name: "Baguette offerte", note: "Le cadeau du quotidien, qui ramène le client pour son achat habituel." },
      { name: "Part de flan offerte", note: "Fait goûter une spécialité maison à ceux qui ne prennent que du pain." },
      { name: "Tartelette offerte", note: "Un lot plus gourmand qui met en valeur votre vitrine de pâtisseries." },
      { name: "Gâteau du dimanche", note: "Le gros lot, avec une chance très faible, qui fait parler de votre boulangerie." },
    ],
    faq: [
      {
        q: "Le jeu ne va-t-il pas allonger la file d'attente ?",
        a: "Le client joue pendant qu'il attend, pas au moment de payer. La validation d'un code en caisse ne prend que quelques secondes.",
      },
      {
        q: "Mes clients viennent tous les jours, peuvent-ils jouer chaque fois ?",
        a: "Non, une participation par numéro de téléphone sur la période que vous fixez, par exemple une fois par mois.",
      },
      {
        q: "Puis-je proposer des lots différents à Noël ou pour la galette ?",
        a: "Oui, vous modifiez la roue quand vous voulez. Le pack Croissance permet de programmer des roues saisonnières à l'avance. Plus d'idées sur le [blog](/blog/fideliser-clients-jeu-en-boutique).",
      },
      {
        q: "Je n'ai pas le temps de m'en occuper entre deux fournées.",
        a: "Choisissez « Créez-la pour moi » sur la page [créer ma roue](/creer-ma-roue), inclus à partir du pack Croissance. À Paris et en petite couronne, l'installation sur place est aussi possible.",
      },
    ],
    cta:
      "Essayez la roue dans votre boulangerie pendant 14 jours, sans carte bancaire. Une question ? [Prenez rendez-vous](/rendez-vous), ou voyez la version pour les [restaurants et pizzerias](/jeu-fidelisation-restaurant).",
  },
];

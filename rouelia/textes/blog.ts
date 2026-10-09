/**
 * Articles du blog Rouelia.
 * Liens internes : [texte](/chemin). Aucune statistique inventée, aucune promesse d'avis.
 */
import type { Article } from "./types";

export const articles: Article[] = [
  {
    slug: "fideliser-clients-jeu-en-boutique",
    path: "/blog/fideliser-clients-jeu-en-boutique",
    date: "2026-10-08",
    updated: "2026-10-08",
    author: "Enzo",
    readingMinutes: 6,
    title: "Fidéliser ses clients avec un jeu en boutique",
    description:
      "Un jeu en boutique bien pensé donne au client une vraie raison de revenir. Lots, coût, présentation au comptoir, cadre légal : la méthode pas à pas.",
    eyebrow: "Fidélisation",
    h1: "Comment fidéliser ses clients avec un jeu en boutique",
    excerpt:
      "Un jeu en boutique fonctionne quand le cadeau se gagne aujourd'hui et s'utilise à la prochaine visite. Voici comment choisir vos lots, maîtriser le coût et présenter le jeu sans forcer.",
    lead:
      "Vous avez déjà des clients. La question est de les revoir plus souvent. Un jeu en boutique, s'il est bien construit, crée une raison simple de revenir : un cadeau gagné aujourd'hui, à utiliser lors de la prochaine visite. Ce guide vous montre comment le mettre en place sans y passer vos soirées, sans brader vos prix et en restant dans les règles.",
    sections: [
      {
        h2: "Pourquoi un jeu fait revenir les clients ?",
        answer:
          "Parce qu'il transforme une visite terminée en rendez-vous suivant : le client repart avec un cadeau qui ne vaut que s'il revient.",
        p: [
          "Une carte de fidélité demande dix passages avant la moindre récompense. Beaucoup de clients la perdent ou l'oublient au fond d'un portefeuille. Un jeu inverse la logique : le plaisir arrive tout de suite, au comptoir, et l'avantage se concrétise au passage suivant. Pour peser le pour et le contre de chaque solution, lisez notre [comparatif entre carte à tampons, appli et roue de fidélité](/comparatif).",
          "Ce petit décalage compte. Le client a gagné quelque chose, il le sait, et il a une date limite pour en profiter. Il a donc un motif concret de pousser votre porte plutôt que celle d'à côté. Vous ne lui demandez rien de plus que de revenir, ce qu'il avait peut-être déjà envie de faire.",
          "Le jeu crée aussi un moment agréable dans la relation. On rit, on commente le résultat, on en parle à la personne qui attend. Ce sont des souvenirs de visite qui restent, bien plus qu'une remise affichée en vitrine.",
        ],
      },
      {
        h2: "Quel type de jeu choisir pour un commerce de quartier ?",
        answer:
          "Un jeu gratuit, rapide, sans application, où chaque participation gagne quelque chose. La roue à cadeaux coche toutes ces cases.",
        p: [
          "Un commerce de quartier n'a pas besoin d'un concours compliqué avec tirage au sort en fin de mois. Ce qui marche, c'est un jeu qui se joue en moins d'une minute, au moment où le client est encore là. Une roue 100 % gagnante répond à ce besoin : chaque case est un cadeau, personne ne repart déçu.",
          "Avec [Rouelia](/), le client scanne un QR code posé sur le comptoir, avec son propre téléphone. Il indique son prénom et son numéro, l'e-mail restant facultatif, coche l'accord et tourne la roue. Il reçoit un code avec une date limite. Lors de sa prochaine visite, il montre ce code en caisse et vous le validez dans votre espace.",
        ],
        list: [
          "Gratuit et sans obligation d'achat, pour rester dans un cadre simple.",
          "Sans application à installer, sinon une partie des clients abandonne.",
          "Toujours gagnant, pour que l'expérience reste positive.",
          "Avec une date limite, pour donner un horizon au retour.",
        ],
      },
      {
        h2: "Comment choisir les lots sans perdre d'argent ?",
        answer:
          "Mélangez des petits lots fréquents qui vous coûtent peu et un ou deux gros lots rares. Le coût moyen d'une partie reste alors faible et prévisible.",
        p: [
          "Le bon lot a une forte valeur perçue pour le client et un coût réel modeste pour vous. Un soin offert pendant une prestation, une boisson avec un repas, une viennoiserie avec une commande : le client voit un cadeau, vous engagez surtout du temps ou une matière première peu chère.",
          "Dans Rouelia, vous réglez chaque lot, sa chance de sortir et son coût pour vous. L'outil affiche le coût moyen d'une partie. Vous voyez donc tout de suite ce que le jeu vous coûte en moyenne, et vous ajustez avant de lancer.",
          "Un exemple de calcul, à adapter à vos chiffres : si une partie vous coûte en moyenne un euro et qu'un client de plus revient chaque semaine grâce au cadeau, il suffit que ce client dépense un peu pour que l'opération soit rentable. Faites le calcul avec votre panier moyen, c'est lui qui décide.",
        ],
        sub: [
          {
            h3: "Des idées de lots par métier",
            p: [
              "Chaque activité a ses lots naturels. Nous avons rassemblé des exemples concrets pour les [coiffeurs et barbiers](/jeu-fidelisation-coiffeur), les [restaurants](/jeu-fidelisation-restaurant), les [instituts de beauté](/jeu-fidelisation-institut-beaute) et les [boulangeries](/jeu-fidelisation-boulangerie). Partez de ces modèles, puis ajustez à ce que vous vendez vraiment.",
            ],
          },
          {
            h3: "Le gros lot : rare mais réel",
            p: [
              "Un gros cadeau attire l'œil sur la roue et donne envie de jouer. Gardez une chance faible pour qu'il pèse peu dans le coût moyen, mais faites en sorte qu'il sorte de temps en temps. Un client qui le gagne en parlera autour de lui.",
            ],
          },
        ],
      },
      {
        h2: "Comment présenter le jeu au comptoir ?",
        answer:
          "Une phrase, au moment de payer, et un support visible. Pas de discours, pas d'insistance.",
        p: [
          "Le meilleur moment est la fin de la visite, quand le client règle ou récupère ses affaires. Il est détendu, il a un peu de temps. Une phrase suffit : « On a un petit jeu, c'est gratuit et c'est toujours gagnant, ça vous tente ? ». Si la réponse est non, on n'insiste pas.",
          "Le support fait le reste. Un chevalet sur le comptoir, un flyer près de la caisse : le client voit le QR code et sait quoi faire. Pour bien choisir l'endroit, lisez notre guide sur [où placer un QR code en commerce](/blog/qr-code-commerce-emplacement).",
          "Impliquez toute l'équipe. Si une seule personne propose le jeu, il tournera seulement pendant ses horaires. Une consigne commune, une phrase répétée, et le jeu devient un réflexe de la maison.",
        ],
      },
      {
        h2: "Quelles règles respecter pour un jeu en boutique ?",
        answer:
          "Un jeu gratuit, sans obligation d'achat, avec un règlement accessible et une information claire sur les données collectées.",
        p: [
          "Le jeu doit rester ouvert sans condition d'achat. Le client joue parce qu'il en a envie, pas parce qu'il a dépensé un certain montant. Rouelia fournit pour chaque commerce un règlement et une page qui explique l'usage des données.",
          "Une seule participation par personne, identifiée par son numéro de téléphone, sur une période que vous choisissez. Cela évite qu'un même client rejoue en boucle et garde le coût sous contrôle.",
          "Enfin, le cadeau ne dépend jamais d'un avis en ligne. C'est un point important, détaillé dans notre article sur [les avis Google conformes](/blog/avis-google-conformes-2026) et sur la page [utilisation responsable](/utilisation-responsable).",
        ],
      },
      {
        h2: "Comment savoir si le jeu fonctionne ?",
        answer:
          "Regardez deux chiffres : le nombre de parties jouées et le nombre de cadeaux retirés en caisse.",
        p: [
          "Les parties jouées vous disent si le jeu est bien proposé. Les retraits vous disent si les clients reviennent pour utiliser leur cadeau. C'est ce second chiffre qui mesure vraiment la fidélisation.",
          "Si beaucoup de cadeaux ne sont jamais retirés, posez-vous quelques questions. La date limite est-elle trop courte pour votre rythme de visite ? Les lots donnent-ils assez envie ? Le client a-t-il bien compris qu'il doit revenir ? Un rappel par e-mail avant la date limite, inclus dans le pack Croissance, aide à ne pas laisser un cadeau se perdre. Les détails sont sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Les erreurs qui font échouer un jeu en boutique",
        answer:
          "Un QR code caché, des lots sans intérêt, une date limite mal réglée et un jeu que personne ne propose.",
        list: [
          "Poser le support derrière la caisse, hors de la vue du client.",
          "Choisir des lots que personne ne veut, juste parce qu'ils ne coûtent rien.",
          "Régler une date limite plus courte que le délai normal entre deux visites.",
          "Laisser le jeu tourner tout seul, sans jamais le mentionner.",
          "Changer les règles en cours de route sans mettre à jour le règlement.",
        ],
        p: [
          "La bonne nouvelle : chacune de ces erreurs se corrige en quelques minutes. Commencez simple, observez deux ou trois semaines, puis ajustez.",
        ],
      },
    ],
    faq: [
      {
        q: "Un jeu en boutique remplace-t-il une carte de fidélité ?",
        a: "Il peut la compléter ou la remplacer. La différence tient au rythme : la carte récompense après plusieurs visites, le jeu donne un cadeau tout de suite, à utiliser à la visite suivante. Beaucoup de commerçants trouvent ce fonctionnement plus simple à faire vivre.",
      },
      {
        q: "Combien de temps faut-il pour lancer une roue ?",
        a: "Une roue Rouelia est prête en 5 minutes environ, avec des modèles de lots par métier. Si vous préférez, le service « Créez-la pour moi », inclus à partir du pack Croissance, s'en charge et vous envoie le QR code sous 24 à 48 h. Vous pouvez commencer depuis la page [créer ma roue](/creer-ma-roue).",
      },
      {
        q: "Le client doit-il télécharger une application ?",
        a: "Non. Il scanne le QR code avec l'appareil photo de son téléphone et joue dans son navigateur. Rien à installer.",
      },
      {
        q: "Puis-je tester avant de payer ?",
        a: "Oui, l'essai est gratuit pendant 14 jours, sans carte bancaire. Les packs sont ensuite sans engagement, voir la page [tarifs](/tarifs).",
      },
    ],
  },
  {
    slug: "avis-google-conformes-2026",
    path: "/blog/avis-google-conformes-2026",
    date: "2026-10-08",
    updated: "2026-10-08",
    author: "Enzo",
    readingMinutes: 5,
    title: "Avis Google conformes en 2026 : les règles à suivre",
    description:
      "Contreparties interdites, tri des clients, faux avis : ce que disent les règles de Google et le droit français, et comment demander des avis proprement.",
    eyebrow: "Avis en ligne",
    h1: "Comment obtenir des avis Google de façon conforme en 2026",
    excerpt:
      "Offrir un cadeau contre un avis ou ne solliciter que les clients contents est contraire aux règles de Google et peut poser problème en droit français. Voici ce qu'il faut savoir et les bonnes pratiques pour demander des avis proprement.",
    lead:
      "Les avis Google comptent pour un commerce de quartier : beaucoup de clients les lisent avant de venir. La tentation est grande d'accélérer les choses avec une petite récompense ou en ne sollicitant que les clients ravis. Ce sont justement les deux pratiques à éviter. Voici les règles à connaître, ce qu'elles impliquent au quotidien et la façon de demander des avis sans prendre de risque. Cet article ne constitue pas un conseil juridique.",
    sections: [
      {
        h2: "Peut-on offrir un cadeau en échange d'un avis Google ?",
        answer:
          "Non. Les règles de Google sur les contenus publiés dans Maps interdisent d'offrir une contrepartie, comme une réduction, un produit ou un service gratuit, en échange d'un avis.",
        p: [
          "Le règlement de Google relatif aux contenus des utilisateurs dans Maps range ces pratiques dans le faux engagement. Une contrepartie offerte pour publier un avis, pour le modifier ou pour retirer un avis négatif est visée. Peu importe que l'avis demandé soit positif, neutre ou négatif : c'est l'échange lui-même qui pose problème.",
          "Concrètement, des formules comme « un café offert pour votre avis » ou « montrez-nous votre avis et gagnez une remise » sont à proscrire. Google indique pouvoir supprimer les avis concernés et prendre des mesures sur la fiche de l'établissement. Les règles évoluent régulièrement : consultez la version à jour sur les pages d'aide de Google avant toute campagne.",
        ],
      },
      {
        h2: "Pourquoi ne faut-il pas trier les clients avant de demander un avis ?",
        answer:
          "Parce que Google interdit aussi de solliciter de façon sélective les clients satisfaits ou de décourager les avis négatifs. Cette pratique s'appelle le « review gating ».",
        p: [
          "Le principe du tri est simple : on demande d'abord au client s'il est content. S'il répond oui, on l'envoie vers Google. S'il répond non, on le dirige vers un formulaire privé. Le résultat donne une image faussée de l'expérience réelle, et c'est précisément ce que Google veut empêcher.",
          "La règle vaut aussi pour l'équipe. Un employé qui choisit à qui proposer de laisser un avis selon l'humeur du client reproduit le même tri, même sans outil. La consigne doit être la même pour tout le monde : on propose à chacun, ou on ne propose pas.",
        ],
      },
      {
        h2: "Que dit le droit français sur les faux avis ?",
        answer:
          "Publier ou faire publier de faux avis, ou acheter des avis, peut constituer une pratique commerciale trompeuse au sens du Code de la consommation.",
        p: [
          "La directive européenne dite Omnibus de 2019 a renforcé la protection des consommateurs sur ce point. La France l'a transposée par une ordonnance du 22 décembre 2021, entrée en application en 2022. Depuis, le Code de la consommation range parmi les pratiques commerciales réputées trompeuses le fait de publier ou de faire publier de faux avis, ou de déformer des avis à des fins commerciales.",
          "Les sanctions prévues pour les pratiques commerciales trompeuses peuvent être lourdes, et la DGCCRF mène régulièrement des contrôles sur les avis en ligne. Pour un commerçant, la conclusion est simple : pas d'avis écrits par l'équipe ou par des proches, pas d'avis achetés, pas de service qui promet un nombre d'avis.",
        ],
        sub: [
          {
            h3: "L'obligation de transparence sur les avis en ligne",
            p: [
              "L'article L111-7-2 du Code de la consommation impose aux personnes qui collectent, modèrent ou diffusent des avis de consommateurs de délivrer une information loyale, claire et transparente sur la façon dont ces avis sont traités : existence ou non d'un contrôle, date de chaque avis, raisons d'un refus de publication. Si vous affichez des avis clients sur votre propre site, ce texte peut vous concerner. En cas de doute, renseignez-vous sur les sites officiels (Légifrance, economie.gouv.fr) ou auprès d'un professionnel du droit.",
            ],
          },
        ],
      },
      {
        h2: "Quelles sont les bonnes pratiques pour demander des avis ?",
        answer:
          "Demander à tous vos clients, au bon moment, avec un lien direct, répondre à tous les avis, ne jamais trier et ne jamais lier un cadeau à un avis.",
        list: [
          "Demander à tous : chaque client reçoit la même proposition, quelle que soit son humeur apparente.",
          "Choisir le bon moment : juste après la prestation ou le repas, quand l'expérience est fraîche.",
          "Donner un lien direct vers votre fiche, pour éviter au client de chercher.",
          "Répondre à tous les avis, les bons comme les mauvais, avec le même soin.",
          "Ne jamais trier les clients avant de leur proposer de laisser un avis.",
          "Ne jamais conditionner un cadeau, une remise ou un avantage à un avis.",
        ],
        p: [
          "Ces pratiques paraissent modestes. Elles ont un avantage durable : les avis que vous obtenez reflètent votre vrai travail, et personne ne peut vous les reprocher. Pour bien répondre, appuyez-vous sur nos [modèles de réponse à un avis négatif](/blog/repondre-avis-negatif-modeles).",
        ],
      },
      {
        h2: "Comment Rouelia s'y prend-il ?",
        answer:
          "Le cadeau vient d'abord et il est acquis. Ensuite seulement, une invitation neutre et facultative à partager son avis peut être proposée, à tous, sans tri.",
        p: [
          "Sur une roue Rouelia, le client joue, gagne son cadeau et reçoit son code. Ce cadeau est déjà à lui. Il ne dépend d'aucune action ultérieure. Après le jeu, le client peut voir une invitation à partager son avis sur Google. Il est libre de l'ignorer, et cela ne change rien à son cadeau.",
          "L'invitation est la même pour tout le monde. Rouelia ne demande pas de note avant, ne filtre pas les clients mécontents et ne redirige personne vers un formulaire privé. Nous ne promettons aucun nombre d'avis : ce n'est pas l'objet du jeu, qui sert à faire revenir vos clients. Pour comprendre le fonctionnement du jeu lui-même, lisez [comment fidéliser avec un jeu en boutique](/blog/fideliser-clients-jeu-en-boutique).",
          "Nous détaillons nos choix sur la page [utilisation responsable](/utilisation-responsable). Si vous voulez aller plus loin sur votre fiche, le pack Premium inclut un audit de la fiche Google, voir les [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Que faire si vous avez déjà enfreint ces règles ?",
        answer:
          "Arrêtez la pratique tout de suite, retirez les supports concernés et repartez sur une sollicitation neutre.",
        p: [
          "Beaucoup de commerçants ont affiché un jour « un avis, un cadeau » sans connaître les règles. Le plus important est de cesser : retirez l'affiche, changez la phrase dite au comptoir, prévenez l'équipe. Ne publiez pas d'avis de rattrapage et ne demandez pas à des proches d'en écrire.",
          "Ensuite, appliquez les bonnes pratiques ci-dessus. Si vous avez un doute sur votre situation, un professionnel du droit saura vous répondre précisément. Rappel : cet article ne constitue pas un conseil juridique.",
        ],
      },
    ],
    faq: [
      {
        q: "Puis-je organiser un jeu-concours et parler des avis Google en même temps ?",
        a: "Oui, à condition que la participation et le gain ne dépendent en rien d'un avis. Le jeu doit être ouvert à tous, et l'éventuelle invitation à laisser un avis doit rester neutre, facultative et proposée à chacun.",
      },
      {
        q: "Est-ce que demander un avis par écrit sur le ticket est autorisé ?",
        a: "Une invitation neutre, adressée à tous les clients, sans contrepartie, correspond aux bonnes pratiques. Évitez toute formule qui laisserait croire à une récompense.",
      },
      {
        q: "Puis-je supprimer un avis négatif injuste ?",
        a: "Vous ne pouvez pas le supprimer vous-même. Si l'avis enfreint les règles de Google, par exemple s'il est faux ou injurieux, vous pouvez le signaler depuis votre fiche. Dans tous les cas, une réponse calme et factuelle reste utile pour les lecteurs.",
      },
      {
        q: "Rouelia garantit-il des avis ?",
        a: "Non, et ce n'est pas son but. Rouelia est un jeu de fidélisation : le cadeau ne dépend jamais d'un avis, et aucun tri n'est fait selon la satisfaction du client.",
      },
    ],
  },
  {
    slug: "repondre-avis-negatif-modeles",
    path: "/blog/repondre-avis-negatif-modeles",
    date: "2026-10-08",
    updated: "2026-10-08",
    author: "Enzo",
    readingMinutes: 5,
    title: "Répondre à un avis négatif : méthode et modèles",
    description:
      "Une méthode en cinq étapes et des modèles prêts à adapter pour répondre à un avis négatif : attente, prix, erreur de service, avis injuste, produit décevant.",
    eyebrow: "Avis en ligne",
    h1: "Répondre à un avis négatif : modèles",
    excerpt:
      "Un avis négatif bien traité rassure les futurs clients plus qu'il ne les fait fuir. Voici une méthode simple et cinq modèles de réponse à adapter à votre commerce.",
    lead:
      "Un avis négatif fait toujours un pincement. Pourtant, la réponse que vous publiez est lue par tous les clients qui hésitent à venir. Elle montre comment vous traitez un problème. Voici une méthode en cinq étapes, puis des modèles prêts à adapter aux situations les plus fréquentes dans un commerce de quartier.",
    sections: [
      {
        h2: "Faut-il répondre à tous les avis négatifs ?",
        answer:
          "Oui. Une réponse calme montre aux futurs clients que vous écoutez, même quand le reproche est injuste.",
        p: [
          "Ne pas répondre laisse le dernier mot à l'avis. Répondre avec colère laisse une impression pire encore. Une réponse posée, courte et concrète, rééquilibre la lecture : le lecteur voit les deux versions et juge sur pièces.",
          "Répondez aussi aux avis positifs. Cela montre que vous lisez tout, et vos réponses aux critiques paraissent alors naturelles, pas défensives.",
        ],
      },
      {
        h2: "Quelle méthode suivre pour répondre ?",
        answer:
          "Attendre d'être calme, remercier, reconnaître le point précis, expliquer ou corriger, puis proposer un contact direct.",
        list: [
          "Attendre quelques heures si l'avis vous a touché. On écrit mieux à froid.",
          "Remercier la personne d'avoir pris le temps d'écrire, sans ironie.",
          "Reprendre le point précis du reproche, pour montrer que vous avez lu.",
          "Expliquer brièvement ou dire ce que vous changez, sans vous justifier longuement.",
          "Proposer de poursuivre en direct, par téléphone ou par e-mail, et signer de votre prénom.",
        ],
        p: [
          "Évitez les détails personnels sur le client, les accusations et les réponses copiées à l'identique sous chaque avis. Chaque réponse doit sonner comme écrite par vous, pour cette personne.",
        ],
      },
      {
        h2: "Cinq modèles de réponse à adapter",
        answer:
          "Ces modèles couvrent les cas les plus courants. Remplacez les éléments entre crochets et ajustez le ton à votre maison.",
        sub: [
          {
            h3: "Modèle 1 : le client a trop attendu",
            p: [
              "« Bonjour [prénom], merci pour votre retour. Vous avez raison, l'attente de samedi était trop longue et nous ne vous avons pas assez tenu informé. Nous revoyons l'organisation des créneaux du week-end pour que cela ne se reproduise pas. Si vous nous laissez une seconde chance, dites-le-nous en passant, nous serons ravis de vous accueillir dans de meilleures conditions. [Votre prénom] »",
            ],
          },
          {
            h3: "Modèle 2 : le client trouve le prix trop élevé",
            p: [
              "« Bonjour [prénom], merci d'avoir pris le temps de nous écrire. Nos tarifs tiennent compte de [produits utilisés, temps passé, fait maison] et nous comprenons qu'ils ne conviennent pas à tout le monde. Nous affichons nos prix [en vitrine, sur notre carte] pour que chacun puisse choisir en connaissance de cause. N'hésitez pas à nous demander conseil la prochaine fois, nous pouvons vous orienter vers une formule plus adaptée. [Votre prénom] »",
            ],
          },
          {
            h3: "Modèle 3 : une erreur de service",
            p: [
              "« Bonjour [prénom], nous sommes désolés pour [l'erreur précise]. Ce n'est pas le service que nous voulons offrir et nous en avons parlé avec l'équipe. Pouvez-vous nous contacter au [téléphone] ou à [e-mail] ? Nous aimerions corriger les choses avec vous directement. [Votre prénom] »",
            ],
          },
          {
            h3: "Modèle 4 : un avis injuste ou que vous pensez faux",
            p: [
              "« Bonjour, merci pour ce message. Nous ne retrouvons pas de trace de votre passage à la date indiquée et la situation décrite ne correspond pas à notre fonctionnement habituel. Si vous êtes bien venu chez nous, nous serions heureux d'en parler directement au [téléphone] pour comprendre ce qui s'est passé. [Votre prénom] »",
              "Restez factuel et n'accusez personne. Si l'avis enfreint clairement les règles de Google, signalez-le en plus depuis votre fiche.",
            ],
          },
          {
            h3: "Modèle 5 : le client est déçu par un produit",
            p: [
              "« Bonjour [prénom], merci pour votre franchise. Nous sommes désolés que [le produit] ne vous ait pas plu. Nous prenons votre remarque sur [goût, tenue, texture] au sérieux et nous en avons parlé en cuisine [ou à l'atelier]. Repassez nous voir, nous vous conseillerons volontiers une autre option. [Votre prénom] »",
            ],
          },
        ],
      },
      {
        h2: "Que ne faut-il jamais écrire ?",
        answer:
          "Pas d'attaque, pas d'information privée sur le client et pas de proposition de cadeau contre la modification de l'avis.",
        list: [
          "« Vous mentez » ou toute accusation directe.",
          "Des détails sur ce que le client a commandé ou dit, s'il ne les a pas lui-même publiés.",
          "Une offre de remise ou de cadeau en échange du retrait ou de la modification de l'avis.",
          "Une réponse identique collée sous tous les avis.",
        ],
        p: [
          "Le troisième point est important : proposer une contrepartie pour changer un avis est contraire aux règles de Google. Nous l'expliquons dans notre article sur [les avis Google conformes](/blog/avis-google-conformes-2026).",
        ],
      },
      {
        h2: "Comment gagner du temps sans perdre en qualité ?",
        answer:
          "Gardez vos modèles sous la main et faites-vous aider pour le premier jet, mais relisez toujours avant de publier.",
        p: [
          "Rédiger chaque réponse de zéro prend du temps quand on gère une boutique. Les modèles ci-dessus servent de base. L'aide à la réponse aux avis par IA de Rouelia, incluse dans les packs Croissance (30 réponses par mois) et Premium (sans limite), propose un brouillon adapté à chaque avis. Vous le relisez, vous le corrigez, et c'est vous qui publiez : rien n'est publié automatiquement.",
          "Cette relecture n'est pas une formalité. Vous seul savez ce qui s'est vraiment passé ce jour-là. Comparez les packs sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Et après la réponse ?",
        answer:
          "Corrigez ce qui doit l'être, et donnez à vos clients des raisons de revenir.",
        p: [
          "Un avis négatif signale parfois un vrai problème : un créneau surchargé, une explication de prix qui manque, un produit à revoir. Notez les reproches qui reviennent et traitez-les en équipe.",
          "Pour le reste, la meilleure réponse reste une clientèle qui revient. Un [jeu en boutique](/blog/fideliser-clients-jeu-en-boutique) donne un cadeau à utiliser lors de la visite suivante, une occasion de montrer votre meilleur visage. Vous pouvez [créer votre roue](/creer-ma-roue) en quelques minutes.",
        ],
      },
    ],
    faq: [
      {
        q: "En combien de temps faut-il répondre à un avis négatif ?",
        a: "Dans les jours qui suivent, idéalement. Mieux vaut une réponse calme le lendemain qu'une réponse énervée dans l'heure.",
      },
      {
        q: "Faut-il s'excuser même si l'on pense avoir raison ?",
        a: "Vous pouvez regretter que l'expérience n'ait pas été bonne sans reconnaître une faute. « Nous sommes désolés que votre visite vous ait déçu » est une formule qui reste juste dans les deux cas.",
      },
      {
        q: "L'aide IA de Rouelia publie-t-elle les réponses à ma place ?",
        a: "Non. Elle propose un brouillon que vous relisez et modifiez. La publication reste toujours votre décision.",
      },
      {
        q: "Puis-je proposer un geste commercial dans ma réponse ?",
        a: "Vous pouvez inviter le client à revenir ou à vous contacter pour régler le problème. En revanche, ne liez jamais un geste au retrait ou à la modification de son avis.",
      },
    ],
  },
  {
    slug: "qr-code-commerce-emplacement",
    path: "/blog/qr-code-commerce-emplacement",
    date: "2026-10-08",
    updated: "2026-10-08",
    author: "Enzo",
    readingMinutes: 5,
    title: "QR code en commerce : où le placer pour qu'il serve",
    description:
      "Comptoir, caisse, table, vitrine, ticket, miroir : où placer votre QR code en boutique, à quelle taille, avec quelle phrase et quelles erreurs éviter.",
    eyebrow: "Conseils pratiques",
    h1: "QR code en commerce : où le placer",
    excerpt:
      "Un QR code n'est utile que si le client le voit au moment où il a le temps de le scanner. Voici les meilleurs emplacements, la bonne taille et les erreurs à éviter.",
    lead:
      "Vous avez votre QR code. Reste à le poser au bon endroit. Un QR code mal placé ne sera presque jamais scanné, même si ce qu'il propose est intéressant. La règle de base est simple : il doit être visible, lisible et accessible au moment où le client a un temps mort. Voici comment appliquer cette règle dans votre commerce.",
    sections: [
      {
        h2: "Quel est le meilleur endroit pour un QR code en boutique ?",
        answer:
          "Le comptoir, à hauteur des yeux et à portée de main, là où le client attend ou paie.",
        p: [
          "Le client scanne quand il a quelques secondes devant lui et son téléphone en main. Ce moment arrive presque toujours au comptoir : pendant qu'on prépare sa commande, qu'on imprime sa note ou que le terminal de paiement se connecte. Un chevalet posé à cet endroit est vu par chaque client, sans effort.",
          "Ensuite, chaque métier a ses temps morts propres. Repérez-les, et posez un second support à cet endroit.",
        ],
      },
      {
        h2: "Les emplacements à tester selon votre commerce",
        answer:
          "Comptoir, caisse, table, vitrine, ticket, miroir et sac : chacun correspond à un moment différent de la visite.",
        sub: [
          {
            h3: "Le comptoir et la caisse",
            p: [
              "C'est l'emplacement de base, valable pour tous les métiers. Placez le chevalet face au client, pas tourné vers vous, et à côté du terminal de paiement plutôt que derrière la caisse. Laissez-le seul : un comptoir encombré de flyers le rend invisible.",
            ],
          },
          {
            h3: "La table",
            p: [
              "Au restaurant, à la pizzeria ou au bar, l'attente entre la commande et le plat est le moment idéal. Un petit chevalet par table ou un QR code sur le porte-menu fonctionne bien. Voir nos conseils pour les [restaurants](/jeu-fidelisation-restaurant).",
            ],
          },
          {
            h3: "Le miroir",
            p: [
              "Chez le coiffeur, le barbier ou en institut, le client passe de longues minutes face au miroir. Un support discret dans un coin du miroir ou sur la tablette attire le regard sans gêner la prestation. Nos exemples pour les [coiffeurs](/jeu-fidelisation-coiffeur) et les [instituts de beauté](/jeu-fidelisation-institut-beaute) détaillent cette approche.",
            ],
          },
          {
            h3: "La vitrine",
            p: [
              "Un QR code en vitrine peut intriguer les passants, mais il est scanné moins facilement : reflets, distance, client pressé. Réservez-le à un rôle d'appel, avec une affiche lisible de loin, et gardez le support principal à l'intérieur.",
            ],
          },
          {
            h3: "Le ticket et le sac",
            p: [
              "Un QR code imprimé sur le ticket ou glissé dans le sac part avec le client. Il touche ceux qui n'ont pas eu le temps sur place. C'est utile en boulangerie, où le passage est rapide : voir nos idées pour les [boulangeries](/jeu-fidelisation-boulangerie). Gardez-le comme complément, car une fois dehors, le client a souvent autre chose en tête.",
            ],
          },
        ],
      },
      {
        h2: "Quelle taille et quelle lisibilité ?",
        answer:
          "Assez grand pour être scanné sans se pencher, avec un bon contraste et une marge blanche autour.",
        p: [
          "Un QR code trop petit oblige le client à approcher son téléphone de très près, et beaucoup renoncent. Sur un chevalet de comptoir, visez un code qui se scanne facilement à une distance de bras. Pour une vitrine, il faut nettement plus grand, puisque le client est plus loin.",
          "Gardez un code foncé sur fond clair. Les inversions de couleur ou les fonds chargés gênent certains téléphones. Laissez une marge vide tout autour du code, ne le coupez pas et ne posez rien dessus. Une surface mate évite les reflets.",
        ],
      },
      {
        h2: "Quelle phrase écrire à côté du QR code ?",
        answer:
          "Une phrase courte qui dit ce que le client gagne et combien de temps cela prend.",
        p: [
          "Un QR code seul n'explique rien. Le client doit comprendre en une seconde ce qui l'attend. Une accroche efficace répond à trois questions : qu'est-ce que je gagne, est-ce que c'est gratuit, est-ce que c'est rapide.",
        ],
        list: [
          "« Tournez la roue : un cadeau à chaque fois, à utiliser lors de votre prochaine visite. »",
          "« Jeu gratuit, 100 % gagnant. Scannez avec votre appareil photo. »",
          "« Un cadeau vous attend. Une minute, sans application. »",
        ],
      },
      {
        h2: "L'éclairage change-t-il quelque chose ?",
        answer:
          "Oui. Un code dans l'ombre ou sous un reflet se lit mal, surtout avec les téléphones les plus anciens.",
        p: [
          "Regardez votre support à différentes heures de la journée. Un spot qui crée un reflet sur une plastification brillante, un contre-jour devant la vitrine, un coin sombre du comptoir : chacun de ces cas peut faire échouer le scan. Déplacez le support de quelques centimètres, ou choisissez une impression mate.",
        ],
      },
      {
        h2: "Comment tester votre QR code avant de l'installer ?",
        answer:
          "Scannez-le vous-même avec plusieurs téléphones, depuis la place du client, et allez jusqu'au bout du parcours.",
        p: [
          "Mettez-vous du côté client, à la distance réelle, avec la lumière réelle. Essayez avec votre téléphone, celui d'un collègue et si possible un modèle plus ancien. Vérifiez que la page s'ouvre vite et que vous pouvez jouer jusqu'à la fin.",
          "Avec Rouelia, le QR code, le flyer et le chevalet à imprimer sont fournis dès le pack Essentiel. Le pack Premium inclut un chevalet offert. Les détails sont sur la page [tarifs](/tarifs).",
        ],
      },
      {
        h2: "Les erreurs à éviter",
        answer:
          "Un QR code caché, trop petit, sans explication ou qui mène vers une page qui ne fonctionne pas.",
        list: [
          "Le poser derrière la caisse, du côté du commerçant.",
          "L'imprimer en tout petit pour « ne pas encombrer ».",
          "Le laisser sans phrase d'accroche.",
          "Le noyer au milieu de cinq autres affiches.",
          "Ne jamais le tester après impression.",
          "Ne jamais le mentionner à voix haute : une phrase de l'équipe reste le meilleur déclencheur.",
        ],
        p: [
          "Un bon emplacement ne remplace pas une bonne proposition. Pour que le scan mène à quelque chose d'utile, lisez [comment fidéliser avec un jeu en boutique](/blog/fideliser-clients-jeu-en-boutique), puis [créez votre roue](/creer-ma-roue).",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de QR codes faut-il dans un commerce ?",
        a: "Un support principal au comptoir suffit pour commencer. Ajoutez-en un second là où vos clients attendent le plus longtemps, à table ou au miroir par exemple.",
      },
      {
        q: "Le client a-t-il besoin d'une application pour scanner ?",
        a: "Non, l'appareil photo de la plupart des téléphones récents lit les QR codes directement. Le jeu Rouelia s'ouvre ensuite dans le navigateur, sans rien installer.",
      },
      {
        q: "Puis-je faire installer le support par quelqu'un ?",
        a: "À Paris et en petite couronne, Rouelia propose une installation sur place à 49 € (79 € si le déplacement est fait uniquement pour vous). La mise en route en ligne est gratuite. Vous pouvez aussi [prendre rendez-vous](/rendez-vous) pour en parler.",
      },
      {
        q: "Que faire si personne ne scanne le QR code ?",
        a: "Vérifiez d'abord qu'il est visible depuis la place du client, bien éclairé et accompagné d'une phrase claire. Ensuite, demandez à l'équipe de le mentionner au moment de payer : c'est souvent ce qui fait la différence.",
      },
    ],
  },
];

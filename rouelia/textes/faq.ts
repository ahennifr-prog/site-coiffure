import type { Faq, SeoPage } from "./types";

/** Page /faq : questions fréquentes des commerçants, regroupées par thème. */
export const faqPage: Omit<SeoPage, "sections" | "faq"> & { groups: { title: string; items: Faq[] }[] } = {
  path: "/faq",
  title: "Questions fréquentes sur la roue à cadeaux en boutique",
  description:
    "Prix, mise en place, règlement, avis Google, données des clients : les réponses claires aux questions que se posent les commerçants avant d'installer leur roue.",
  eyebrow: "Questions fréquentes",
  h1: "Vos questions sur Rouelia, nos réponses franches",
  lead:
    "Vous tenez un salon, un restaurant ou une boutique et vous hésitez encore ? Voici les questions que les commerçants nous posent le plus souvent, avec des réponses courtes. S'il en manque une, écrivez à contact@rouelia.fr.",
  groups: [
    {
      title: "Le jeu et vos clients",
      items: [
        {
          q: "Comment fidéliser ses clients avec un jeu en boutique ?",
          a: "En offrant un cadeau à utiliser lors de la prochaine visite. Le client tourne la roue aujourd'hui, gagne à coup sûr, et repart avec une bonne raison de revenir avant la date limite. C'est ce retour qui compte, plus que le jeu lui-même. Nous détaillons la méthode dans notre guide [fidéliser ses clients avec un jeu en boutique](/blog/fideliser-clients-jeu-en-boutique).",
        },
        {
          q: "Comment se passe une partie pour le client ?",
          a: "Il scanne un QR code posé sur le comptoir et joue depuis son téléphone. Il indique son prénom et son numéro, coche l'accord, puis tourne la roue. Chaque case est un cadeau, il reçoit donc toujours un code, avec une date limite de 30 jours par défaut.",
        },
        {
          q: "Un client peut-il jouer plusieurs fois ?",
          a: "Non, pas sur la période que vous choisissez. La participation est limitée à une par numéro de téléphone. Vous réglez vous-même cette période, par exemple un mois ou une saison, selon le rythme de visite de vos clients.",
        },
        {
          q: "Quand le client utilise-t-il son cadeau ?",
          a: "Lors de sa prochaine visite. Il montre son code en caisse et vous le validez dans votre espace, onglet Caisse. Vous pouvez aussi prévoir un délai avant utilisation, pour que le cadeau serve vraiment à faire revenir et non à repartir avec tout de suite.",
        },
      ],
    },
    {
      title: "Mise en place",
      items: [
        {
          q: "Faut-il une application ?",
          a: "Non, ni pour vous ni pour vos clients. Le client joue dans le navigateur de son téléphone après avoir scanné le QR code. Vous gérez tout depuis votre espace en ligne, sur ordinateur ou sur téléphone.",
        },
        {
          q: "Combien de temps faut-il pour démarrer ?",
          a: "Environ cinq minutes. Vous choisissez votre métier, Rouelia vous propose des modèles de lots, vous ajustez, puis vous imprimez le flyer ou le chevalet avec votre QR code. Pour bien le placer, lisez nos conseils sur [l'emplacement du QR code](/blog/qr-code-commerce-emplacement).",
        },
        {
          q: "Pouvez-vous créer la roue pour moi ?",
          a: "Oui. Avec le service « Créez-la pour moi », vous nous envoyez vos informations (lots, couleurs, logo) et nous préparons la roue. Vous recevez votre QR code sous 24 à 48 heures. Tout commence sur la page [créer ma roue](/creer-ma-roue).",
        },
        {
          q: "Proposez-vous une installation sur place ?",
          a: "Oui, à Paris et en petite couronne. L'installation sur place coûte 49 €, ou 79 € si le déplacement est fait uniquement pour vous. Partout ailleurs, la mise en route se fait en ligne, gratuitement, et vous pouvez [prendre rendez-vous](/rendez-vous) pour un appel.",
        },
        {
          q: "Puis-je mettre mes couleurs et mon logo ?",
          a: "Oui. La roue reprend les couleurs et le logo de votre commerce, pour que le client reconnaisse tout de suite votre enseigne. Avec le pack Premium, la mention « Propulsé par Rouelia » disparaît.",
        },
      ],
    },
    {
      title: "Prix et abonnement",
      items: [
        {
          q: "Combien coûte Rouelia ?",
          a: "De 29 € à 89 € par mois, selon le pack. Essentiel coûte 29 €, Croissance 49 € et Premium 89 €, sans engagement. La TVA n'est pas applicable (article 293 B du CGI). Le détail de chaque pack est sur la page [tarifs](/tarifs).",
        },
        {
          q: "Combien coûtent les cadeaux ?",
          a: "C'est vous qui décidez. Vous fixez chaque lot, sa chance de sortir et son coût pour vous, et Rouelia affiche le coût moyen d'une partie. Par exemple, si la plupart des cases sont de petits cadeaux et qu'un gros lot a une chance faible, le coût moyen reste bas. Un cadeau n'est par ailleurs utilisé que si le client revient.",
        },
        {
          q: "Et après les 14 jours d'essai ?",
          a: "Vous choisissez de continuer ou non. L'essai est gratuit et ne demande pas de carte bancaire, donc rien n'est prélevé automatiquement à la fin. Si la roue vous convient, vous choisissez simplement le pack qui vous correspond.",
        },
        {
          q: "Puis-je arrêter quand je veux ?",
          a: "Oui. Les packs sont sans engagement : vous arrêtez quand vous le souhaitez, et l'abonnement s'arrête à la fin du mois déjà payé. Pas de frais de résiliation, pas de durée minimale.",
        },
      ],
    },
    {
      title: "Avis Google et règles",
      items: [
        {
          q: "Une roue à gagner est-elle autorisée en boutique ?",
          a: "En règle générale oui, si le jeu reste gratuit et sans obligation d'achat, mais chaque commerce reste responsable de son usage. Avec Rouelia, le jeu est gratuit et sans obligation d'achat, chaque commerce dispose de son règlement accessible au client, et le cadeau n'est jamais lié à un avis. Nous expliquons les textes et les bonnes pratiques sur la page [utilisation responsable](/utilisation-responsable). Ce n'est pas un conseil juridique : en cas de doute, demandez l'avis d'un professionnel du droit.",
        },
        {
          q: "Le cadeau dépend-il d'un avis Google ?",
          a: "Non, jamais. Le client a déjà gagné son cadeau quand on lui propose, de façon neutre et facultative, de partager son avis. Il peut refuser, il garde son cadeau. Aucun tri n'est fait selon la note. Pour comprendre pourquoi, lisez notre article sur les [avis Google conformes](/blog/avis-google-conformes-2026).",
        },
        {
          q: "Un règlement du jeu est-il prévu ?",
          a: "Oui, un règlement existe pour chaque commerce. Il est accessible au client depuis le jeu, avec une page qui explique l'usage de ses données. Gardez-le visible et n'ajoutez aucune condition orale qui le contredirait.",
        },
        {
          q: "Comment répondre à un avis négatif ?",
          a: "Calmement, rapidement et sans vous justifier à l'excès. Remerciez, reconnaissez le problème s'il est réel et proposez une solution. Nos [modèles de réponse aux avis négatifs](/blog/repondre-avis-negatif-modeles) vous aident, et les packs Croissance et Premium incluent une aide à la réponse par IA.",
        },
      ],
    },
    {
      title: "Données et sécurité",
      items: [
        {
          q: "Que deviennent les données de mes clients ?",
          a: "Elles servent à faire fonctionner le jeu et le cadeau. Le prénom et le numéro permettent de limiter les participations et de retrouver le code, l'e-mail sert à envoyer le code et un rappel. Une page données propre à votre commerce explique tout cela au client.",
        },
        {
          q: "Quelles informations le client doit-il donner ?",
          a: "Son prénom et son numéro de téléphone, et c'est tout. L'e-mail est facultatif : il sert seulement à recevoir le code et un rappel avant la date limite. Le client coche un accord avant de jouer.",
        },
        {
          q: "Un code cadeau peut-il servir deux fois ?",
          a: "Non. Chaque code est validé par vous en caisse, dans l'onglet Caisse, et le suivi des retraits vous montre les cadeaux déjà remis.",
        },
      ],
    },
  ],
};

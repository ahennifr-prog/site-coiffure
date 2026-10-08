/**
 * Page « Tarifs » : textes autour des cartes des packs (affichées par ailleurs).
 */
import type { SeoPage } from "./types";

export const pricingPage: SeoPage = {
  path: "/tarifs",
  title: "Tarifs Rouelia : roue à cadeaux dès 29 € par mois",
  description:
    "Rouelia coûte 29 €, 49 € ou 89 € par mois selon le pack, sans engagement. Essai gratuit de 14 jours sans carte bancaire, vous décidez du coût de vos cadeaux.",
  eyebrow: "Tarifs",
  h1: "Tarifs Rouelia : un prix fixe, sans engagement",
  lead:
    "Trois packs, un prix mensuel affiché, aucun frais caché. Vous essayez gratuitement pendant 14 jours, puis vous gardez le pack qui correspond à votre commerce, ou vous arrêtez.",
  sections: [
    {
      h2: "Quel pack choisir pour mon commerce ?",
      answer:
        "Prenez Essentiel pour démarrer seul, Croissance pour faire revenir vos clients et animer la roue au fil de l'année, Premium si vous voulez être accompagné chaque mois.",
      sub: [
        {
          h3: "Essentiel, 29 € par mois : pour démarrer seul",
          p: [
            "Vous avez tout pour lancer votre roue : le QR code, le flyer et le chevalet à imprimer, des modèles de lots adaptés à votre métier, les codes cadeaux validés en caisse et le suivi des parties. C'est le bon choix si vous voulez tester l'idée simplement, à votre rythme.",
          ],
        },
        {
          h3: "Croissance, 49 € par mois : pour faire revenir et animer",
          p: [
            "Ce pack ajoute ce qui aide le client à repasser : un rappel par e-mail avant la date limite de son cadeau, des roues saisonnières programmées à l'avance, le parrainage entre clients, et vos liens de réservation, Instagram et Facebook affichés après le jeu. Vous voyez aussi les statistiques par employé et recevez une aide par IA pour répondre à vos avis (30 par mois). Une visio de configuration de 30 minutes est offerte.",
          ],
        },
        {
          h3: "Premium, 89 € par mois : pour être accompagné",
          p: [
            "Vous n'êtes plus seul face à la roue. Nous faisons un point de 15 minutes chaque mois, un audit de votre fiche Google, et nous refaisons votre roue à chaque saison. Vous profitez aussi des lots pour heures creuses, du suivi de la rentabilité, des réponses aux avis par IA sans limite, d'un chevalet offert, d'un support sous 24 h, et la mention « Propulsé par Rouelia » disparaît.",
          ],
        },
      ],
    },
    {
      h2: "Qu'est-ce qui est inclus dans tous les packs ?",
      answer:
        "Chaque pack comprend la roue à vos couleurs, le QR code, le support à imprimer, les codes cadeaux validés en caisse et le suivi de vos parties.",
      list: [
        "Une roue 100 % gagnante avec votre logo et vos couleurs.",
        "Un QR code, un flyer et un chevalet à imprimer pour votre comptoir.",
        "Le code cadeau envoyé par e-mail au client qui l'a demandé.",
        "La validation des cadeaux dans l'onglet Caisse de votre espace.",
        "Des modèles de lots par métier, que vous modifiez librement.",
        "Un règlement de jeu et une page données pour votre commerce.",
        "Le suivi des parties et des cadeaux retirés.",
      ],
    },
    {
      h2: "Comment fonctionne l'essai gratuit de 14 jours ?",
      answer:
        "Vous créez votre roue et l'utilisez avec de vrais clients pendant 14 jours, sans donner de carte bancaire.",
      p: [
        "Votre roue est prête en 5 minutes. Vous imprimez le QR code, vous le posez sur le comptoir, et vos clients peuvent jouer dès aujourd'hui. Pendant l'essai, vous voyez combien de personnes jouent et combien reviennent chercher leur cadeau.",
        "À la fin des 14 jours, vous choisissez un pack si la roue vous plaît. Sinon, vous ne faites rien : aucun prélèvement ne part, puisque vous n'avez jamais donné de carte. Pour commencer, il suffit de [créer votre roue](/creer-ma-roue).",
      ],
    },
    {
      h2: "Combien coûtent les cadeaux de la roue ?",
      answer:
        "C'est vous qui décidez. Vous choisissez chaque lot, sa chance de sortir et son coût, et Rouelia vous affiche le coût moyen d'une partie.",
      p: [
        "Un café offert, un soin de quelques minutes, une remise sur le prochain passage : vous fixez vous-même ce que vous offrez. Vous pouvez prévoir un gros cadeau avec une chance faible, et des petits cadeaux qui sortent plus souvent. Le coût moyen d'une partie s'affiche pendant que vous réglez la roue, pour garder votre budget sous contrôle.",
        "Point important : le cadeau ne coûte quelque chose que si le client revient le chercher. Et quand il revient, il peut en profiter pour acheter autre chose. Nos fiches métier donnent des idées de lots, par exemple pour les [coiffeurs](/jeu-fidelisation-coiffeur) ou les [boulangeries](/jeu-fidelisation-boulangerie).",
      ],
    },
    {
      h2: "Quand l'abonnement est-il remboursé ?",
      answer:
        "Il suffit de quelques clients en plus dans le mois pour couvrir le prix du pack. Faites le calcul avec vos propres chiffres.",
      p: [
        "Voici un calcul d'exemple, pas une promesse. Imaginons un panier moyen de 35 €. Si 2 clients de plus reviennent dans le mois grâce à leur cadeau, cela représente 70 € de chiffre d'affaires, soit plus que les 29 € du pack Essentiel ou les 49 € du pack Croissance. Pensez à retirer le coût de vos cadeaux, que vous connaissez puisque vous le fixez.",
        "Vos vrais chiffres sont dans votre espace : le nombre de cadeaux retirés en caisse vous dit combien de clients sont effectivement revenus. Avec le pack Premium, le suivi de la rentabilité fait ce calcul pour vous.",
      ],
    },
    {
      h2: "Pouvez-vous installer la roue à ma place ?",
      answer:
        "Oui. La mise en route en ligne est gratuite, l'installation sur place coûte 49 € à Paris et en petite couronne, et le service « Créez-la pour moi » crée la roue pour vous.",
      p: [
        "Sur place, nous venons dans votre commerce pour régler la roue et poser le chevalet : 49 €, ou 79 € si le déplacement est fait uniquement pour vous. Vous pouvez [prendre rendez-vous](/rendez-vous) pour fixer un créneau.",
        "Avec « Créez-la pour moi », vous envoyez vos informations (logo, couleurs, cadeaux souhaités) et nous vous renvoyons votre roue et son QR code sous 24 à 48 h. Pour bien placer ensuite votre QR code, lisez notre guide sur [l'emplacement du QR code](/blog/qr-code-commerce-emplacement).",
      ],
    },
    {
      h2: "Puis-je arrêter ou mettre en pause mon abonnement ?",
      answer:
        "Oui, à tout moment. L'abonnement est sans engagement et s'arrête à la fin du mois déjà payé.",
      p: [
        "Pas de préavis, pas de frais de résiliation. Si vous fermez pour congés ou travaux, vous pouvez arrêter votre abonnement puis le reprendre à votre retour. Vous pouvez aussi changer de pack quand votre besoin évolue.",
      ],
    },
    {
      h2: "Les prix sont-ils HT ou TTC ?",
      answer:
        "Les prix affichés sont les prix que vous payez : TVA non applicable, article 293 B du Code général des impôts.",
      p: [
        "Rouelia relève du régime de la franchise en base de TVA. Aucune TVA ne s'ajoute donc aux 29 €, 49 € ou 89 € par mois, et vos factures portent la mention correspondante.",
      ],
    },
  ],
  faq: [
    {
      q: "Y a-t-il des frais de mise en service ?",
      a:
        "Non. La création de la roue et la mise en route en ligne sont gratuites. Seule l'installation sur place, si vous la demandez, est facturée 49 € (79 € si le déplacement est fait uniquement pour vous).",
    },
    {
      q: "Dois-je donner ma carte bancaire pour l'essai ?",
      a:
        "Non. L'essai de 14 jours démarre sans carte bancaire. Vous la donnez seulement si vous décidez de continuer avec un pack.",
    },
    {
      q: "Puis-je changer de pack en cours de route ?",
      a:
        "Oui. Vous pouvez commencer avec Essentiel et passer à Croissance ou Premium quand vous en avez besoin,. Pour toute question sur votre abonnement, écrivez à contact@rouelia.fr ou consultez la [FAQ](/faq).",
    },
    {
      q: "Le prix dépend-il du nombre de parties jouées ?",
      a:
        "Non. Le prix du pack est fixe chaque mois, quel que soit le nombre de clients qui jouent. Seul le coût de vos cadeaux varie, et c'est vous qui le réglez.",
    },
    {
      q: "Est-ce que les réponses aux avis sont incluses dans tous les packs ?",
      a:
        "Non. L'aide à la réponse aux avis par IA est incluse dans Croissance (30 par mois) et sans limite dans Premium. Pour vous inspirer, consultez nos [modèles de réponse aux avis négatifs](/blog/repondre-avis-negatif-modeles).",
    },
  ],
};

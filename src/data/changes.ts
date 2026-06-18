/**
 * Change log entries for the ATESS redesign -- used by /changes presentation page.
 * Source: feedback/CHANGE-PLAN.md (client session with Teo, Banca Transilvania 3 + 4).
 */

export type ChangeStatus = "done" | "partial" | "needs-asset";

export type ChangeEntry = {
  id: string;
  section: string;
  clientAsk: string;
  quote: string;
  timestamp: string;
  whatChanged: string;
  status: ChangeStatus;
  route?: string;
  beforeImage?: string;
  afterImage?: string;
};

export const changes: ChangeEntry[] = [
  // Brand & Pozitionare
  {
    id: "brand-depersonalization",
    section: "Brand & Pozitionare",
    clientAsk:
      "Eliminarea cultului personalitatii -- site-ul sa prezinte compania, nu omul",
    quote:
      "Renuntati la tot cultul personalitatii... nu mai vreau sa vad toate astea cu consultanta. Eu sunt eu in piata si sunt bomba, dar e o companie, e Ates Project. Asta vrem sa prezentam.",
    timestamp: "F3 00:09 / F3 03:21",
    whatChanged:
      "CTA-ul principal a fost redenumit din 'Vorbeste cu Teo' in 'Contacteaza echipa'. Referintele la consultanta personala si la persoana lui Teo au fost eliminate din header, hero si sectiunile de servicii. Blocul fondatorului a ramas exclusiv pe pagina Despre.",
    status: "done",
    route: "/",
    afterImage: "/changes/after/home.png",
  },
  {
    id: "brand-headline",
    section: "Brand & Pozitionare",
    clientAsk:
      "Titlul sa fie 'pardoseli profesionale', nu 'pardoseli sportive'",
    quote:
      "Scoate 'sportive' din titlul principal -- noi facem tot, nu doar sport.",
    timestamp: "F3 07:26",
    whatChanged:
      "Headline-ul principal din sectiunea Hero a paginii de pornire a fost actualizat de la 'pardoseli sportive' la 'pardoseli profesionale', reflectand spectrul complet al serviciilor ATESS.",
    status: "done",
    route: "/",
    afterImage: "/changes/after/home.png",
  },

  // Servicii (IA + mega-menu)
  {
    id: "servicii-ia",
    section: "Servicii (IA + mega-menu)",
    clientAsk:
      "Produsele devin Servicii -- totul sub un singur umbrelu, grupat Interior / Exterior",
    quote:
      "Produsele sunt servicii... e un serviciu, nu pot sa-ti vand doar pardoseala si ti-o trimit acasa.",
    timestamp: "F3 25:14",
    whatChanged:
      "A fost construita o arhitectura completa de servicii cu doua axe principale: Interior (pardoseli sportive indoor, mocheta, covor PVC/linoleum/tapet PVC, LVT) si Exterior (pardoseli sportive outdoor, locuri de joaca, pardoseli de piatra). Fiecare categorie are propriul URL, metadata SEO si continut descriptiv.",
    status: "done",
    route: "/servicii",
    afterImage: "/changes/after/servicii.png",
  },
  {
    id: "servicii-megamenu",
    section: "Servicii (IA + mega-menu)",
    clientAsk:
      "Mega-menu la hover pe Servicii in navigatie, cu categorii si modele 3D",
    quote:
      "Ii place mega-menu-ul de la Tarkett, de la covorpvc.ro -- ceva mare, clar, cu categorii.",
    timestamp: "F4 00:00",
    whatChanged:
      "Navigatia principala include acum un mega-menu activat la hover pe Servicii, care afiseaza toate categoriile grupate pe Interior/Exterior. Modelele 3D miniaturale sunt integrate in mega-menu per categorie, in asteptarea modelelor finale de la Teo.",
    status: "partial",
    route: "/servicii",
    afterImage: "/changes/after/servicii.png",
  },
  {
    id: "servicii-category-pages",
    section: "Servicii (IA + mega-menu)",
    clientAsk:
      "Pagini individuale pentru fiecare categorie de servicii cu text tehnic si fotografii reale",
    quote:
      "Copiati stilul Tarkett pe paginile de categorie -- montaj, intretinere, straturi -- asta rankeaza.",
    timestamp: "F3 21:19",
    whatChanged:
      "Au fost create pagini de categorie dedicate pentru toate cele 7 categorii de servicii. Fiecare pagina contine descriere tehnica, lista straturilor, domenii de aplicare si un CTA. Fotografiile de produs sunt temporar placeholder -- Teo urmeaza sa furnizeze imaginile reale.",
    status: "needs-asset",
    route: "/servicii/interior/pardoseli-sportive-indoor",
    afterImage: "/changes/after/servicii-category.png",
  },

  // Homepage
  {
    id: "home-hero-rotating",
    section: "Homepage",
    clientAsk:
      "Hero rotativ cu context si link-uri -- fiecare imagine directioneaza spre categoria corespunzatoare",
    quote:
      "Cand se schimba poza... te directioneaza catre pardoseli sportive, e un fundal cu povesti.",
    timestamp: "F3 19:54",
    whatChanged:
      "Sectiunea Hero a fost transformata intr-un slideshow rotativ. Fiecare slide afiseaza o imagine de fundal, un text contextual scurt si un buton care trimite direct la categoria de servicii relevanta. Tranzitiile sunt animate si performanta de incarcare a fost pastrata.",
    status: "done",
    route: "/",
    afterImage: "/changes/after/home.png",
  },
  {
    id: "home-producers",
    section: "Homepage",
    clientAsk:
      "Bloc cu producatorii parteneri pe pagina de pornire, Stockmeier cel mai vizibil",
    quote:
      "Aici pe prima pagina sa apara producatorii... il facem un pic mai mare decat restul.",
    timestamp: "F3 15:36",
    whatChanged:
      "A fost adaugata o noua sectiune 'Producatori & parteneri' pe homepage, cu Stockmeier evidentiat ca partener principal. Celelalte marci (Doctor Schutz, Tarkett, Modulyss by Balta, IVC) sunt prezentate in grid. Logo-urile temporare vor fi inlocuite cu active furnizate de Teo.",
    status: "needs-asset",
    route: "/",
    afterImage: "/changes/after/home.png",
  },
  {
    id: "home-invata-preview",
    section: "Homepage",
    clientAsk: "Cateva articole din Invata sa apara pe pagina de pornire",
    quote:
      "Arata cateva articole de Invata pe prima pagina -- oamenii trebuie sa vada ca avem continut.",
    timestamp: "F4 01:53",
    whatChanged:
      "A fost adaugat un modul de previzualizare a articolelor academice pe pagina de pornire, care prezinta ultimele 3 articole din sectiunea Invata, cu titlu, excerpt si link spre articolul complet.",
    status: "done",
    route: "/",
    afterImage: "/changes/after/home.png",
  },

  // 3D Pardoseli
  {
    id: "flooring-3d-move",
    section: "3D Pardoseli",
    clientAsk:
      "Animatia 3D sa plece de pe homepage si sa intre in paginile de Servicii",
    quote:
      "Asta trebuie sa plece din prima pagina... trebuie sa-l folosesc in partea aia de produse.",
    timestamp: "F3 11:39",
    whatChanged:
      "Componenta FlooringSystemClient a fost mutata din pagina de pornire in paginile individuale de categorie din Servicii. Homepage-ul a primit un placeholder vizual in locul animatiei 3D, conform indicatiei lui Teo de a propune o alternativa.",
    status: "done",
    route: "/servicii",
    afterImage: "/changes/after/flooring-3d.png",
  },
  {
    id: "flooring-3d-relabel",
    section: "3D Pardoseli",
    clientAsk:
      "Redenumire din 'Patru straturi' in 'Mai multe straturi. O singura suprafata.'",
    quote:
      "Nu scrie un numar fix de straturi -- nu stii niciodata, depinde de sistem.",
    timestamp: "F4 01:01",
    whatChanged:
      "Titlul sectiunii 3D a fost actualizat din 'Patru straturi. O singura suprafata.' in 'Mai multe straturi. O singura suprafata.', eliminand numarul fix care nu era corect tehnic pentru toate sistemele.",
    status: "done",
    route: "/servicii",
    afterImage: "/changes/after/flooring-3d.png",
  },
  {
    id: "flooring-3d-models",
    section: "3D Pardoseli",
    clientAsk:
      "4-5 modele 3D per categorie cu materiale corecte tehnic (SBR, EPDM, gazon sintetic cu pluta)",
    quote:
      "SBR-ul trebuie sa arate ca SBR, nu ca ceva generic. Si fa modelul cu gazon sintetic si pluta -- primul din Romania.",
    timestamp: "F3 11:00 / F3 12:34",
    whatChanged:
      "Au fost create 5 sisteme 3D parametrizate (sport exterior, sport interior, locuri de joaca, gazon sintetic, covor PVC). Structura straturilor este corecta tehnic pentru fiecare categorie. Texturile PBR finale (SBR, EPDM, gazon) urmeaza sa fie furnizate de Teo din Poly Haven / textures.com.",
    status: "needs-asset",
    route: "/servicii",
    afterImage: "/changes/after/flooring-3d.png",
  },

  // Invata / SEO
  {
    id: "invata-seo",
    section: "Invata / SEO",
    clientAsk:
      "Articolele din Invata sunt motorul SEO -- mai multe articole tehnice, copy detaliat pe categorii",
    quote:
      "Vrem sa rankam pentru covor PVC, pardoseli, pardoseli de pluta... e un joc de 6-12 luni.",
    timestamp: "F3 38:46",
    whatChanged:
      "Sectiunea Invata a fost extinsa cu articole tehnice despre categorii de pardoseli, ghiduri de decizie si fise comparative. Paginile de categorie din Servicii au primit copy descriptiv in stil Tarkett (montaj, intretinere, specificatii). Google Search Console este conectat.",
    status: "partial",
    route: "/invata",
    beforeImage: "/changes/before/invata.png",
    afterImage: "/changes/after/invata.png",
  },

  // Proiecte
  {
    id: "proiecte-reorganize",
    section: "Proiecte",
    clientAsk:
      "Proiecte organizate per proiect, grupate pe categorie, cu detalii per lucrare",
    quote:
      "Vrei sa stii ce am facut acolo, nu doar sa vezi o poza. Competitorii fac asta bine.",
    timestamp: "F3 32:01",
    whatChanged:
      "Galeria de proiecte a fost restructurata cu filtrare pe categorii si o pagina de detaliu per proiect, care prezinta ce s-a executat, suprafata, clientul si fotografii relevante. Fotografiile curate per proiect urmeaza sa fie furnizate de Teo din arhiva sa de 1900+ imagini.",
    status: "needs-asset",
    route: "/proiecte",
    beforeImage: "/changes/before/proiecte.png",
    afterImage: "/changes/after/proiecte.png",
  },
  {
    id: "proiecte-harta",
    section: "Proiecte",
    clientAsk:
      "Harta interactiva a Romaniei -- click pe judet => proiectele din zona respectiva",
    quote:
      "Ar fi tare sa poti da click pe judet si sa vezi ce am facut acolo.",
    timestamp: "F3 26:07",
    whatChanged:
      "A fost construita o vizualizare pe harta Romaniei (RomaniaMAP.svg din repo) cu proiecte indexate pe judete. Click pe un judet afiseaza proiectele executate in zona respectiva. Functionalitatea este pregatita -- datele vor fi completate pe masura ce Teo cureaza fotografiile.",
    status: "partial",
    route: "/proiecte/harta",
    afterImage: "/changes/after/proiecte-harta.png",
  },

  // Despre & Echipa
  {
    id: "despre-directii",
    section: "Despre & Echipa",
    clientAsk:
      "'4 directii' redenumit in 'Directiile noastre' si fiecare card sa aiba link spre Servicii/Proiecte",
    quote:
      "O sa avem mai mult de 4 directii, si fiecare trebuie sa duca undeva -- Servicii, Proiecte.",
    timestamp: "F3 36:40",
    whatChanged:
      "Sectiunea a fost redenumita in 'Directiile noastre' si fiecare card include acum un link spre pagina de Servicii sau Proiecte corespunzatoare. Numarul de directii nu mai este hardcodat.",
    status: "done",
    route: "/despre",
    beforeImage: "/changes/before/despre.png",
    afterImage: "/changes/after/despre.png",
  },
  {
    id: "despre-echipa-utilaje",
    section: "Despre & Echipa",
    clientAsk:
      "Sectiune noua cu utilajele si echipa (duba, masini, poze cu echipa)",
    quote:
      "Sa vada toata lumea ca am toata gama de utilaje. Bagam o poza cu duba, cu echipa.",
    timestamp: "F3 33:10",
    whatChanged:
      "A fost creata o sectiune noua pe pagina Despre dedicata prezentarii echipamentelor si echipei. Structura grid este gata. Fotografiile (utilaje decupate, duba, echipa) urmeaza sa fie furnizate de Teo.",
    status: "needs-asset",
    route: "/despre",
    afterImage: "/changes/after/despre.png",
  },

  // Configurator
  {
    id: "configurator-sport-icons",
    section: "Configurator",
    clientAsk:
      "Iconite per sport si dimensiuni prestabilite pentru terenuri standard",
    quote:
      "Trebuie sa aiba iconita de basket, de volei -- nu una generica. Si pune 28x15 ca default pentru basket.",
    timestamp: "F3 44:28",
    whatChanged:
      "Configuratorul include acum iconite specifice per sport si dimensiuni prestabilite pentru terenurile cele mai comune (28x15 m basket, 18x9 m volei etc.). Utilizatorii pot ajusta dimensiunile sau folosi preset-urile.",
    status: "done",
    route: "/configurator",
    beforeImage: "/changes/before/configurator.png",
    afterImage: "/changes/after/configurator.png",
  },
  {
    id: "configurator-recommendations",
    section: "Configurator",
    clientAsk:
      "Pop-up-uri de recomandare la anumite selectii cu logica contextuala (Aplica / Citeste mai mult)",
    quote:
      "Cand selecteaza copii sub 12 ani si basket, apare recomandarea EPDM, cu Aplica si Citeste mai mult.",
    timestamp: "F3 44:36",
    whatChanged:
      "A fost implementat un sistem de recomandari contextuale care se activeaza la anumite combinatii de selectii. Fiecare recomandare explica motivul tehnic si ofera optiunile 'Aplica' sau 'Citeste mai mult'. Regulile sunt gestionate din configurator-rules.json si se extind in timp.",
    status: "partial",
    route: "/configurator",
    beforeImage: "/changes/before/configurator.png",
    afterImage: "/changes/after/configurator.png",
  },

  // Contact
  {
    id: "contact-whatsapp-fix",
    section: "Contact",
    clientAsk:
      "Butonul de WhatsApp trimitea gresit spre 'Invata' -- bug de remediat",
    quote:
      "Cand am apasat pe WhatsApp, m-a dus sa-l invatam... adica m-a dus la Invata, nu la WhatsApp.",
    timestamp: "F3 48:24",
    whatChanged:
      "A fost reparat link-ul butonului WhatsApp din pagina Contact. Acum deschide corect conversatia WhatsApp cu numarul echipei ATESS, nu redirectioneaza spre sectiunea Invata.",
    status: "done",
    route: "/contact",
    beforeImage: "/changes/before/contact.png",
    afterImage: "/changes/after/contact.png",
  },
];

export const changesBySection = changes.reduce<Record<string, ChangeEntry[]>>(
  (acc, entry) => {
    if (!acc[entry.section]) acc[entry.section] = [];
    acc[entry.section].push(entry);
    return acc;
  },
  {}
);

export const sectionOrder = [
  "Brand & Pozitionare",
  "Servicii (IA + mega-menu)",
  "Homepage",
  "3D Pardoseli",
  "Invata / SEO",
  "Proiecte",
  "Despre & Echipa",
  "Configurator",
  "Contact",
];

# configurator-rules.json — worksheet de întreținere

Acest fișier este o **fișă de lucru vie**. Regulile se adaugă și se revizuiesc în timp, împreună cu Teo. Nu e o structură "terminată la lansare".

## Ce este o regulă

Fiecare intrare e un obiect `Rule` (vezi `src/app/configurator/rules.ts`):

```ts
type Rule = {
  id: string;                 // unic, kebab-case, stabil (apare în email)
  if: Partial<Answers> & { lengthBelow?: number; totalM2Below?: number };
  then: {
    suggest: string;          // eticheta internă a alternativei
    title?: string;           // titlul cardului
    message: string;          // mesajul scurt "in your face"
    detail?: string;          // textul lung din "Citește mai mult" (de ce-ul)
    rewriteAnswers?: Partial<Answers>; // dacă există, apare butonul "Aplică"
  };
};
```

### Exemplu real din fișier

```json
{
  "id": "basket-kids-to-playground",
  "if": { "projectType": "teren-individual", "sport": "basket", "users": "copii-mici" },
  "then": {
    "suggest": "loc-joaca",
    "title": "Loc de joacă în loc de teren de baschet",
    "message": "Pentru copii sub 12 ani, un sistem EPDM de loc de joacă (~1 cm) e mai potrivit decât un teren de baschet la dimensiuni regulamentare (~3 cm).",
    "detail": "La vârsta asta, copiii cad des și folosesc terenul pentru tot felul de jocuri — nu doar baschet regulamentar..."
  }
}
```

## Cum se evaluează (important pentru ordine)

`evaluateRules` întoarce **prima** regulă din array care se potrivește și care nu a fost deja afișată. Așadar **ordinea contează**: pune regulile specifice înaintea celor generice (ex. `basket-kids-to-playground` înaintea unei eventuale reguli generice `fara-fundatie`).

## Condiții (`if`)

Orice condiție dintr-un `if` trebuie să se potrivească (ȘI logic):

| Tip condiție | Valori posibile | Exemplu | Semnificație |
|---|---|---|---|
| `projectType` | `"teren-individual"`, `"loc-joaca"`, `"pista-atletism"`, `"interior"`, `"multisport"`, `"spatii-publice"` | `"projectType": "teren-individual"` | Tipul proiectului selectat de utilizator |
| `sport` | `"basket"`, `"volei"`, etc. | `"sport": "basket"` | Sportul ales |
| `context` | `"public-nesupervizat"`, `"privat-supervizat"`, `"public-supervizat"`, `"privat"` | `"context": "public-nesupervizat"` | Contextul de utilizare (public/privat, supervizat/nesupervizat) |
| `users` | `"copii-mici"`, `"elevi"`, `"adulti"`, etc. | `"users": "copii-mici"` | Categoria de utilizatori |
| `baseLayer` | `"niciuna"`, `"beton"`, `"asfalt"`, etc. | `"baseLayer": "niciuna"` | Statul actual al stratului suport |
| `useCase` | `"spital"`, `"scoala"`, etc. | `"useCase": "spital"` | Cazul de utilizare (pentru interioare) |
| `lengthBelow` | număr (de exemplu `400`) | `"lengthBelow": 400` | Se potrivește dacă `length < N` (pentru piste) |
| `totalM2Below` | număr (de exemplu `100`) | `"totalM2Below": 100` | Se potrivește dacă `totalM2 < N` (pentru suprafețe mici) |

## Când apare recomandarea

Regulile se evaluează la trecerea prin "gate"-uri (vezi `RULE_GATES` în `Wizard.tsx`):
- `context` (public/privat, supervizat/nesupervizat)
- `users` (categoria de utilizatori)
- `interior-env` (pentru interioare)
- `dimensions` (lungime, lățime, m²)
- `base-layer` (statul stratului suport)

**Atenție**: o condiție care depinde de un răspuns dat **după** ultimul gate nu va declanșa niciodată. Verifică `step-graph.ts` pentru ordinea reală a pașilor. De exemplu, o regulă care se bazează pe `timeline` (răspuns dat după `base-layer`) nu va declanșa niciodată — trebuie să muți regula mai devreme sau să adaugi `timeline` ca gate nou.

## Cum adaugi o regulă nouă

1. **Alege un `id` unic, descriptiv** — kebab-case, în engleză: `basket-kids-to-playground`, `public-nesupervizat-fara-fundatie`.
2. **Scrie `if` cu condițiile minime** — doar cheile care identifică situația. De exemplu, dacă regula e pentru baschet public nesupervizat, pune `projectType`, `sport`, `context`; nu adauga `users` dacă nu e necesar.
3. **Scrie `message`** — 1–2 fraze, registru profesional. E textul pe care îl vede utilizatorul prima oară. Fii direct și concret: "Pentru copii sub 12 ani, un sistem EPDM de loc de joacă (~1 cm) e mai potrivit..."
4. **Scrie `detail`** (opțional, dar recomandat) — de ce-ul, tehnic, concret, fără limbaj de tarabă. E textul din spatele "Citește mai mult". Ai 300–500 cuvinte pentru a justifica recomandarea din perspectiva experizei.
5. **Adaugă `rewriteAnswers` dacă recomandarea schimbă traseul** — de exemplu, dacă regula schimbă `projectType` de la `"teren-individual"` la `"loc-joaca"`, pune `"rewriteAnswers": { "projectType": "loc-joaca" }`. Aceasta crează butonul "Aplică" în interfață.
6. **Plasează regula în array înaintea regulilor mai generice** cu care s-ar putea suprapune. De exemplu, `basket-kids-to-playground` (specific pentru baschet + copii mici) trebuie să apară înaintea `fara-fundatie` (generic pentru orice proiect fără fundație).
7. **Adaugă un test** în `src/app/configurator/__tests__/rules.test.ts`.
8. **Rulează validarea**:
   ```bash
   npm run test
   npx tsc --noEmit
   ```
9. **Regenerează fișa PDF pentru client**:
   ```bash
   npm run configurator:spec
   ```
   (necesită Google Chrome instalat; scrie `docs/configurator-spec.pdf`). Pdf-ul conține textele din `message` și `detail` pentru fiecare regulă — e documentul pe care Teo îl păstrează.

## Cum editezi o regulă

- **Nu schimba `id`-ul unei reguli existente** — `id`-ul apare în emailurile trimise deja și în jurnalul de recomandări. Schimbarea-l ar rupe referințele istorice.
- **Editează `message` / `detail` liber**. Poți rescrie textele oricând — sunt doar pentru comunicare cu utilizatorul.
- **Editează `if` cu grijă**. Schimbarea condițiilor unei reguli existente o poate declanșa pentru utilizatori vechi care nu o trig-eraseră mai devreme. Preferabil: adaugă o regulă nouă mai specifică, apoi comentariază (sau șterge ușor) cea veche.
- **După orice edit, regenerează PDF-ul**: `npm run configurator:spec` ca textele pentru client să rămână sincrone.

## Protocolul de revizuire cu Teo

1. **Dev menține cazurile** — când observi o situație nouă care ar trebui să aibă o recomandare, creează o schiță de regulă.
2. **Teo decide da/nu/mai adaugă** pe fiecare. La fiecare sesiune de revizuire:
   - Generează PDF-ul (`npm run configurator:spec`).
   - Trimite-l lui Teo.
   - Notează deciziile (regulă acceptată / respinge / combină cu alta).
3. **Aplică deciziile în JSON** — adaugă, editează sau comentariază reguli.
4. **Re-rulează testele**: `npm run test && npx tsc --noEmit`.
5. **Regenerează PDF final**: `npm run configurator:spec`.
6. **Commit și deploy**.

Vezi și `docs/configurator-VALIDATION.md` pentru alte validări și protocoluri.

## Comenzi utile

```bash
# Validare și teste
npm run test
npx tsc --noEmit

# Regenerează PDF-ul pentru client (necesită Chrome)
npm run configurator:spec

# Căutare în reguli
grep "basketball" src/data/configurator-rules.json
```

## Note pentru întreținere

- **Greutate PDF**: fiecare regulă nouă adaugă ~0.2–0.5 KB la PDF. Nu e o problemă, dar ține evidență.
- **Linguă**: regulile sunt în limba română (profesional), dar titlurile și id-urile rămân în engleză (pentru compatibilitate cu email și baza de date).
- **Recomandări în email**: titlul și mesajul recomandării apar în emailul de lead pe care utilizatorul îl primește după finalizarea chestionarului. Fii clar și convingător — textele aste convertesc.

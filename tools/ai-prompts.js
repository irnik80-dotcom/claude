// Coniuga – az AI-feladatok közös leírása.
// Ezt használja a Cloudflare Worker (tools/ai-worker.js importálja), és a coniuga.html is
// (a tools/embed-prompts.mjs bemásolja az /*AI-PROMPTS*/ jelölők közé, az "export" szavak nélkül).

export const PROMPT_LANG = { hu: 'Hungarian', pl: 'Polish', en: 'English' };
export const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1'];
const CEFR_HINT = {
  A1: 'very simple words, present tense mostly, short sentences',
  A2: 'simple everyday language, short sentences, common past and future forms',
  B1: 'natural everyday language with some longer sentences',
  B2: 'fluent, varied language with complex sentences and idiomatic expressions',
  C1: 'rich, nuanced, near-native language, including idioms and sophisticated structures'
};
export const SCENARIOS = {
  cafe: 'You are a friendly barista in an Italian bar (café). The learner is a customer who wants to order coffee and something to eat, and pay.',
  restaurant: 'You are a waiter in a family trattoria. The learner is a guest: greet them, take the order, suggest dishes, bring the bill.',
  hotel: 'You are a hotel receptionist in Florence. The learner wants to check in or book a room; ask for details (nights, name, breakfast).',
  directions: 'You are a local person in Rome. The learner stops you in the street to ask for directions to a sight or a shop.',
  market: 'You are a fruit and vegetable seller at a market in Bologna. The learner wants to buy some things; talk about prices and quantities.',
  train: 'You are a ticket clerk at Milano Centrale station. The learner wants to buy a train ticket; ask about destination, time, return, class.',
  doctor: 'You are a family doctor. The learner is a patient who describes how they feel; ask questions and give simple advice.',
  meet: 'You are a friendly Italian person the learner has just met at a language exchange evening. Chat about where they are from, family, work, hobbies and plans.',
  free: 'Have a friendly everyday conversation with the learner about the topic they chose.'
};
const TENSE_EN = { pres: 'presente', pp: 'passato prossimo', imp: 'imperfetto', trp: 'trapassato prossimo', rem: 'passato remoto', trr: 'trapassato remoto', fut: 'futuro semplice', futa: 'futuro anteriore', cond: 'condizionale presente', condp: 'condizionale passato', cong: 'congiuntivo presente', congp: 'congiuntivo passato', congi: 'congiuntivo imperfetto', congt: 'congiuntivo trapassato', impv: 'imperativo' };

const str = (v, n) => String(v == null ? '' : v).slice(0, n).trim();

/* bemenet ellenőrzése (a Worker ezzel szűri a kéréseket) – null: érvénytelen */
export function sanitize(body) {
  const type = body && body.type;
  const lang = PROMPT_LANG[body && body.lang] ? body.lang : 'hu';
  if (type === 'gloss') {
    const words = Array.isArray(body.words) ? body.words.slice(0, 60).map((w) => str(w, 40)) : [];
    const text = str(body.text, 600);
    if (!text || !words.length) return null;
    return { type, lang, text, words, from: body.from === 'it' ? 'it' : 'nat', ref: str(body.ref, 600) };
  }
  if (type === 'chat' || type === 'chatsum') {
    const scenario = SCENARIOS[body.scenario] ? body.scenario : 'free';
    const level = CEFR.includes(body.level) ? body.level : 'A2';
    const history = Array.isArray(body.history) ? body.history.slice(-30).map((m) => ({ role: m && m.role === 'user' ? 'user' : 'ai', text: str(m && m.text, 500) })).filter((m) => m.text) : [];
    if (type === 'chatsum' && !history.some((m) => m.role === 'user')) return null;
    return { type, lang, scenario, level, topic: str(body.topic, 100), history };
  }
  if (type === 'story') {
    const level = CEFR.includes(body.level) ? body.level : 'A2';
    const tenses = Array.isArray(body.tenses) ? body.tenses.filter((x) => TENSE_EN[x]).slice(0, 15) : [];
    return { type, lang, level, tenses: tenses.length ? tenses : ['pres'], topic: str(body.topic, 100) };
  }
  // alapeset: fordítás javítása
  const hu = str(body && body.hu, 600), given = str(body && body.given, 600);
  if (!hu || !given) return null;
  return { type: 'check', lang, hu, given, ref: str(body.ref, 600), form: str(body.form, 80) };
}

/* prompt összeállítása */
export function buildPrompt(p) {
  const LN = PROMPT_LANG[p.lang] || 'Hungarian';
  if (p.type === 'gloss') {
    const list = JSON.stringify(p.words);
    if (p.from !== 'it') return `A learner whose native language is ${LN} is translating this ${LN} sentence into Italian: ${JSON.stringify(p.text)}
${p.ref ? `Its correct Italian translation: ${JSON.stringify(p.ref)}\n` : ''}For each of the following ${LN} words (in order, with exactly the same number of items) give the Italian equivalent as used in this sentence${p.ref ? ', preferably taken from the translation above' : ''}.
For verbs give the conjugated Italian form with the infinitive in brackets (e.g. "siamo andati (andare)"). Be concise (1-4 words). If a word has no separate Italian equivalent, briefly describe its role, written in ${LN}.
Words: ${list}`;
    return `A learner whose native language is ${LN} is reading this Italian text: ${JSON.stringify(p.text)}
For each of the following Italian words (in order, with exactly the same number of items) give its meaning in ${LN} as used in this text.
For verbs add the Italian infinitive in brackets (e.g. "siamo" -> "<meaning in ${LN}> (essere)"). For articles and prepositions briefly give their role, written in ${LN}. Be concise (1-5 words).
Words: ${list}`;
  }
  if (p.type === 'chat') {
    const scen = SCENARIOS[p.scenario] + (p.scenario === 'free' ? ` Topic chosen by the learner: ${JSON.stringify(p.topic || 'everyday life')}.` : '');
    const lastUser = [...p.history].reverse().find((m) => m.role === 'user');
    return `You are role-playing in Italian with a language learner whose native language is ${LN}. Their level is ${p.level} (${CEFR_HINT[p.level]}).
Scenario: ${scen}
Rules:
- Stay in character. "reply" must be in Italian only, short (1-3 sentences), natural, suited to level ${p.level}, and usually end with a question that keeps the conversation going.
- ${p.history.length ? 'Continue the conversation below.' : 'Start the conversation with a greeting that fits the scenario.'}
- "translation" is the translation of your reply into ${LN}.
- "correction" is about the learner's LAST message${lastUser ? ` (${JSON.stringify(lastUser.text)})` : ' (there is none yet: set ok=true and leave the other fields empty)'}: if it has Italian mistakes, set ok=false, put the corrected Italian sentence in "corrected" and a short explanation (one or two sentences) in ${LN} in "explanation". If it is correct and natural, set ok=true and leave "corrected" and "explanation" empty. Ignore missing capital letters and final punctuation.
Conversation so far (JSON, "ai" is you): ${JSON.stringify(p.history)}`;
  }
  if (p.type === 'chatsum') {
    return `A language learner (native language: ${LN}, level ${p.level}) had this role-play conversation in Italian. Scenario: ${SCENARIOS[p.scenario]}${p.topic ? ' Topic: ' + JSON.stringify(p.topic) + '.' : ''}
Conversation (JSON, "ai" is the partner, "user" is the learner): ${JSON.stringify(p.history)}
Evaluate ONLY the learner's Italian. Write everything except the Italian examples in ${LN}.
- "score": integer 0-10 for the learner's Italian at level ${p.level} (correctness, vocabulary, fitting the situation).
- "summary": 2-3 encouraging sentences in ${LN}.
- "errors": up to 6 of the most useful corrections: "wrong" (learner's Italian), "fix" (corrected Italian), "explanation" (short, in ${LN}). Empty if there were none.
- "tips": up to 3 short, practical tips in ${LN}.`;
  }
  if (p.type === 'story') {
    const len = { A1: '60-80', A2: '90-120', B1: '130-170', B2: '170-220', C1: '220-280' }[p.level];
    return `Write a short, original Italian text for a language learner whose native language is ${LN}. Level ${p.level} (${CEFR_HINT[p.level]}). Length: ${len} words.
Use mainly these tenses, naturally: ${p.tenses.map((x) => TENSE_EN[x]).join(', ')}.
Topic: ${p.topic ? JSON.stringify(p.topic) : 'an everyday situation of your choice (family, travel, work, food, city life, a small adventure)'}.
Return:
- "title": a short Italian title,
- "text": the Italian text (plain text, paragraphs separated by a blank line),
- "translation": a faithful translation of the text into ${LN},
- "questions": exactly 3 multiple-choice comprehension questions in Italian, each with 4 short options in Italian, "answer" = index (0-3) of the correct option, and "explanation" = one short sentence in ${LN}.`;
  }
  // check
  return `You are an Italian teacher helping learners whose native language is ${LN}.
The learner translated the following ${LN} text into Italian. Evaluate the translation. Write ALL explanations, error types and the comment in ${LN}.

${LN} text: ${JSON.stringify(p.hu)}
${p.ref ? `A correct model translation (other answers may also be correct): ${JSON.stringify(p.ref)}\n` : ''}${p.form ? `The verb form in this sentence that is certainly correct (from a verified conjugation engine; do not override it, and use exactly this form in corrections): ${JSON.stringify(p.form)}\n` : ''}The learner's translation: ${JSON.stringify(p.given)}

Rules:
- Accept a different word order, synonyms, and versions with or without a subject pronoun, if they are grammatical and mean the same.
- For each error name its type (e.g. tense, conjugation, gender/number agreement, article, preposition, word order, word choice, spelling/accent), written in ${LN}.
- Keep each explanation short and clear (one or two sentences), written in ${LN}.
- If there are no errors, the errors list must be empty.
- "corrected" is the learner's translation corrected with as few changes as possible.
- The model translation is grammatically correct: if your correction would differ from it in the form of a word, use the model translation's form.
- score is an integer from 0 to 10 (10 = perfect).`;
}

/* válaszséma – Gemini formátum */
const S = (type, extra) => Object.assign({ type }, extra || {});
const OBJ = (props, req) => S('OBJECT', { properties: props, required: req || Object.keys(props) });
const ERR = OBJ({ wrong: S('STRING'), fix: S('STRING'), type: S('STRING'), explanation: S('STRING') }, ['wrong', 'fix', 'explanation']);
export const SCHEMAS = {
  check: OBJ({ score: S('INTEGER'), correct: S('BOOLEAN'), corrected: S('STRING'), errors: S('ARRAY', { items: ERR }), comment: S('STRING') }),
  gloss: OBJ({ translations: S('ARRAY', { items: S('STRING') }) }),
  chat: OBJ({ reply: S('STRING'), translation: S('STRING'), correction: OBJ({ ok: S('BOOLEAN'), corrected: S('STRING'), explanation: S('STRING') }, ['ok']) }),
  chatsum: OBJ({ score: S('INTEGER'), summary: S('STRING'), errors: S('ARRAY', { items: ERR }), tips: S('ARRAY', { items: S('STRING') }) }),
  story: OBJ({ title: S('STRING'), text: S('STRING'), translation: S('STRING'), questions: S('ARRAY', { items: OBJ({ q: S('STRING'), options: S('ARRAY', { items: S('STRING') }), answer: S('INTEGER'), explanation: S('STRING') }) }) })
};
/* ugyanez szövegesen, olyan AI-nak, amelyik nem kap sémát (Claude) */
export const JSON_SPEC = {
  check: '{"score": 0-10, "correct": true/false, "corrected": "...", "errors": [{"wrong": "...", "fix": "...", "type": "...", "explanation": "..."}], "comment": "..."}',
  gloss: '{"translations": ["...", "..."]}  (exactly as many items as words)',
  chat: '{"reply": "...", "translation": "...", "correction": {"ok": true/false, "corrected": "...", "explanation": "..."}}',
  chatsum: '{"score": 0-10, "summary": "...", "errors": [{"wrong": "...", "fix": "...", "explanation": "..."}], "tips": ["..."]}',
  story: '{"title": "...", "text": "...", "translation": "...", "questions": [{"q": "...", "options": ["...", "...", "...", "..."], "answer": 0-3, "explanation": "..."}]}'
};

/* hibás modellválasz felismerése: az olasz szövegben nem latin betűk (pl. arab, cirill írásjelek) */
const ODD = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u;
export function looksBroken(type, r) {
  if (!r) return true;
  if (type === 'story') return ODD.test(String(r.text || '') + String(r.title || '')) || !r.text;
  if (type === 'chat') return ODD.test(String(r.reply || '')) || !r.reply;
  return false;
}
const clean = (x) => String(x || '').replace(/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+/gu, '');

/* a válasz egységesítése (hiányzó/hibás mezők pótlása) */
export function normalize(type, r, p) {
  r = r || {};
  const errs = (a) => (Array.isArray(a) ? a.slice(0, 10).map((e) => ({ wrong: str(e && e.wrong, 300), fix: str(e && e.fix, 300), type: str(e && e.type, 60), explanation: str(e && e.explanation, 500) })) : []);
  const score = (v) => Math.max(0, Math.min(10, Math.round(Number(v) || 0)));
  if (type === 'gloss') { const t = Array.isArray(r.translations) ? r.translations : []; return { translations: p.words.map((_, i) => str(t[i], 80)) }; }
  if (type === 'chat') { const c = r.correction || {}; return { reply: str(clean(r.reply), 1200), translation: str(r.translation, 1200), correction: { ok: c.ok !== false || !str(c.corrected, 10), corrected: str(c.corrected, 600), explanation: str(c.explanation, 600) } }; }
  if (type === 'chatsum') return { score: score(r.score), summary: str(r.summary, 1200), errors: errs(r.errors).slice(0, 6), tips: (Array.isArray(r.tips) ? r.tips : []).slice(0, 3).map((x) => str(x, 300)) };
  if (type === 'story') {
    const qs = (Array.isArray(r.questions) ? r.questions : []).slice(0, 3).map((q) => {
      const options = (Array.isArray(q && q.options) ? q.options : []).slice(0, 4).map((o) => str(o, 200));
      const answer = Math.round(Number(q && q.answer));
      return { q: str(q && q.q, 300), options, answer: answer >= 0 && answer < options.length ? answer : 0, explanation: str(q && q.explanation, 400) };
    }).filter((q) => q.q && q.options.length >= 2);
    return { title: str(clean(r.title), 120), text: str(clean(r.text), 4000), translation: str(r.translation, 5000), questions: qs };
  }
  return { score: score(r.score), correct: !!r.correct, corrected: str(r.corrected, 600), errors: errs(r.errors), comment: str(r.comment, 600) };
}

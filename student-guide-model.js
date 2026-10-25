/* Shared by the UI and regression tests; IDs and source links are never translated. */
const StudentGuideModel = {
  audiences: {graduation:['continuing','transfer','finishing'],internship:['continuing','transfer'],certification:['new','continuing','transfer','finishing'],leave:['new','continuing','transfer'],'course-selection':['new','continuing','transfer'],'credit-transfer':['new','transfer'],capstone:['continuing','transfer','finishing'],english:['new','continuing','transfer','finishing'],'status-military':['new','continuing','transfer','finishing'],'financial-aid':['new','continuing','transfer'],'support-rights':['new','continuing','transfer'],career:['finishing','alumni'],'graduate-study':['continuing','finishing','alumni'],'overseas-internship':['continuing','transfer'],'overseas-study-visit':['new','continuing','transfer']},
  // Everyday words students type → wording the official sources actually use (each target exists in guide.json; see tests).
  synonyms: {'獎學金':['獎助','助學','勵學'],'多益':['toeic'],'全民英檢':['英檢']},
  audienceFor(id) { return this.audiences[id] || []; },
  filter(cards, category, query, translate = value => value, audience = 'all') {
    // Space-separated words must all match (any one synonym of a word is enough).
    const words = query.normalize('NFKC').toLocaleLowerCase().split(/\s+/).filter(Boolean).map(word => [word, ...(this.synonyms[word] || [])]);
    return cards.filter(card => {
      if ((category !== 'all' && card.category !== category) || (audience !== 'all' && !this.audienceFor(card.id).includes(audience))) return false;
      const text = [card.title, card.summary, ...card.steps, ...(card.step_details||[]).map(x=>x.detail), ...(card.flow||[]).map(x=>x.label), card.flow_note, ...Object.values(card.contact),
        ...card.faq.flatMap(f => [f.q, f.a])].filter(Boolean).flatMap(s => [s,translate(s)]).join(' ').normalize('NFKC').toLocaleLowerCase();
      return words.every(options => options.some(option => text.includes(option)));
    });
  },
  phone(value) { return 'tel:' + value.replace(/#/g, ',').replace(/[^+0-9,]/g, ''); },
  phones(value) { const base=value.includes('#')?value.split('#')[0]+'#':'';return value.split('、').map((p,i)=>i&&/^\d{4}$/.test(p)?base+p:p); }
};

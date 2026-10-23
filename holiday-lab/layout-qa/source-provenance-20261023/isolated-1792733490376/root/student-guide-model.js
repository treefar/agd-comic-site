/* Shared by the UI and regression tests; IDs and source links are never translated. */
const StudentGuideModel = {
  audiences: {graduation:['continuing','transfer','finishing'],internship:['continuing','transfer'],certification:['new','continuing','transfer','finishing'],leave:['new','continuing','transfer'],'course-selection':['new','continuing','transfer'],'credit-transfer':['new','transfer'],capstone:['continuing','transfer','finishing'],english:['new','continuing','transfer','finishing'],'status-military':['new','continuing','transfer','finishing'],'financial-aid':['new','continuing','transfer'],'support-rights':['new','continuing','transfer'],career:['finishing','alumni'],'graduate-study':['continuing','finishing','alumni'],'overseas-internship':['continuing','transfer'],'overseas-study-visit':['new','continuing','transfer']},
  audienceFor(id) { return this.audiences[id] || []; },
  filter(cards, category, query, translate = value => value, audience = 'all') {
    const needle = query.normalize('NFKC').trim().toLocaleLowerCase();
    return cards.filter(card => (category === 'all' || card.category === category) && (audience === 'all' || this.audienceFor(card.id).includes(audience)) &&
      [card.title, card.summary, ...card.steps, ...(card.step_details||[]).map(x=>x.detail), ...(card.flow||[]).map(x=>x.label), card.flow_note, ...Object.values(card.contact),
        ...card.faq.flatMap(f => [f.q, f.a])].filter(Boolean).flatMap(s => [s,translate(s)]).join(' ').normalize('NFKC').toLocaleLowerCase().includes(needle));
  },
  phone(value) { return 'tel:' + value.replace(/#/g, ',').replace(/[^+0-9,]/g, ''); },
  phones(value) { const base=value.includes('#')?value.split('#')[0]+'#':'';return value.split('、').map((p,i)=>i&&/^\d{4}$/.test(p)?base+p:p); }
};

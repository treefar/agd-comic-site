/* Shared by the UI and regression tests; IDs and source links are never translated. */
const StudentGuideModel = {
  filter(cards, category, query, translate = value => value) {
    const needle = query.normalize('NFKC').trim().toLocaleLowerCase();
    return cards.filter(card => (category === 'all' || card.category === category) &&
      [card.title, card.summary, ...card.steps, ...(card.step_details||[]).map(x=>x.detail), ...Object.values(card.contact),
        ...card.faq.flatMap(f => [f.q, f.a])].filter(Boolean).flatMap(s => [s,translate(s)]).join(' ').normalize('NFKC').toLocaleLowerCase().includes(needle));
  },
  phone(value) { return 'tel:' + value.replace(/#/g, ',').replace(/[^+0-9,]/g, ''); },
  phones(value) { const base=value.includes('#')?value.split('#')[0]+'#':'';return value.split('、').map((p,i)=>i&&/^\d{4}$/.test(p)?base+p:p); }
};

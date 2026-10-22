/* Shared by the UI and regression tests; IDs and source links are never translated. */
const StudentGuideModel = {
  filter(cards, category, query) {
    const needle = query.trim().toLocaleLowerCase();
    return cards.filter(card => (category === 'all' || card.category === category) &&
      [card.title, card.summary, ...card.steps, ...Object.values(card.contact),
        ...card.faq.flatMap(f => [f.q, f.a])].filter(Boolean).join(' ').toLocaleLowerCase().includes(needle));
  },
  phone(value) { return 'tel:' + value.replace(/#/g, ',').replace(/[^+0-9,]/g, ''); },
  phones(value) { const base=value.includes('#')?value.split('#')[0]+'#':'';return value.split('、').map((p,i)=>i&&/^\d{4}$/.test(p)?base+p:p); }
};

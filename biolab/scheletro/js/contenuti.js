/* Emi BioLab · CONTENUTI DEL SITO (scheletro dal brief di Emi, 25/11/2026)
   Questo file in futuro lo scrive il CRM: Emi compila workshop, corsi,
   schede archivio e progetti nel CRM e il sito si aggiorna da solo.
   Per ora: 1 workshop vero (5/12), il resto sono dati d'esempio (bozza: true). */

window.EMI = {

  sito: {
    email: 'hello@emibiolab.com',
    instagram: 'https://www.instagram.com/emibiolab/',
    youtube: '#',
    substack: '#'
  },

  /* EDUCATION · WORKSHOP (template "Individual Workshop") */
  workshops: [
    {
      slug: 'algi-yarn-live',
      titolo: 'Algi Yarn',
      sottotitolo: 'Make a continuous algae-based yarn, live with Emi.',
      formato: 'Online · live',
      data: '2026-12-05',
      quando: 'Sat 5 December 2026 · 6:30 to 8:00 PM CET',
      durata: '90 minutes',
      livello: 'Beginner, no experience needed',
      prezzo: '€147',
      link: 'https://emibiodesigner.com',
      foto: '../img/filato-ciotola-blu.jpg',
      intro: 'A live session on Google Meet to understand how an alginate mixture becomes a continuous, flexible yarn. Not a recipe to follow: a material to read.',
      impari: [
        'How alginate turns from liquid to gel, and why',
        'How to prepare a smooth, even mixture at home',
        'How to extrude a continuous filament in a calcium bath',
        'How to read failures: stiff, brittle or broken threads',
        'How to dry, keep and use your yarn'
      ],
      tecniche: ['Mixture and colour', 'Rest and degassing', 'Extrusion in calcium bath', 'Drying and finishing'],
      programma: [
        ['00:00', 'Welcome and the material: what alginate is, where it comes from'],
        ['00:15', 'Preparing the mixture together'],
        ['00:40', 'First filament: extrusion in the bath'],
        ['01:05', 'Reading the result, common mistakes'],
        ['01:20', 'Drying, care, questions']
      ],
      materiali: 'Basic kitchen tools plus a few simple ingredients, easy to find online. The full list arrives right after booking.',
      faq: [
        ['Do I need experience?', 'No. The workshop starts from zero.'],
        ['What if I cannot find the materials in time?', 'You can still join and follow every step, and try later with the recipe.'],
        ['Is it recorded?', 'To confirm with Emi.'],
        ['In which language?', 'English.']
      ],
      collegati: ['ALG-014', 'ALG-021']
    }
  ],

  /* Workshop passati (archivio selezionato) */
  workshopPassati: [
    { anno: '2026', titolo: 'Alginate Yarn and Biotextile Experimentation', dove: 'Kent State University, Florence' },
    { anno: '2026', titolo: 'Algae-Based Biomaterials Workshop', dove: 'UIUC x Tessitura La Colombina' },
    { anno: '2025', titolo: 'Designing with Nature', dove: 'TEDxVenezia, The Human Safety Net' },
    { anno: '2025', titolo: 'TRAMAR', dove: 'Ocean Space / TBA21-Academy' },
    { anno: 'Online', titolo: 'Alginate yarn workshops', dove: 'Learners in 16+ countries' }
  ],

  /* EDUCATION · CORSI (template "Individual Course") · solo esempi */
  corsi: [
    {
      slug: 'alginate-foundations', bozza: true,
      titolo: 'Alginate Foundations',
      sottotitolo: 'Self-paced. Understand the material before the recipe.',
      livello: 'Beginner', durata: '6 modules · self-paced',
      foto: '../img/miscela-ciotola.jpg',
      obiettivi: ['Understand alginate chemistry in plain words', 'Prepare and adjust mixtures', 'Document your own tests'],
      moduli: ['The material', 'Mixtures and ratios', 'Gelation', 'Filaments', 'Films and surfaces', 'Your experiment log'],
      incluso: ['Video lessons', 'Printable experiment log', 'Material list'],
      prezzo: 'To define'
    },
    {
      slug: 'from-thread-to-textile', bozza: true,
      titolo: 'From Thread to Textile',
      sottotitolo: 'Self-paced. From a single yarn to textile structures.',
      livello: 'Intermediate', durata: '5 modules · self-paced',
      foto: '../img/berlino-filati-colori.jpg',
      obiettivi: ['Produce regular yarn', 'Crochet and weave with algae yarn', 'Test flexibility and durability'],
      moduli: ['Regular yarn', 'Colour', 'Crochet', 'Weaving', 'Care and conservation'],
      incluso: ['Video lessons', 'Pattern sheets'],
      prezzo: 'To define'
    }
  ],

  /* RESEARCH · AREE (categorie aperte) */
  aree: [
    { codice: 'algae', nome: 'Algae-based Materials', testo: 'Materials from algae and their derivatives, from source to sample.' },
    { codice: 'alginate', nome: 'Alginate & Biomaterial Experimentation', testo: 'Formulations, gelation and transformations.' },
    { codice: 'textile', nome: 'Textile & Structural Exploration', testo: 'From filament to yarn, crochet, weave and surface.' },
    { codice: 'behaviour', nome: 'Material Behaviour & Transformation', testo: 'How matter dries, resists, shrinks and keeps traces.' },
    { codice: 'situated', nome: 'Situated Material Research', testo: 'The Venice Lagoon as context: water, salts, time.' },
    { codice: 'emerging', nome: 'Other Emerging Investigations', testo: 'New materials and directions, still open.' }
  ],

  /* RESEARCH · ARCHIVIO MATERIALI (template "Individual Material Entry") · dati d'esempio
     pubblico: false = la scheda resta solo nel CRM. composizione: '' = non pubblicata. */
  archivio: [
    { codice: 'ALG-014', bozza: true, titolo: 'Continuous filament, calcium bath', data: '2026-10', materiale: 'Alginate', tecnica: 'Extrusion', comportamento: 'Flexible', stato: 'Documented', area: 'textile', foto: '../img/filato-verde.jpg',
      domanda: 'How long can a filament stay continuous before it breaks?', composizione: '', parametri: 'Bath at room temperature · 20 min · humidity 55%', osservazioni: 'Placeholder. Observations written by Emi.' },
    { codice: 'ALG-021', bozza: true, titolo: 'Pearl yarn, slow drying', data: '2026-11', materiale: 'Alginate', tecnica: 'Drying', comportamento: 'Soft', stato: 'Ongoing', area: 'behaviour', foto: '../img/filato-perlato.jpg',
      domanda: 'Does a slower drying keep the yarn soft?', composizione: '', parametri: 'Drying 48 h · shade · humidity 60%', osservazioni: 'Placeholder.' },
    { codice: 'LAG-003', bozza: true, titolo: 'Lagoon water as bath', data: '2026-09', materiale: 'Alginate + lagoon water', tecnica: 'Gelation', comportamento: 'Brittle', stato: 'Experimental', area: 'situated', foto: '../img/laguna-mani-ramo.jpg',
      domanda: 'What changes when the bath is lagoon water?', composizione: '', parametri: 'Salinity variable · 30 min', osservazioni: 'Placeholder.' },
    { codice: 'COL-007', bozza: true, titolo: 'Natural colour series', data: '2026-08', materiale: 'Alginate + pigments', tecnica: 'Colour', comportamento: 'Flexible', stato: 'Documented', area: 'alginate', foto: '../img/berlino-filati-colori.jpg',
      domanda: 'Which pigments stay stable after drying?', composizione: '', parametri: '6 pigments · 3 concentrations', osservazioni: 'Placeholder.' },
    { codice: 'TEX-002', bozza: true, titolo: 'Crochet sample', data: '2026-06', materiale: 'Algae yarn', tecnica: 'Crochet', comportamento: 'Flexible', stato: 'Documented', area: 'textile', foto: '../img/haekl-top.jpg',
      domanda: 'Can algae yarn hold a crochet structure?', composizione: '', parametri: 'Hook 4 mm', osservazioni: 'Placeholder.' },
    { codice: 'ALG-030', bozza: true, titolo: 'Mixture, first hour', data: '2026-11', materiale: 'Alginate', tecnica: 'Mixture', comportamento: 'Viscous', stato: 'Ongoing', area: 'alginate', foto: '../img/mani-ciotola.jpg',
      domanda: 'How does viscosity change in the first hour of rest?', composizione: '', parametri: 'Rest 0 to 60 min', osservazioni: 'Placeholder.' }
  ],

  /* PROJECTS (template "Individual Project") */
  progetti: [
    { slug: 'practices-of-dowsing', titolo: 'Practices of Dowsing', anno: '2025', categoria: 'Collaborative', luogo: 'Fondazione Bevilacqua La Masa, Venice', foto: '../img/dowsing.jpg',
      intro: 'A co-led workshop with artist Camilla Dalmazio, investigating biomaterials through embodied practices, collective experimentation and material inquiry.',
      ruolo: 'Co-lead, material research', crediti: 'With Camilla Dalmazio · Fondazione Bevilacqua La Masa' },
    { slug: 'constellation-of-matter', titolo: 'Constellation of Matter', anno: '2025', categoria: 'Installations', luogo: 'AWAi Association, Hide and Seek', foto: '../img/hideandseek.jpg',
      intro: 'Placeholder. Two lines on the project, written with Emi.', ruolo: 'To confirm', crediti: 'AWAi Association' },
    { slug: 'tramar', titolo: 'TRAMAR', anno: '2025', categoria: 'Collaborative', luogo: 'Ocean Space / TBA21-Academy, Venice', foto: '../img/ocean-space-sala.jpg',
      intro: 'Placeholder. Two lines on the project, written with Emi.', ruolo: 'Workshop and material research', crediti: 'Ocean Space / TBA21-Academy' },
    { slug: 'haekl', titolo: 'Emi BioLab x Haekl', anno: 'Year to add', categoria: 'Applications', luogo: '', foto: '../img/haekl-top.jpg',
      intro: 'Crochet and algae yarn: a garment made with Emi BioLab yarn.', ruolo: 'Yarn development', crediti: 'Haekl' },
    { slug: 'amalgama', titolo: 'Amalgama', anno: '2025', categoria: 'Independent', luogo: 'TBA21-Academy, Bruno Books', foto: '../img/amalgama-libro.jpg',
      intro: 'A publication. Placeholder text.', ruolo: 'Contributor', crediti: 'TBA21-Academy · Bruno Books' }
  ],

  /* ABOUT · esperienze (anno, ruolo, organizzazione) */
  esperienze: {
    'Talks & lectures': [
      ['2026', 'Biomaterials as Situated Practice', 'Iuav University of Venice'],
      ['2025', 'Guest lecture', 'University of Illinois Urbana-Champaign'],
      ['2025', 'Biomaterials Seminar', 'Universidad ORT, Uruguay']
    ],
    'Workshops & teaching': [
      ['2026', 'Alginate Yarn and Biotextile Experimentation', 'Kent State University, Florence'],
      ['2026', 'Algae-Based Biomaterials Workshop', 'UIUC x Tessitura La Colombina'],
      ['2025', 'Designing with Nature', 'TEDxVenezia, The Human Safety Net'],
      ['2025', 'TRAMAR', 'Ocean Space / TBA21-Academy']
    ],
    'Collaborations & exhibitions': [
      ['2025', 'Practices of Dowsing', 'with Camilla Dalmazio, Fondazione Bevilacqua La Masa'],
      ['2025', 'Constellation of Matter', 'AWAi Association, Hide and Seek'],
      ['·', 'Nomad Collective', 'Workshop in Berlin · year to add']
    ],
    'Publications': [
      ['2025', 'Amalgama', 'TBA21-Academy, Bruno Books']
    ]
  },

  affiliazioni: ['TEDxVenezia', 'Iuav University of Venice', 'Ocean Space / TBA21-Academy', 'Fondazione Bevilacqua La Masa', 'UIUC', 'Kent State University', 'Universidad ORT']
};

// Operator details for Impressum and Datenschutzerklärung.
// Replace every value that starts with "TODO" before going live — the build prints a warning until then.
// A publisher or "c/o" address is fine; it must be a postal address where letters can be delivered (no P.O. box).

export const legal = {
  operators: ['Vanessa Vu', 'Ahmad Katlesh'],
  street: 'Stephanstraße 28',
  city: '10559 Berlin',
  country: 'Deutschland',
  email: 'kontakt@ahmad-vanessa.com',
  phone: '', // optional; leave empty to hide
  // Person responsible for editorial content under § 18 Abs. 2 MStV (name + same address is fine).
  editorialResponsible: 'Vanessa Vu und Ahmad Katlesh (Anschrift wie oben)',
  lastUpdated: 'September 2026',
};

export const legalTodos = Object.entries(legal)
  .filter(([, v]) => typeof v === 'string' && v.startsWith('TODO'))
  .map(([k]) => k);

// Validate the search term before hitting the API. The Free Dictionary API
// only serves English words, so we keep input to letters plus the few
// in-word characters real entries use (hyphen, apostrophe, space).
export function validateSearchTerm(raw) {
  const value = String(raw ?? '').trim();

  if (value.length === 0) {
    return { valid: false, error: 'Please enter a word to search.' };
  }
  if (value.length > 50) {
    return { valid: false, error: 'That’s a bit long — try a single word.' };
  }
  if (!/^[A-Za-z]/.test(value)) {
    return { valid: false, error: 'Words must start with a letter.' };
  }
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) {
    return { valid: false, error: 'Use letters only (hyphens and apostrophes are allowed).' };
  }

  return { valid: true, value: value.toLowerCase() };
}

export function capitalize(word = '') {
  const w = String(word);
  return w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

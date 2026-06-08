// Validate the search term before hitting the API. The Free Dictionary API
// only serves single English words, so we reject phrases/sentences (any
// whitespace) and allow only letters plus in-word hyphens and apostrophes.
export function validateSearchTerm(raw) {
  const value = String(raw ?? '').trim();

  if (value.length === 0) {
    return { valid: false, error: 'Please enter a word to search.' };
  }
  if (/\s/.test(value)) {
    return { valid: false, error: 'Enter a single word — phrases and sentences aren’t supported.' };
  }
  if (value.length > 45) {
    return { valid: false, error: 'That’s a bit long — try a single word.' };
  }
  if (!/^[A-Za-z]/.test(value)) {
    return { valid: false, error: 'Words must start with a letter.' };
  }
  if (!/^[A-Za-z][A-Za-z'-]*$/.test(value)) {
    return { valid: false, error: 'Use letters only (hyphens and apostrophes are allowed).' };
  }

  return { valid: true, value: value.toLowerCase() };
}

export function capitalize(word = '') {
  const w = String(word);
  return w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

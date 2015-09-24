var latex_commands_to_strings = {
  'i': 'ı', // LATIN SMALL LETTER DOTLESS I
  'L': 'Ł', // LATIN CAPITAL LETTER L WITH STROKE
  'l': 'ł', // LATIN SMALL LETTER L WITH STROKE
  'ss': 'ß', // LATIN SMALL LETTER SHARP S
  'O': 'Ø', // LATIN CAPITAL LETTER O WITH STROKE
  'o': 'ø', // LATIN SMALL LETTER O WITH STROKE
  'AA': 'Å', // LATIN CAPITAL LETTER A WITH RING ABOVE
  'aa': 'å', // LATIN SMALL LETTER A WITH RING ABOVE
  'ae': 'æ', // LATIN SMALL LETTER AE
  'epsilon': 'ε', // GREEK SMALL LETTER EPSILON
  'textgreater': '>',
  'textless': '<',
  'textquoteleft': '``',
  'textquoteright': "''",
  ' ': ' ',
};
var latex_strings_regex = '\\\\(' + Object.keys(latex_commands_to_strings).join('|') + ')';

// the right side is the combiner, which modifies the character before it
var latex_commands_to_combiners = {
  '^': '\u0302', // CIRCUMFLEX ACCENT
  '`': '\u0300', // GRAVE ACCENT
  '"': '\u0308', // DIAERESIS
  '=': '\u0304', // MACRON
  'b': '\u0305', // OVERLINE
  "'": '\u0301', // ACUTE ACCENT
  'c': '\u0327', // CEDILLA
  'v': '\u030C', // CARON -> COMBINING CARON
  'u': '\u0306', // BREVE -> COMBINING BREVE
  '.': '\u0307', // DOT ABOVE
  'd': '\u0323', // DOT BELOW
  'r': '\u030A', // RING ABOVE
  'k': '\u0328', // OGONEK
  '~': '\u0303', // SMALL TILDE
  'H': '\u030B', // DOUBLE ACUTE ACCENT -> COMBINING DOUBLE ACUTE ACCENT
};
var latex_combiners_regex = '\\\\[\'"vc~`^u.drkHb=]';
// not sure if \b (bar) should be overline? also \t (tie)?

function replaceAll(string) {
  return string
  .replace(new RegExp(latex_strings_regex, 'g'), function(match) {
    return latex_commands_to_strings[match.slice(1)];
  })
  .replace(/\\(\$|&|#)/g, '$1')
  .replace(/\\(textsc|sc|emph|em)/g, '')
  .replace(new RegExp(latex_combiners_regex + '\\{.\\}', 'g'), function(match) {
    return match[3] + latex_commands_to_combiners[match[1]];
  })
  .replace(new RegExp(latex_combiners_regex + '.', 'g'), function(match) {
    return match[2] + latex_commands_to_combiners[match[1]];
  })
  .replace(/~/g, ' ')
  .replace(/--/g, '–')
  .replace(/\{|\}/g, '')
  .replace(/``/g, '“')
  .replace(/''/g, '”');
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
  process.stdout.write(replaceAll(chunk));
});
process.stdin.on('end', function() {
  process.exit();
});

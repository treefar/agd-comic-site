"""Read-only local font cmap audit of independent real-DOM receipts; no browser."""
import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path
from collections import defaultdict
from fontTools.ttLib import TTFont, TTCollection

OUT = Path(__file__).resolve().parent
FILES = ['msjh.ttc', 'msjhbd.ttc', 'segoeui.ttf', 'segoeuib.ttf',
         'seguisb.ttf', 'SegUIVar.ttf', 'YuGothR.ttc', 'YuGothB.ttc', 'msgothic.ttc']

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def names(font, ids):
    result = set()
    for n in font['name'].names:
        if n.nameID in ids:
            try:
                result.add(n.toUnicode())
            except Exception:
                pass
    return sorted(result)

def inventory():
    faces, errors = [], []
    for name in FILES:
        p = Path('C:/Windows/Fonts') / name
        if not p.exists():
            errors.append({'file': str(p), 'error': 'not installed'})
            continue
        try:
            fonts = TTCollection(p, lazy=True).fonts if p.suffix.lower() == '.ttc' else [TTFont(p, lazy=True)]
            for index, font in enumerate(fonts):
                cmap = {cp for cp, glyph in (font.getBestCmap() or {}).items() if glyph != '.notdef'}
                faces.append({'file': str(p), 'face_index': index, 'file_sha256': sha(p),
                              'family_names': names(font, [1, 16]), 'full_names': names(font, [4]),
                              'subfamily_names': names(font, [2, 17]), 'postscript_names': names(font, [6]),
                              'weight_class': font['OS/2'].usWeightClass if 'OS/2' in font else None,
                              'cmap_count': len(cmap), '_cmap': cmap})
            # Collection faces share one lazy stream; close only after every
            # face's name/cmap tables have been read.
            for font in fonts:
                font.close()
        except Exception as exc:
            errors.append({'file': str(p), 'error': str(exc)})
    return faces, errors

def public_face(f):
    return {k: v for k, v in f.items() if k != '_cmap'}

parser = argparse.ArgumentParser()
parser.add_argument('--receipt', type=Path)
parser.add_argument('--inventory-only', action='store_true')
args = parser.parse_args()
faces, font_errors = inventory()
base = {'script_sha256': sha(__file__), 'python_fonttools_version': importlib.metadata.version('fonttools'),
        'fonts': [public_face(f) for f in faces], 'font_errors': font_errors}
if args.inventory_only:
    (OUT / 'font-inventory.json').write_text(json.dumps(base, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'font_faces': len(faces), 'font_errors': len(font_errors)}))
    raise SystemExit(1 if font_errors else 0)
if not args.receipt:
    parser.error('--receipt required')
p = args.receipt.resolve()
receipt = json.loads(p.read_text(encoding='utf-8'))
if receipt.get('status') == 'running':
    raise SystemExit('Receipt is still running; refusing a premature final coverage report')

observed = {}
lang_chars = defaultdict(set)
style_chars = defaultdict(set)
style_rows = defaultdict(int)
unique_rows = set()
cdp_examples = []
total_rows = 0
for case in receipt['cases']:
    for state in case.get('states', []):
        for row in state.get('rows', []):
            total_rows += 1
            chars = {ord(ch) for ch in row['text'] if not ch.isspace()}
            lang_chars[case['lang']].update(chars)
            key = (case['lang'], row['family'], row['fontWeight'], row['fontSize'])
            style_chars[key].update(chars)
            style_rows[key] += 1
            unique_rows.add((case['id'], case['lang'], case['width'], state['label'], row['selector'], row['text']))
        for sample in state.get('platformFonts', []):
            for font in sample.get('fonts', []):
                key = (font.get('familyName'), font.get('postScriptName'))
                observed[key] = font
            if sample.get('fonts'):
                cdp_examples.append({'game': case['id'], 'lang': case['lang'], 'width': case['width'],
                                     'state': state['label'], 'selector': sample['selector'],
                                     'text': sample['text'], 'declared_family': sample['family'], 'fonts': sample['fonts']})

mapped = []
mapping_unknown = []
for (family, ps), font in sorted(observed.items()):
    exact = [f for f in faces if ps in f['postscript_names'] and family in f['family_names'] + f['full_names']]
    record = {'family': family, 'postscript': ps, 'mode': 'exact name-table family AND PostScript match',
              'faces': [{'file': f['file'], 'face_index': f['face_index'], 'sha256': f['file_sha256']} for f in exact]}
    mapped.append(record)
    if not exact:
        mapping_unknown.append(record)

# The independent CDP sampling groups by CSS family and does not inspect every
# weight/character. The candidate stack is explicitly a union, not an assertion
# that Windows/Chromium chose each candidate for any given glyph.
accepted_families = {'Segoe UI', 'Segoe UI Variable', 'Segoe UI Variable Display', 'Segoe UI Variable Text',
                     'Microsoft JhengHei UI', 'Microsoft JhengHei', 'Yu Gothic', 'Yu Gothic UI', 'MS Gothic',
                     'MS UI Gothic', 'MS PGothic'}
candidates = [f for f in faces if accepted_families.intersection(f['family_names'])]
union = set().union(*(f['_cmap'] for f in candidates))
observed_families = {family for family, ps in observed}
observed_family_faces = [f for f in faces if observed_families.intersection(f['family_names'])]
observed_family_union = set().union(*(f['_cmap'] for f in observed_family_faces))
def cp_record(cp):
    return {'character': chr(cp), 'codepoint': 'U+%04X' % cp}
languages = []
for lang, chars in sorted(lang_chars.items()):
    missing = sorted(chars - union)
    languages.append({'lang': lang, 'codepoint_count': len(chars), 'codepoints': [cp_record(cp) for cp in sorted(chars)],
                      'missing': [cp_record(cp) for cp in missing],
                      'observed_family_missing': [cp_record(cp) for cp in sorted(chars - observed_family_union)],
                      'unknown': [] if candidates else [cp_record(cp) for cp in sorted(chars)],
                      'candidate_matches': [{'file': f['file'], 'face_index': f['face_index'],
                                             'postscript_names': f['postscript_names'],
                                             'covered_codepoint_count': len(chars & f['_cmap']),
                                             'missing_codepoints': ['U+%04X' % cp for cp in sorted(chars - f['_cmap'])]}
                                            for f in candidates]})
styles = []
for key, chars in sorted(style_chars.items()):
    lang, family, weight, size = key
    styles.append({'lang': lang, 'family': family, 'weight': weight, 'size': size,
                   'observed_rows': style_rows[key], 'codepoint_count': len(chars),
                   'missing': [cp_record(cp) for cp in sorted(chars - union)],
                   'coverage_mode': 'explicit installed system candidate stack union, not per-glyph actual selection'})
result = {**base, 'receipt': str(p), 'receipt_sha256': sha(p), 'receipt_status': receipt['status'],
          'receipt_started': receipt.get('started'), 'receipt_finished': receipt.get('finished'),
          'scope': 'Only visible text rows captured by the referenced independent run; stack cmap coverage complements sampled CDP faces',
          'game_ids': sorted({c['id'] for c in receipt['cases']}),
          'cases': len(receipt['cases']), 'states': sum(len(c.get('states', [])) for c in receipt['cases']),
          'unique_contexts': len({(c['id'], c['lang'], c['width']) for c in receipt['cases']}),
          'context_matrix_14x3x2_complete': len(receipt['cases']) == 84 and
              len({(c['id'], c['lang'], c['width']) for c in receipt['cases']}) == 84 and
              len({c['id'] for c in receipt['cases']}) == 14 and
              all(c['id'] != 'labor' and c['lang'] in ['zh', 'en', 'ja'] and c['width'] in [320, 1440]
                  for c in receipt['cases']),
          'served_source_stable': receipt.get('sources', {}).get('before') == receipt.get('sources', {}).get('after'),
          'visible_text_rows': total_rows, 'unique_visible_rows': len(unique_rows),
          'cdp_sample_count': len(cdp_examples), 'cdp_observed_name_mappings': mapped,
          'cdp_mapping_unknown': mapping_unknown, 'cdp_examples': cdp_examples,
          'candidate_stack_faces': [{'file': f['file'], 'face_index': f['face_index'], 'postscript_names': f['postscript_names']}
                                    for f in candidates], 'languages': languages, 'styles': styles,
          'stack_missing_total': sum(len(l['missing']) for l in languages),
          'stack_unknown_total': sum(len(l['unknown']) for l in languages),
          'observed_family_missing_total': sum(len(l['observed_family_missing']) for l in languages),
          'actual_per_character_fallback_proven': False,
          'actual_per_style_fallback_proven': False,
          'per_character_actual_fallback_unknown_visible_rows': total_rows,
          'font_style_field_captured_by_independent_receipt': False,
          'actual_fallback_unknown_scope': 'All rows not individually sampled by character; CDP samples one owner per CSS family per state and cannot prove all weights or characters',
          'full_project_approved': False, 'art_approved': False,
          'notes': ['No browser launched by this script; no network access or font downloads.',
                    'Every candidate face is independently read from its name table; no filename-only family alias inference.',
                    'Coverage excludes .notdef cmap entries; does not certify contextual shaping, raster appearance, or safety-zone geometry.',
                    'No claim is made that requested Noto Sans TC is installed; sampled CDP identifies observed system faces.']}
result['stack_coverage_pass'] = not result['stack_missing_total'] and not result['stack_unknown_total'] and not font_errors and not mapping_unknown
(OUT / 'font-coverage.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: result[k] for k in ['cases', 'states', 'visible_text_rows', 'cdp_sample_count', 'stack_missing_total', 'stack_unknown_total', 'stack_coverage_pass', 'actual_per_character_fallback_proven']}))
print(json.dumps({'per_language': [{'lang': l['lang'], 'codepoints': l['codepoint_count'],
                                    'missing': len(l['missing']), 'unknown': len(l['unknown']),
                                    'observed_family_missing': len(l['observed_family_missing'])}
                                   for l in languages]}))
raise SystemExit(0 if result['stack_coverage_pass'] else 1)

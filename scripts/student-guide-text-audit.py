"""Run the approved text/border audit against the new guide at desktop/mobile widths."""
import importlib.util, json, os, pathlib, socket, subprocess, time, urllib.request
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDITOR = pathlib.Path('C:/AIHome/claude/skills/webapp-testing/scripts/text_on_border_audit.py')
spec = importlib.util.spec_from_file_location('approved_text_audit', AUDITOR)
approved = importlib.util.module_from_spec(spec)
spec.loader.exec_module(approved)
out = pathlib.Path(os.environ.get('QA_OUTPUT', str(ROOT / 'docs/qa/student-guide')))
out.mkdir(parents=True, exist_ok=True)
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    port = sock.getsockname()[1]
server = subprocess.Popen(['node', 'scripts/serve-student-preview.cjs', 'dist', str(port)], cwd=ROOT,
                          stdout=subprocess.DEVNULL, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
url = f'http://127.0.0.1:{port}/#/students/guide'
results = []
try:
    for _ in range(50):
        try:
            urllib.request.urlopen(url.split('#')[0], timeout=1)
            break
        except OSError:
            time.sleep(.1)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for language, width in [(lang, w) for lang in os.environ.get('QA_LANGS', 'zh').split(',') for w in [1440, 390, 320]]:
            page = browser.new_page(viewport={'width': width, 'height': 950})
            page.goto(url.replace('/#', ('/?lang=' + language if language != 'zh' else '/') + '#'))
            page.locator('[data-guide-card]').first.wait_for()
            page.evaluate('document.fonts.ready')
            # The audit is scoped to the guide. Hide the existing sticky header's
            # overlay without changing layout, so offscreen text is not sampled through it.
            page.add_style_tag(content='.topnav{visibility:hidden!important}')
            for expanded in [False, True]:
                page.evaluate('(open)=>{document.querySelectorAll(".sg-faq-item").forEach(e=>e.open=open);document.querySelector(".sg-sources").open=open;}', expanded)
                height = page.evaluate('document.documentElement.scrollHeight')
                # Keep captures below Chromium's 16384px raster boundary. Overlap
                # chunks so text crossing an edge is checked fully in another image.
                page.set_viewport_size({'width': width, 'height': 9000})
                violations = []
                for top in range(0, height, 8200):
                    page.evaluate('(top)=>scrollTo({top,behavior:"instant"})', top)
                    violations.extend(approved.audit_text_on_border(page, f'{language}-{width}-expanded-{expanded}', '#student-guide'))
                results.append({'language': language, 'width': width, 'expanded': expanded, 'violations': violations})
            # A deliberately striped text background must fail the pixel-based checker.
            page.evaluate('document.querySelector(".sg-summary").style.background="repeating-linear-gradient(90deg,#000 0 4px,#fff 4px 8px)"')
            page.evaluate('scrollTo({top:0,behavior:"instant"})')
            negative = approved.audit_text_on_border(page, 'negative-control', '.sg-card')
            assert negative, 'Text/border checker did not detect the deliberate bad background'
            page.close()
        browser.close()
    (out / 'text-audit.json').write_text(json.dumps({'results': results, 'negative_control_detected': True}, ensure_ascii=False, indent=2), encoding='utf-8')
    for row in results:
        print(row['language'], row['width'], 'expanded='+str(row['expanded']), 'violations='+str(len(row['violations'])))
        if row['violations']:
            print(json.dumps(row['violations'][:8], ensure_ascii=False))
    print('negative-control detected')
    raise SystemExit(1 if any(row['violations'] for row in results) else 0)
finally:
    server.terminate()
    server.wait(timeout=10)

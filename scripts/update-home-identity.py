from pathlib import Path

path = Path('app/page.tsx')
text = path.read_text(encoding='utf-8')
old = '''          <p lang="en">\n            Independent design and development practice.\n            <br />From concept to interface, built as one system.\n          </p>'''
new = '''          <p lang="en">\n            Independent AI, PM &amp; engineering practice.\n            <br />From concept to implementation, built for real-world use.\n          </p>'''
if text.count(old) != 1:
    raise SystemExit('Expected home identity block exactly once')
path.write_text(text.replace(old, new, 1), encoding='utf-8')

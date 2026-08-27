from pathlib import Path
import fitz

source = Path("attached_assets/AMARA_-Company_Profile_1787830684861.PDF")
output = Path(".agents/outputs/atc-company-profile")
output.mkdir(parents=True, exist_ok=True)

doc = fitz.open(source)
print(f"pages={doc.page_count}")
for index, page in enumerate(doc):
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    target = output / f"page-{index + 1:02d}.png"
    pixmap.save(target)
    print(target)
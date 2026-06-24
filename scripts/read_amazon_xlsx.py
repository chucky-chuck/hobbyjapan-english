import json
import sys

import pandas as pd

MARKETS = ["US", "UK", "CA", "DE", "FR", "IT", "ES", "NL"]


def main() -> None:
    xlsx_path = sys.argv[1]
    df = pd.read_excel(xlsx_path)
    rows = []
    for _, row in df.iterrows():
        links = []
        for code in MARKETS:
            url = row.get(code)
            if isinstance(url, str) and url.strip():
                links.append({"region": code, "url": url.strip()})
        rows.append(
            {
                "hjcode": str(row["HJK Code"]).strip(),
                "asin": str(row["ASIN"]).strip(),
                "title": str(row["Book Title"]).strip(),
                "amazonLinks": links,
            }
        )
    print(json.dumps(rows))


if __name__ == "__main__":
    main()

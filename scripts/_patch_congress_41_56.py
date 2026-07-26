from pathlib import Path

p = Path("src/data/useCases/congressDesks.ts")
t = p.read_text(encoding="utf-8")
seeds = Path("scripts/_congress_seeds_41_56.txt").read_text(encoding="utf-8")
if "cong-41-ai-chip-export" in t:
    print("already has 41")
else:
    marker = "id: 'cong-40-pqc-crypto'"
    idx = t.find(marker)
    assert idx > 0, "cong-40 not found"
    end = t.find("\n]\n\nfunction buildReport", idx)
    assert end > 0, "SEEDS end not found"
    t = t[:end] + ",\n" + seeds + t[end:]
    p.write_text(t, encoding="utf-8")
    print("inserted", seeds.count("id: 'cong-"))
print("total ids", t.count("id: 'cong-"))

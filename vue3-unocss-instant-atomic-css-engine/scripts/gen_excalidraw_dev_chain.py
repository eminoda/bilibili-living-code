"""Generate excalidraw-dev-chain-compare.excalidraw for vue3-unocss topic."""
import json
from pathlib import Path

G = 20
W_COL = 300
H_BOX = 52
GAP = 56
X_L = 200
X_R = 1180
Y0 = 100
Y_TITLE = 40


def rect(rid, x, y, w, h, bg, idx, seed):
    return {
        "id": rid,
        "type": "rectangle",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": bg,
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "index": idx,
        "roundness": {"type": 3},
        "seed": seed,
        "version": 1,
        "versionNonce": seed ^ 1,
        "isDeleted": False,
        "boundElements": [],
        "updated": 1,
        "link": None,
        "locked": False,
    }


def text(tid, rid, x, y, w, h, content, idx, seed, fs=17):
    return {
        "id": tid,
        "type": "text",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "index": idx,
        "roundness": None,
        "seed": seed,
        "version": 1,
        "versionNonce": seed ^ 2,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False,
        "text": content,
        "fontSize": fs,
        "fontFamily": 5,
        "textAlign": "center",
        "verticalAlign": "middle",
        "containerId": rid,
        "originalText": content,
        "autoResize": True,
        "lineHeight": 1.25,
    }


def v_arrow(aid, x, y, w, h, points, start_id, end_id, idx, seed):
    return {
        "id": aid,
        "type": "arrow",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "index": idx,
        "roundness": {"type": 2},
        "seed": seed,
        "version": 1,
        "versionNonce": seed ^ 3,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False,
        "points": points,
        "startBinding": {
            "elementId": start_id,
            "mode": "orbit",
            "fixedPoint": [0.5001, 1],
        },
        "endBinding": {
            "elementId": end_id,
            "mode": "orbit",
            "fixedPoint": [0.5001, 0],
        },
        "startArrowhead": None,
        "endArrowhead": "arrow",
        "elbowed": False,
        "moveMidPointsWithElement": False,
    }


def main():
    els = []
    z = 0

    def nidx():
        nonlocal z
        z += 1
        return f"w{z:02d}"

    seed_base = 884422001

    # Title
    tb = rect("ucTitleBox", 360, Y_TITLE, 960, 48, "#ffec99", nidx(), seed_base)
    tt = text(
        "ucTitleTxt",
        "ucTitleBox",
        380,
        Y_TITLE + 11,
        920,
        26,
        "开发期样式更新：左 Uno（短链） vs 右 Tailwind（长链）",
        nidx(),
        seed_base + 1,
        18,
    )
    tb["boundElements"] = [{"type": "text", "id": "ucTitleTxt"}]
    els.extend([tb, tt])

    labels_l = ["Vite 提取 class", "preset 命中", "输出按需 CSS"]
    labels_r = ["PostCSS + @tailwind", "扫描 utilities", "插件链转换"]
    boxes_l = []
    boxes_r = []
    y = Y0
    for i in range(3):
        seed = seed_base + 10 + i
        lb = rect(f"ucLb{i}", X_L, y, W_COL, H_BOX, "#b2f2bb" if i < 2 else "#ffec99", nidx(), seed)
        lt = text(
            f"ucLt{i}",
            f"ucLb{i}",
            X_L + 16,
            y + (H_BOX - 22) / 2,
            W_COL - 32,
            24,
            labels_l[i],
            nidx(),
            seed + 1,
        )
        lb["boundElements"] = [{"type": "text", "id": f"ucLt{i}"}]
        boxes_l.append((lb, lt))
        els.extend([lb, lt])
        y += H_BOX + GAP

    y = Y0
    for i in range(3):
        seed = seed_base + 30 + i
        rb = rect(f"ucRb{i}", X_R, y, W_COL, H_BOX, "#ffc9c9" if i < 2 else "#ffec99", nidx(), seed)
        rt = text(
            f"ucRt{i}",
            f"ucRb{i}",
            X_R + 16,
            y + (H_BOX - 22) / 2,
            W_COL - 32,
            24,
            labels_r[i],
            nidx(),
            seed + 1,
        )
        rb["boundElements"] = [{"type": "text", "id": f"ucRt{i}"}]
        boxes_r.append((rb, rt))
        els.extend([rb, rt])
        y += H_BOX + GAP

    # vertical arrows left
    for i in range(2):
        b0, _ = boxes_l[i]
        b1, _ = boxes_l[i + 1]
        cx = b0["x"] + b0["width"] / 2
        ay = b0["y"] + b0["height"]
        ah = b1["y"] - ay
        aid = f"ucLa{i}"
        arr = v_arrow(
            aid,
            cx - 0.5,
            ay,
            1,
            ah,
            [[0, 0], [1, ah]],
            b0["id"],
            b1["id"],
            nidx(),
            seed_base + 50 + i,
        )
        b0["boundElements"].append({"id": aid, "type": "arrow"})
        b1["boundElements"].append({"id": aid, "type": "arrow"})
        els.append(arr)

    for i in range(2):
        b0, _ = boxes_r[i]
        b1, _ = boxes_r[i + 1]
        cx = b0["x"] + b0["width"] / 2
        ay = b0["y"] + b0["height"]
        ah = b1["y"] - ay
        aid = f"ucRa{i}"
        arr = v_arrow(
            aid,
            cx - 0.5,
            ay,
            1,
            ah,
            [[0, 0], [1, ah]],
            b0["id"],
            b1["id"],
            nidx(),
            seed_base + 60 + i,
        )
        b0["boundElements"].append({"id": aid, "type": "arrow"})
        b1["boundElements"].append({"id": aid, "type": "arrow"})
        els.append(arr)

    # bottom metrics
    yb = Y0 + 3 * (H_BOX + GAP) + 20
    bb = rect("ucBotBox", 420, yb, 840, 72, "#e7f5ff", nidx(), seed_base + 99)
    bt = text(
        "ucBotTxt",
        "ucBotBox",
        440,
        yb + 14,
        800,
        44,
        "本实验 HMR：左 24KB · 9ms   右 56KB · 28ms\n首包 CSS：22 KB vs 48 KB（左 Uno 右 Tailwind）",
        nidx(),
        seed_base + 100,
        16,
    )
    bb["boundElements"] = [{"type": "text", "id": "ucBotTxt"}]
    els.extend([bb, bt])

    doc = {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": els,
        "appState": {
            "gridSize": G,
            "gridStep": 5,
            "gridModeEnabled": True,
            "viewBackgroundColor": "#ffffff",
            "lockedMultiSelections": {},
        },
        "files": {},
    }

    out = Path(__file__).resolve().parents[1] / "excalidraw-dev-chain-compare.excalidraw"
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", out)


if __name__ == "__main__":
    main()

import React, { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  bg: "#07080f",
  surface: "#0d0e1a",
  card: "#111222",
  cardHover: "#161830",
  border: "#1c1e35",
  borderHover: "#2a2d50",
  accent: "#6c63ff",
  accentHover: "#7c73ff",
  accentGlow: "#6c63ff44",
  teal: "#00d4aa",
  tealGlow: "#00d4aa33",
  amber: "#f5a623",
  amberGlow: "#f5a62333",
  red: "#ff5757",
  redGlow: "#ff575733",
  green: "#36d399",
  greenGlow: "#36d39933",
  purple: "#a855f7",
  pink: "#ec4899",
  muted: "#42445a",
  text: "#e8e9f8",
  textSub: "#7879a0",
  textMuted: "#454665",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700;800&family=Oxanium:wght@400;600;700;800&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body { height: 100%; }
    body { background:${C.bg}; color:${C.text}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
    ::-webkit-scrollbar-thumb:hover { background:${C.accent}; }
    button { cursor:pointer; border:none; background:none; font-family:inherit; }
    input[type=range] { -webkit-appearance:none; width:100%; height:3px; background:${C.border}; border-radius:2px; outline:none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:${C.accent}; cursor:pointer; transition: transform 0.1s; }
    input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.3); }
    input[type=number], input[type=text] { background:${C.surface}; border:1px solid ${C.border}; color:${C.text}; border-radius:8px; padding:8px 12px; font-family:inherit; font-size:13px; outline:none; transition: border-color 0.2s, box-shadow 0.2s; }
    input[type=number]:focus, input[type=text]:focus { border-color:${C.accent}; box-shadow: 0 0 0 3px ${C.accentGlow}; }
    select { background:${C.surface}; border:1px solid ${C.border}; color:${C.text}; border-radius:8px; padding:8px 12px; font-family:inherit; font-size:13px; outline:none; cursor:pointer; transition: border-color 0.2s; }
    select:focus { border-color:${C.accent}; }
    .mono { font-family:'JetBrains Mono',monospace; }
    .oxanium { font-family:'Oxanium',sans-serif; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes glow { 0%,100%{box-shadow: 0 0 8px ${C.accentGlow}} 50%{box-shadow: 0 0 20px ${C.accentGlow}, 0 0 40px ${C.accentGlow}} }
    @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
    @keyframes bounceIn { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
    @keyframes slideRight { from{transform:translateX(-8px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .slide-up { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
    .bounce-in { animation: bounceIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

    .tooltip-wrap { position:relative; }
    .tooltip-wrap .tooltip {
      position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
      background:${C.card}; border:1px solid ${C.border}; color:${C.text};
      padding:6px 10px; border-radius:6px; font-size:11px; white-space:nowrap;
      pointer-events:none; opacity:0; transition:opacity 0.15s;
      z-index:100; font-family:'DM Sans',sans-serif;
    }
    .tooltip-wrap:hover .tooltip { opacity:1; }

    .sidebar-btn { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); }
    .sidebar-btn:hover { transform: translateX(3px); }

    .pro-badge {
      display:inline-flex; align-items:center; gap:4px;
      padding: 2px 8px; border-radius:12px; font-size:10px; font-weight:700;
      background: linear-gradient(135deg, ${C.amber}, ${C.red});
      color: white; letter-spacing:0.5px;
    }

    .code-line { transition: all 0.2s ease; border-radius: 4px; padding: 2px 6px; }
    .code-line.active {
      background: ${C.accentGlow};
      border-left: 2px solid ${C.accent};
      padding-left: 4px;
    }
    .code-line:hover { background: ${C.cardHover}; cursor:pointer; }

    .practice-bar { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .practice-bar:hover { transform: scaleY(1.04); filter: brightness(1.2); }

    .xp-fill { transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }

    .metric-card { transition: all 0.2s ease; }
    .metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,0.15); }

    .hint-box { animation: slideRight 0.3s ease; }
    .completion-glow { animation: glow 2s ease-in-out infinite; }

    textarea { background:${C.surface}; border:1px solid ${C.border}; color:${C.text}; border-radius:8px; padding:10px 12px; font-family:'JetBrains Mono',monospace; font-size:12px; outline:none; resize:vertical; transition: border-color 0.2s; }
    textarea:focus { border-color:${C.accent}; box-shadow: 0 0 0 3px ${C.accentGlow}; }

    .tab-active { position:relative; }
    .tab-active::after { content:''; position:absolute; bottom:0; left:10%; right:10%; height:2px; background:${C.accent}; border-radius:1px; }
  `}</style>
);

// ─── ANALYTICS ENGINE ─────────────────────────────────────────────
const analyticsInitState = {
  sessions: {},
  totalSteps: 0,
  playPauseCount: 0,
  hintsUsed: 0,
  practiceAttempts: 0,
  practiceCorrect: 0,
  speed: 5,
  algoVisited: {},
  recommendedAlgo: null,
};

function analyticsReducer(state, action) {
  switch (action.type) {
    case "STEP": return { ...state, totalSteps: state.totalSteps + 1 };
    case "PLAY_PAUSE": return { ...state, playPauseCount: state.playPauseCount + 1 };
    case "HINT_USED": return { ...state, hintsUsed: state.hintsUsed + 1 };
    case "PRACTICE_ATTEMPT": return {
      ...state,
      practiceAttempts: state.practiceAttempts + 1,
      practiceCorrect: state.practiceCorrect + (action.correct ? 1 : 0),
    };
    case "VISIT_ALGO": {
      const visited = { ...state.algoVisited, [action.algo]: (state.algoVisited[action.algo] || 0) + 1 };
      return { ...state, algoVisited: visited };
    }
    case "SET_SPEED": return { ...state, speed: action.speed };
    default: return state;
  }
}

// XP System
function calcXP(analytics) {
  return (
    analytics.totalSteps * 2 +
    analytics.practiceCorrect * 50 +
    Object.keys(analytics.algoVisited).length * 100 -
    analytics.hintsUsed * 5
  );
}

function getLevel(xp) {
  if (xp < 200) return { level: 1, title: "Learner", next: 200 };
  if (xp < 600) return { level: 2, title: "Explorer", next: 600 };
  if (xp < 1200) return { level: 3, title: "Practitioner", next: 1200 };
  if (xp < 2500) return { level: 4, title: "Engineer", next: 2500 };
  return { level: 5, title: "Algorithm Master", next: null };
}

// ─── ADAPTIVE RECOMMENDATION ENGINE ──────────────────────────────
function getRecommendation(analytics) {
  const visited = analytics.algoVisited;
  const accuracy = analytics.practiceAttempts > 0
    ? analytics.practiceCorrect / analytics.practiceAttempts : 1;

  if (!visited.bubble) return { algo: "bubble", reason: "Start with the fundamentals — Bubble Sort is a great entry point.", module: "sorting" };
  if (!visited.merge) return { algo: "merge", reason: "You've seen O(n²) sorting. Now explore the efficient O(n log n) Merge Sort.", module: "sorting" };
  if (!visited.bfs && !visited.dfs) return { algo: "BFS", reason: "Sorting mastered! Try graph traversal with BFS next.", module: "graph" };
  if (accuracy < 0.5) return { algo: null, reason: "Practice mode accuracy is low. Try slowing down and using hints.", module: null };
  return { algo: "dijkstra", reason: "You're ready for Dijkstra's shortest path algorithm!", module: "graph" };
}

// ─── CODE SNIPPETS DATABASE ───────────────────────────────────────
const CODE_SNIPPETS = {
  bubble: [
    { line: "for (let i = 0; i < n - 1; i++) {", phase: "outer" },
    { line: "  for (let j = 0; j < n - i - 1; j++) {", phase: "inner" },
    { line: "    if (arr[j] > arr[j + 1]) {", phase: "compare" },
    { line: "      [arr[j], arr[j+1]] = [arr[j+1], arr[j]]", phase: "swap" },
    { line: "    }", phase: "inner_end" },
    { line: "  }", phase: "outer_end" },
    { line: "}", phase: "done" },
  ],
  selection: [
    { line: "for (let i = 0; i < n - 1; i++) {", phase: "outer" },
    { line: "  let minIdx = i", phase: "init_min" },
    { line: "  for (let j = i+1; j < n; j++) {", phase: "inner" },
    { line: "    if (arr[j] < arr[minIdx]) minIdx = j", phase: "compare" },
    { line: "  }", phase: "inner_end" },
    { line: "  [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]", phase: "swap" },
    { line: "}", phase: "done" },
  ],
  insertion: [
    { line: "for (let i = 1; i < n; i++) {", phase: "outer" },
    { line: "  let key = arr[i], j = i - 1", phase: "init_key" },
    { line: "  while (j >= 0 && arr[j] > key) {", phase: "compare" },
    { line: "    arr[j + 1] = arr[j]; j--", phase: "swap" },
    { line: "  }", phase: "inner_end" },
    { line: "  arr[j + 1] = key", phase: "place" },
    { line: "}", phase: "done" },
  ],
  merge: [
    { line: "function mergeSort(arr, l, r) {", phase: "fn" },
    { line: "  let mid = Math.floor((l + r) / 2)", phase: "split" },
    { line: "  mergeSort(arr, l, mid)", phase: "recurse_left" },
    { line: "  mergeSort(arr, mid+1, r)", phase: "recurse_right" },
    { line: "  // merge left + right halves", phase: "merge" },
    { line: "  while (i < left.len && j < right.len) {", phase: "merge_loop" },
    { line: "    pick smaller, place at k++", phase: "pick" },
    { line: "}", phase: "done" },
  ],
  quick: [
    { line: "function quickSort(arr, l, r) {", phase: "fn" },
    { line: "  let pivot = arr[r]", phase: "pivot" },
    { line: "  for (let j = l; j < r; j++) {", phase: "scan" },
    { line: "    if (arr[j] <= pivot) {", phase: "compare" },
    { line: "      i++; swap(arr, i, j)", phase: "swap" },
    { line: "    }", phase: "inner_end" },
    { line: "  swap(arr, i+1, r)  // place pivot", phase: "place_pivot" },
    { line: "}", phase: "done" },
  ],
  heap: [
    { line: "// Build max-heap from array", phase: "build" },
    { line: "for (let i = n/2-1; i >= 0; i--) heapify()", phase: "heapify_build" },
    { line: "for (let i = n-1; i > 0; i--) {", phase: "extract" },
    { line: "  swap(arr, 0, i)  // extract max", phase: "swap" },
    { line: "  heapify(arr, i, 0)  // restore heap", phase: "heapify_restore" },
    { line: "}", phase: "done" },
  ],
};

function getActiveCodeLine(algo, stepState) {
  if (!stepState || !CODE_SNIPPETS[algo]) return -1;
  const { comparing, swapping, sorted, pivot, merging } = stepState;
  if (sorted && sorted.length > 0 && !comparing && !swapping) return CODE_SNIPPETS[algo].length - 1;
  if (swapping) return CODE_SNIPPETS[algo].findIndex(l => l.phase === "swap");
  if (comparing) return CODE_SNIPPETS[algo].findIndex(l => l.phase === "compare");
  if (pivot !== undefined && pivot !== null) return CODE_SNIPPETS[algo].findIndex(l => l.phase === "pivot");
  if (merging) return CODE_SNIPPETS[algo].findIndex(l => l.phase === "merge");
  return 0;
}

// ─── EXPLANATION ENGINE ───────────────────────────────────────────
const EXPLANATIONS = {
  bubble: {
    outer: (s) => `🔄 Starting pass ${s?.desc?.match(/\d+/) ? parseInt(s.desc.match(/\d+/)[0]) + 1 : 1} — we'll bubble the largest unsorted element to its final position.`,
    compare: (s) => `👀 Comparing two adjacent numbers. The larger one should be on the right. If not, we swap!`,
    swap: (s) => `🔀 These two are out of order — swapping them now. The bigger value "bubbles up" one step.`,
    sorted: () => `✅ This element is in its permanent sorted position. It will never move again.`,
    default: (s) => s?.desc || "Analyzing the array...",
  },
  selection: {
    compare: (s) => `🔍 Scanning for the smallest unsorted element. We track the minimum index as we scan right.`,
    swap: (s) => `📌 Found the minimum! Placing it at the start of the unsorted section.`,
    default: (s) => s?.desc || "Searching for minimum...",
  },
  insertion: {
    compare: (s) => `🃏 This element needs to find its correct position in the already-sorted left portion.`,
    swap: (s) => `➡️ Shifting elements right to create space for insertion.`,
    default: (s) => s?.desc || "Building sorted section...",
  },
  merge: {
    merge: (s) => `🧩 Merging two sorted halves. We compare the front of each half and pick the smaller one.`,
    default: (s) => s?.desc || "Divide and conquer in action...",
  },
  quick: {
    pivot: (s) => `🎯 Pivot selected! All elements smaller go left, larger go right. This is partitioning.`,
    compare: (s) => `🔍 Comparing element with pivot. If smaller, it belongs in the left partition.`,
    swap: (s) => `🔀 This element is smaller than pivot — moving it to the left partition.`,
    default: (s) => s?.desc || "Partitioning around pivot...",
  },
  heap: {
    swap: (s) => `🏔️ Heapify: A parent-child pair is out of heap order — swapping to maintain the max-heap property.`,
    default: (s) => s?.desc || "Maintaining heap structure...",
  },
};

function getExplanation(algo, stepState) {
  if (!stepState) return "Press Play or Step to begin the visualization.";
  const map = EXPLANATIONS[algo] || {};
  if (stepState.sorted?.length > 0 && !stepState.comparing && !stepState.swapping) {
    return map.sorted ? map.sorted(stepState) : `✅ Sorted positions locked in!`;
  }
  if (stepState.swapping && map.swap) return map.swap(stepState);
  if (stepState.comparing && map.compare) return map.compare(stepState);
  if (stepState.pivot !== undefined && stepState.pivot !== null && map.pivot) return map.pivot(stepState);
  if (stepState.merging && map.merge) return map.merge(stepState);
  return (map.default || (() => stepState.desc || ""))(stepState);
}

// ─── HINT SYSTEM ──────────────────────────────────────────────────
const HINTS = {
  bubble: ["Bubble Sort makes n-1 passes. After each pass, at least one more element is in its final place.", "Try watching the 'Comparing' color — those two elements are about to swap if out of order.", "Notice how the sorted (green) section grows from right to left!"],
  selection: ["Selection sort scans the entire unsorted portion to find the minimum.", "After each scan, the minimum is placed at the current start position.", "Selection sort always makes O(n²) comparisons, even if already sorted."],
  insertion: ["Think of insertion sort like sorting playing cards in your hand.", "The left portion is always sorted; we insert each new card in the right place.", "Each element shifts right to make room — that's the swap phase."],
  merge: ["Merge sort divides the array in half repeatedly until single elements remain.", "Merging two sorted arrays is efficient — just compare the front elements!", "The recursion tree has log n levels; each level processes n elements → O(n log n)"],
  quick: ["The pivot ends up in its final sorted position after partitioning.", "Elements ≤ pivot go left, elements > pivot go right.", "Quick sort's weakness: if pivot is always min or max, it degrades to O(n²)"],
  heap: ["A max-heap has every parent ≥ both children.", "Heapify: when a parent < child, swap them and recurse downward.", "We extract the max (root) and shrink the heap size by 1 each iteration."],
};

// ─── NAVIGATION ───────────────────────────────────────────────────
const MODULES = [
  { id: "sorting", label: "Sorting", icon: "⟨⟩", desc: "6 algorithms" },
  { id: "graph", label: "Graph", icon: "◎", desc: "BFS · DFS · Dijkstra" },
  { id: "knapsack", label: "Knapsack", icon: "⬡", desc: "DP Table" },
  { id: "string", label: "String Match", icon: "∿", desc: "KMP · Naive" },
  { id: "complexity", label: "Complexity", icon: "∑", desc: "Reference" },
  { id: "practice", label: "Practice Mode", icon: "◈", desc: "Quizzes & challenges" },
  { id: "builder", label: "Algo Builder", icon: "⬛", desc: "Custom algorithms" },
  { id: "dryrun", label: "Dry Run", icon: "▷", desc: "Trace any code" },
];

function Sidebar({ active, onSelect, analytics }) {
  const xp = calcXP(analytics);
  const { level, title, next } = getLevel(xp);
  const progress = next ? Math.min(100, (xp / next) * 100) : 100;

  return (
    <div style={{
      width: 240, minHeight: "100vh", background: C.surface,
      borderRight: `1px solid ${C.border}`, padding: "0",
      display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontFamily: "monospace", color: "#fff", fontWeight: 700,
            boxShadow: `0 0 16px ${C.accentGlow}`,
          }}>⟨⟩</div>
          <div>
            <div className="oxanium" style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>AlgoEase</div>
            <div style={{ fontSize: 9, color: C.accent, letterSpacing: "2px", textTransform: "uppercase", marginTop: 1 }}>Pro</div>
          </div>
        </div>
      </div>

      {/* XP / Level */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.amber}, ${C.red})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#fff", fontWeight: 800,
            }}>{level}</div>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{title}</span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: C.amber }}>{xp} XP</span>
        </div>
        <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div className="xp-fill" style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
            borderRadius: 2,
          }} />
        </div>
        {next && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{next - xp} XP to next level</div>}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
        {MODULES.map(m => (
          <button key={m.id} className="sidebar-btn" onClick={() => onSelect(m.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 20px",
            color: active === m.id ? C.text : C.textSub,
            background: active === m.id ? `linear-gradient(90deg, ${C.accentGlow}, transparent)` : "transparent",
            borderLeft: active === m.id ? `2px solid ${C.accent}` : "2px solid transparent",
            fontSize: 13, fontWeight: active === m.id ? 600 : 400,
            width: "100%", textAlign: "left",
          }}>
            <span style={{ fontSize: 15, width: 20, textAlign: "center", fontFamily: "monospace" }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{m.desc}</div>
            </div>
            {active === m.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent }} />}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6 }}>Session stats</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 14, color: C.teal, fontWeight: 700 }}>{analytics.totalSteps}</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>steps</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 14, color: C.green, fontWeight: 700 }}>{analytics.practiceCorrect}</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>correct</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 14, color: C.amber, fontWeight: 700 }}>{Object.keys(analytics.algoVisited).length}</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>algos</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED CONTROLS ──────────────────────────────────────────────
function ControlBar({ playing, onPlay, onPause, onStep, onReset, speed, onSpeed, extra }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      flexWrap: "wrap",
    }}>
      <div className="tooltip-wrap">
        <Btn onClick={onReset} label="↺ Reset" />
        <span className="tooltip">Reset to initial state</span>
      </div>
      <div className="tooltip-wrap">
        <Btn onClick={playing ? onPause : onPlay} label={playing ? "⏸ Pause" : "▶ Play"} accent />
        <span className="tooltip">{playing ? "Pause animation" : "Start animation"}</span>
      </div>
      <div className="tooltip-wrap">
        <Btn onClick={onStep} label="⏭ Step" disabled={playing} />
        <span className="tooltip">Advance one step</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
        <span style={{ fontSize: 12, color: C.textSub, whiteSpace: "nowrap" }}>Speed</span>
        <input type="range" min="1" max="10" value={speed}
          onChange={e => onSpeed(+e.target.value)} style={{ width: 80 }} />
        <span className="mono" style={{ fontSize: 12, color: C.accent, minWidth: 24 }}>{speed}x</span>
      </div>
      {extra}
    </div>
  );
}

function Btn({ onClick, label, accent, disabled, danger, small, style: s }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: small ? "5px 10px" : "8px 16px",
        borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 600,
        background: accent ? (hovered ? C.accentHover : C.accent)
          : danger ? `${C.red}22`
          : hovered ? C.cardHover : C.card,
        color: accent ? "#fff" : danger ? C.red : C.text,
        border: `1px solid ${accent ? "transparent" : danger ? `${C.red}44` : C.border}`,
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.15s",
        fontFamily: "inherit",
        boxShadow: accent && hovered ? `0 0 16px ${C.accentGlow}` : "none",
        ...s,
      }}>{label}</button>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: `${color}18`, color: color, border: `1px solid ${color}33`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>{label}</span>
  );
}

function InfoPanel({ title, rows, accent }) {
  return (
    <div className="metric-card" style={{
      background: C.card, border: `1px solid ${accent ? `${C.accent}44` : C.border}`,
      borderRadius: 12, padding: "14px 18px", minWidth: 180,
      boxShadow: accent ? `0 0 20px ${C.accentGlow}` : "none",
    }}>
      <div style={{ fontSize: 11, color: C.textSub, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{title}</div>
      {rows.map(([k, v, vc], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: C.textSub }}>{k}</span>
          <span className="mono" style={{ fontSize: 13, color: vc || C.teal, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── EXPLANATION PANEL ────────────────────────────────────────────
function ExplanationPanel({ text, stepNum, total }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card}, ${C.surface})`,
      border: `1px solid ${C.accent}33`,
      borderRadius: 12, padding: "14px 18px", marginBottom: 16,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${C.accent}, ${C.purple})`,
        borderRadius: "12px 0 0 12px",
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            💡 Explanation
          </span>
          {total > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 10, color: C.textMuted }}>Step {stepNum}/{total}</span>
              <div style={{ width: 60, height: 3, background: C.border, borderRadius: 2 }}>
                <div style={{ width: `${(stepNum / total) * 100}%`, height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

// ─── HINT PANEL ───────────────────────────────────────────────────
function HintPanel({ algo, onUsed }) {
  const [shown, setShown] = useState(false);
  const [idx, setIdx] = useState(0);
  const hints = HINTS[algo] || [];
  if (!hints.length) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      {!shown ? (
        <button onClick={() => { setShown(true); onUsed && onUsed(); }} style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.amber,
          background: `${C.amber}11`, border: `1px solid ${C.amber}33`,
          padding: "7px 14px", borderRadius: 8, fontFamily: "inherit", fontWeight: 600,
          transition: "all 0.15s",
        }}>
          <span>💡</span> Show Hint (-5 XP)
        </button>
      ) : (
        <div className="hint-box" style={{
          background: `${C.amber}0d`, border: `1px solid ${C.amber}33`,
          borderRadius: 10, padding: "12px 16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.amber, fontWeight: 700 }}>💡 HINT {idx + 1}/{hints.length}</span>
            <button onClick={() => setIdx((idx + 1) % hints.length)} style={{
              fontSize: 11, color: C.textSub, background: C.card,
              padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: "inherit",
            }}>Next hint →</button>
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{hints[idx]}</div>
        </div>
      )}
    </div>
  );
}

// ─── CODE SYNC PANEL ──────────────────────────────────────────────
function CodeSyncPanel({ algo, activeLine, onLineClick }) {
  const lines = CODE_SNIPPETS[algo] || [];
  if (!lines.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: "hidden", marginTop: 16,
    }}>
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>
          ⌥ Code — click a line to jump
        </span>
        <Badge label="LIVE SYNC" color={C.teal} />
      </div>
      <div style={{ padding: "10px 8px" }}>
        {lines.map((l, i) => (
          <div key={i} className={`code-line mono ${i === activeLine ? "active" : ""}`}
            onClick={() => onLineClick && onLineClick(i)}
            style={{
              fontSize: 12, color: i === activeLine ? C.text : C.textSub,
              display: "block", marginBottom: 2, cursor: "pointer",
              background: i === activeLine ? `${C.accent}18` : "transparent",
              borderLeft: i === activeLine ? `2px solid ${C.accent}` : "2px solid transparent",
              paddingLeft: i === activeLine ? "10px" : "12px",
            }}>
            <span style={{ color: C.textMuted, marginRight: 10, userSelect: "none", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
            {l.line}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RECOMMENDATION BANNER ────────────────────────────────────────
function RecommendationBanner({ analytics, onNavigate }) {
  const rec = getRecommendation(analytics);
  if (!rec.reason) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.accent}11, ${C.purple}11)`,
      border: `1px solid ${C.accent}33`,
      borderRadius: 12, padding: "12px 18px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ fontSize: 24 }}>🤖</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 3 }}>ADAPTIVE RECOMMENDATION</div>
        <div style={{ fontSize: 13, color: C.text }}>{rec.reason}</div>
      </div>
      {rec.module && (
        <Btn onClick={() => onNavigate(rec.module)} label="→ Try it" accent small />
      )}
    </div>
  );
}

// ─── ALGORITHM CONFIGS ────────────────────────────────────────────
const SORT_ALGOS = {
  bubble: {
    name: "Bubble Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    gen: function*(arr) {
      let a = [...arr], n = a.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          yield { arr: [...a], comparing: [j, j + 1], swapping: null, sorted: Array.from({length: i}, (_, k) => n - 1 - k), desc: `Comparing a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`, phase: "compare" };
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            yield { arr: [...a], comparing: null, swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k), desc: `Swapped a[${j}] and a[${j+1}]`, phase: "swap" };
          }
        }
      }
      yield { arr: [...a], comparing: null, swapping: null, sorted: Array.from({length: n}, (_, i) => i), desc: "Array sorted!", phase: "done" };
    }
  },
  selection: {
    name: "Selection Sort", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Repeatedly finds the minimum element and places it at the beginning.",
    gen: function*(arr) {
      let a = [...arr], n = a.length, sortedIdx = [];
      for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
          yield { arr: [...a], comparing: [min, j], swapping: null, sorted: [...sortedIdx], desc: `Looking for minimum in range [${i}..${n-1}], current min at ${min}`, phase: "compare" };
          if (a[j] < a[min]) min = j;
        }
        if (min !== i) {
          [a[i], a[min]] = [a[min], a[i]];
          yield { arr: [...a], comparing: null, swapping: [i, min], sorted: [...sortedIdx], desc: `Placed minimum ${a[i]} at position ${i}`, phase: "swap" };
        }
        sortedIdx.push(i);
      }
      sortedIdx.push(n - 1);
      yield { arr: [...a], comparing: null, swapping: null, sorted: sortedIdx, desc: "Array sorted!", phase: "done" };
    }
  },
  insertion: {
    name: "Insertion Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Builds sorted array one item at a time by inserting into correct position.",
    gen: function*(arr) {
      let a = [...arr], n = a.length;
      yield { arr: [...a], comparing: null, swapping: null, sorted: [0], desc: "First element is trivially sorted", phase: "init" };
      for (let i = 1; i < n; i++) {
        let key = a[i], j = i - 1;
        yield { arr: [...a], comparing: [i, j], swapping: null, sorted: Array.from({length: i}, (_, k) => k), desc: `Inserting ${key} into sorted portion`, phase: "compare" };
        while (j >= 0 && a[j] > key) {
          a[j + 1] = a[j];
          yield { arr: [...a], comparing: null, swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => k), desc: `Shifting ${a[j+1]} right to make room`, phase: "swap" };
          j--;
        }
        a[j + 1] = key;
        yield { arr: [...a], comparing: null, swapping: null, sorted: Array.from({length: i + 1}, (_, k) => k), desc: `Placed ${key} at position ${j + 1}`, phase: "place" };
      }
      yield { arr: [...a], comparing: null, swapping: null, sorted: Array.from({length: n}, (_, i) => i), desc: "Array sorted!", phase: "done" };
    }
  },
  merge: {
    name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)",
    desc: "Divides array into halves, recursively sorts, then merges sorted halves.",
    gen: function*(arr) {
      let a = [...arr], steps = [];
      function mergeSort(arr, l, r) {
        if (l >= r) return;
        let mid = Math.floor((l + r) / 2);
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        let left = arr.slice(l, mid + 1), right = arr.slice(mid + 1, r + 1);
        let i = 0, j = 0, k = l;
        steps.push({ arr: [...arr], range: [l, r], merging: [l, mid, r], desc: `Merging [${l}..${mid}] and [${mid+1}..${r}]`, phase: "merge" });
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) { arr[k++] = left[i++]; }
          else { arr[k++] = right[j++]; }
          steps.push({ arr: [...arr], range: [l, r], merging: [l, mid, r], desc: `Placing element at position ${k-1}`, phase: "merge" });
        }
        while (i < left.length) { arr[k++] = left[i++]; steps.push({ arr: [...arr], range: [l, r], merging: [l, mid, r], desc: "Copying remaining left elements", phase: "merge" }); }
        while (j < right.length) { arr[k++] = right[j++]; steps.push({ arr: [...arr], range: [l, r], merging: [l, mid, r], desc: "Copying remaining right elements", phase: "merge" }); }
      }
      mergeSort(a, 0, a.length - 1);
      steps.push({ arr: [...a], merging: null, range: null, sorted: Array.from({length: a.length}, (_, i) => i), desc: "Array sorted!", phase: "done" });
      for (let s of steps) yield s;
    }
  },
  quick: {
    name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)",
    desc: "Picks a pivot, partitions array around it, recursively sorts partitions.",
    gen: function*(arr) {
      let a = [...arr], steps = [];
      function quickSort(arr, l, r) {
        if (l >= r) return;
        let pivot = arr[r], i = l - 1;
        steps.push({ arr: [...arr], pivot: r, comparing: null, desc: `Pivot = ${pivot} at index ${r}`, phase: "pivot" });
        for (let j = l; j < r; j++) {
          steps.push({ arr: [...arr], pivot: r, comparing: [i + 1, j], desc: `Comparing a[${j}]=${arr[j]} with pivot ${pivot}`, phase: "compare" });
          if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            if (i !== j) steps.push({ arr: [...arr], pivot: r, swapping: [i, j], desc: `Swapped a[${i}]=${arr[i]} and a[${j}]=${arr[j]}`, phase: "swap" });
          }
        }
        [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
        steps.push({ arr: [...arr], pivot: i + 1, swapping: [i + 1, r], desc: `Placed pivot ${pivot} at position ${i + 1}`, phase: "place_pivot" });
        quickSort(arr, l, i);
        quickSort(arr, i + 2, r);
      }
      quickSort(a, 0, a.length - 1);
      steps.push({ arr: [...a], pivot: null, sorted: Array.from({length: a.length}, (_, i) => i), desc: "Array sorted!", phase: "done" });
      for (let s of steps) yield s;
    }
  },
  heap: {
    name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)",
    desc: "Builds a max-heap, then repeatedly extracts max element.",
    gen: function*(arr) {
      let a = [...arr], n = a.length, steps = [];
      function heapify(arr, n, i) {
        let largest = i, l = 2*i+1, r = 2*i+2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          steps.push({ arr: [...arr], comparing: [i, largest], desc: `Heapify: swapped ${arr[i]} and ${arr[largest]}`, phase: "swap" });
          heapify(arr, n, largest);
        }
      }
      for (let i = Math.floor(n/2)-1; i >= 0; i--) {
        steps.push({ arr: [...a], comparing: [i, -1], desc: `Building heap: heapifying at ${i}`, phase: "build" });
        heapify(a, n, i);
      }
      let sortedIdx = [];
      for (let i = n-1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        sortedIdx.push(i);
        steps.push({ arr: [...a], swapping: [0, i], sorted: [...sortedIdx], desc: `Extracted max ${a[i]}, placed at ${i}`, phase: "swap" });
        heapify(a, i, 0);
      }
      sortedIdx.push(0);
      steps.push({ arr: [...a], sorted: sortedIdx, desc: "Array sorted!", phase: "done" });
      for (let s of steps) yield s;
    }
  }
};

// ─── SORTING VISUALIZER ───────────────────────────────────────────
function SortingVisualizer({ analytics, dispatch, onNavigate }) {
  const [algo, setAlgo] = useState("merge");
  const [arrSize, setArrSize] = useState(20);
  const [array, setArray] = useState(() => genArr(20));
  const [stepState, setStepState] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [stepCount, setStepCount] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const genRef = useRef(null);
  const timerRef = useRef(null);
  const [done, setDone] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const allStepsRef = useRef([]);

  function genArr(n) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
  }

  function reset() {
    clearInterval(timerRef.current);
    setPlaying(false);
    const a = customInput.trim()
      ? customInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n)).slice(0, 40)
      : genArr(arrSize);
    setArray(a);
    const gen = SORT_ALGOS[algo].gen(a);
    allStepsRef.current = [];
    let r;
    while (!(r = gen.next()).done) allStepsRef.current.push(r.value);
    setTotalSteps(allStepsRef.current.length);
    genRef.current = SORT_ALGOS[algo].gen(a);
    setStepState(null);
    setStepCount(0);
    setDone(false);
    dispatch({ type: "VISIT_ALGO", algo });
  }

  useEffect(() => { reset(); }, [algo, arrSize]);

  function doStep() {
    if (!genRef.current) return false;
    const res = genRef.current.next();
    if (res.done) { setDone(true); return false; }
    setStepState(res.value);
    setStepCount(c => c + 1);
    dispatch({ type: "STEP" });
    return true;
  }

  useEffect(() => {
    if (playing) {
      dispatch({ type: "PLAY_PAUSE" });
      timerRef.current = setInterval(() => {
        if (!doStep()) { setPlaying(false); clearInterval(timerRef.current); }
      }, Math.max(30, 600 / speed));
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed]);

  const cfg = SORT_ALGOS[algo];
  const displayArr = stepState ? stepState.arr : array;
  const maxVal = Math.max(...displayArr, 1);
  const activeLine = getActiveCodeLine(algo, stepState);
  const explanation = getExplanation(algo, stepState);

  function barColor(i) {
    if (stepState?.sorted?.includes(i)) return C.green;
    if (stepState?.swapping?.includes(i)) return C.red;
    if (stepState?.comparing?.includes(i)) return C.amber;
    if (stepState?.pivot === i) return C.teal;
    if (stepState?.merging && i >= stepState.merging[0] && i <= stepState.merging[2]) return C.accent;
    return C.muted;
  }

  function barGlow(i) {
    if (stepState?.swapping?.includes(i)) return `0 0 8px ${C.redGlow}`;
    if (stepState?.comparing?.includes(i)) return `0 0 8px ${C.amberGlow}`;
    if (stepState?.pivot === i) return `0 0 8px ${C.tealGlow}`;
    if (stepState?.sorted?.includes(i)) return `0 0 4px ${C.greenGlow}`;
    return "none";
  }

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <RecommendationBanner analytics={analytics} onNavigate={onNavigate} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: "'Oxanium', sans-serif" }}>{cfg.name}</div>
          <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>{cfg.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge label={cfg.avg} color={cfg.avg.includes("²") ? C.red : cfg.avg.includes("log") ? C.amber : C.green} />
          <Btn small label={showCode ? "Hide Code" : "Show Code"} onClick={() => setShowCode(v => !v)} />
        </div>
      </div>

      {/* Algorithm Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.entries(SORT_ALGOS).map(([k, v]) => (
          <button key={k} onClick={() => setAlgo(k)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: algo === k ? C.accent : C.card,
            color: algo === k ? "#fff" : C.textSub,
            border: `1px solid ${algo === k ? C.accent : C.border}`,
            transition: "all 0.2s", fontFamily: "inherit",
            boxShadow: algo === k ? `0 0 12px ${C.accentGlow}` : "none",
          }}>{v.name}</button>
        ))}
      </div>

      {/* Config Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.textSub }}>Size</span>
          <input type="range" min="5" max="40" value={arrSize}
            onChange={e => setArrSize(+e.target.value)} style={{ width: 80 }} />
          <span className="mono" style={{ fontSize: 12, color: C.accent }}>{arrSize}</span>
        </div>
        <input type="text" placeholder="Custom: 5 3 8 1 ..." value={customInput}
          onChange={e => setCustomInput(e.target.value)} style={{ width: 180 }} />
        <Btn onClick={reset} label="🔀 New Array" small />
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Main visualization */}
        <div style={{ flex: 1 }}>
          {/* Bars */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: "20px 16px", marginBottom: 14, position: "relative", minHeight: 200,
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 180, justifyContent: "center" }}>
              {displayArr.map((v, i) => (
                <div key={i} className="practice-bar" style={{
                  flex: 1, maxWidth: 36, height: `${(v / maxVal) * 100}%`,
                  background: `linear-gradient(180deg, ${barColor(i)}, ${barColor(i)}99)`,
                  borderRadius: "4px 4px 0 0",
                  transition: `height 0.08s ease, background 0.12s`,
                  position: "relative", minWidth: 4,
                  boxShadow: barGlow(i),
                }}>
                  {displayArr.length <= 20 && (
                    <span style={{
                      position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                      fontSize: 9, color: C.textSub, fontFamily: "monospace"
                    }}>{v}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              {[["Comparing", C.amber], ["Swapping", C.red], ["Sorted", C.green], ["Pivot", C.teal], ["Active range", C.accent], ["Idle", C.muted]].map(([l, c]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textSub }}>
                  <span style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />{l}
                </span>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <ExplanationPanel text={explanation} stepNum={stepCount} total={totalSteps} />
          <HintPanel algo={algo} onUsed={() => dispatch({ type: "HINT_USED" })} />

          {done && (
            <div className="completion-glow" style={{
              background: `${C.green}11`, border: `1px solid ${C.green}44`, borderRadius: 10,
              padding: "12px 18px", marginBottom: 14, fontSize: 13, color: C.green, fontWeight: 600,
            }}>🎉 Sorted in {stepCount} steps! +{stepCount * 2} XP earned</div>
          )}

          <ControlBar playing={playing} onPlay={() => { if (done) reset(); setPlaying(true); }}
            onPause={() => setPlaying(false)}
            onStep={() => { if (done) return; doStep(); }}
            onReset={reset} speed={speed} onSpeed={setSpeed} />

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <InfoPanel title="Complexity" rows={[
              ["Best", cfg.best, cfg.best === "O(n)" ? C.green : C.amber],
              ["Average", cfg.avg, cfg.avg.includes("²") ? C.red : C.amber],
              ["Worst", cfg.worst, cfg.worst.includes("²") ? C.red : C.amber],
              ["Space", cfg.space],
            ]} />
            <InfoPanel title="Progress" rows={[
              ["Steps", stepCount],
              ["Total steps", totalSteps],
              ["Array size", displayArr.length],
              ["Status", done ? "Sorted ✓" : playing ? "Running…" : "Paused"],
            ]} />
          </div>

          <ComplexityCompareChart />
        </div>

        {/* Code Panel */}
        {showCode && (
          <div style={{ width: 280, flexShrink: 0 }}>
            <CodeSyncPanel algo={algo} activeLine={activeLine} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPLEXITY COMPARISON CHART ─────────────────────────────────
function ComplexityCompareChart() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const N = 100;
    const fns = [
      { label: "O(n²)", fn: n => n * n, color: C.red },
      { label: "O(n log n)", fn: n => n * Math.log2(n), color: C.accent },
      { label: "O(n)", fn: n => n, color: C.green },
      { label: "O(log n)", fn: n => Math.log2(n), color: C.teal },
    ];
    const maxY = fns[0].fn(N);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = C.border; ctx.lineWidth = 0.5;
    [0.25, 0.5, 0.75, 1].forEach(f => {
      ctx.beginPath(); ctx.moveTo(40, H * (1 - f) - 10); ctx.lineTo(W - 10, H * (1 - f) - 10); ctx.stroke();
    });
    fns.forEach(({ fn, color, label }) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
      for (let i = 1; i <= N; i++) {
        const x = 40 + (i / N) * (W - 50);
        const y = H - 10 - (fn(i) / maxY) * (H - 30);
        i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      const lx = 40 + (N / N) * (W - 50) + 4;
      const ly = H - 10 - (fn(N) / maxY) * (H - 30);
      ctx.fillStyle = color; ctx.font = "10px JetBrains Mono";
      ctx.fillText(label, Math.min(lx, W - 60), Math.max(12, ly));
    });
    ctx.fillStyle = C.textSub; ctx.font = "10px JetBrains Mono";
    ctx.fillText("n →", W - 25, H - 2); ctx.fillText("ops", 2, 14);
  }, []);
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Growth Curves</div>
      <canvas ref={canvasRef} width={560} height={180}
        style={{ borderRadius: 10, border: `1px solid ${C.border}`, display: "block", maxWidth: "100%" }} />
    </div>
  );
}

// ─── GRAPH VISUALIZER ─────────────────────────────────────────────
function GraphVisualizer({ analytics, dispatch }) {
  const canvasRef = useRef(null);
  const [algo, setAlgo] = useState("bfs");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const timerRef = useRef(null);
  const [startNode, setStartNode] = useState(0);
  const [info, setInfo] = useState("");

  const NODES = [
    { id: 0, x: 0.5, y: 0.15 }, { id: 1, x: 0.2, y: 0.4 }, { id: 2, x: 0.8, y: 0.4 },
    { id: 3, x: 0.1, y: 0.7 }, { id: 4, x: 0.4, y: 0.72 }, { id: 5, x: 0.7, y: 0.72 }, { id: 6, x: 0.9, y: 0.55 },
  ];
  const EDGES = [[0, 1, 4], [0, 2, 3], [1, 3, 5], [1, 4, 2], [2, 5, 6], [2, 6, 1], [3, 4, 3], [4, 5, 4], [5, 6, 2]];

  function buildAdj() {
    const adj = {};
    NODES.forEach(n => adj[n.id] = []);
    EDGES.forEach(([u, v, w]) => { adj[u].push({ to: v, w }); adj[v].push({ to: u, w }); });
    return adj;
  }

  function genBFS(src) {
    const adj = buildAdj(), steps = [], visited = new Set(), queue = [src], prev = {};
    visited.add(src);
    steps.push({ visited: new Set(visited), queue: [...queue], current: src, path: [], desc: `Start BFS from node ${src}` });
    while (queue.length) {
      const u = queue.shift();
      for (const { to } of adj[u]) {
        if (!visited.has(to)) {
          visited.add(to); queue.push(to); prev[to] = u;
          steps.push({ visited: new Set(visited), queue: [...queue], current: to, prev: { ...prev }, desc: `Visiting node ${to} from ${u}` });
        }
      }
    }
    steps.push({ visited: new Set(visited), queue: [], current: -1, prev, desc: `BFS complete! Visited: ${[...visited].join(" → ")}` });
    return steps;
  }

  function genDFS(src) {
    const adj = buildAdj(), steps = [], visited = new Set();
    function dfs(u, from) {
      visited.add(u);
      steps.push({ visited: new Set(visited), current: u, from, desc: `DFS: visiting node ${u}${from !== undefined ? ` from ${from}` : ''}` });
      for (const { to } of adj[u]) { if (!visited.has(to)) dfs(to, u); }
    }
    dfs(src);
    steps.push({ visited: new Set(visited), current: -1, desc: `DFS complete! Order: ${[...visited].join(" → ")}` });
    return steps;
  }

  function genDijkstra(src) {
    const adj = buildAdj(), steps = [], dist = {}, prev = {}, unvisited = new Set(NODES.map(n => n.id));
    NODES.forEach(n => dist[n.id] = Infinity);
    dist[src] = 0;
    steps.push({ dist: { ...dist }, visited: new Set(), current: src, desc: `Init Dijkstra from ${src}` });
    while (unvisited.size) {
      let u = [...unvisited].reduce((a, b) => dist[a] < dist[b] ? a : b);
      if (dist[u] === Infinity) break;
      unvisited.delete(u);
      const visited = new Set(NODES.map(n => n.id).filter(id => !unvisited.has(id)));
      steps.push({ dist: { ...dist }, visited, current: u, prev: { ...prev }, desc: `Processing node ${u} (dist=${dist[u]})` });
      for (const { to, w } of adj[u]) {
        const alt = dist[u] + w;
        if (alt < dist[to]) {
          dist[to] = alt; prev[to] = u;
          steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, prev: { ...prev }, relaxed: to, desc: `Relaxed edge ${u}→${to}: new dist=${alt}` });
        }
      }
    }
    steps.push({ dist: { ...dist }, visited: new Set(NODES.map(n => n.id)), current: -1, prev, desc: `Dijkstra complete!` });
    return steps;
  }

  function reset() {
    clearInterval(timerRef.current);
    setPlaying(false);
    const s = algo === "bfs" ? genBFS(startNode) : algo === "dfs" ? genDFS(startNode) : genDijkstra(startNode);
    setSteps(s); setStepIdx(0); setInfo("");
    dispatch({ type: "VISIT_ALGO", algo });
  }

  useEffect(() => { reset(); }, [algo, startNode]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i + 1 >= steps.length) { setPlaying(false); clearInterval(timerRef.current); return i; }
          dispatch({ type: "STEP" });
          return i + 1;
        });
      }, Math.max(200, 1200 / speed));
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps]);

  useEffect(() => { if (steps[stepIdx]) setInfo(steps[stepIdx].desc); }, [stepIdx, steps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, W, H);
    const state = steps[stepIdx] || {};
    const visited = state.visited || new Set();
    const current = state.current;
    const dist = state.dist || {};
    const relaxed = state.relaxed;
    const nodePos = (id) => ({ x: NODES[id].x * (W - 60) + 30, y: NODES[id].y * (H - 60) + 30 });

    EDGES.forEach(([u, v, w]) => {
      const a = nodePos(u), b = nodePos(v);
      const isActive = (visited.has(u) && visited.has(v));
      ctx.beginPath();
      ctx.strokeStyle = isActive ? `${C.accent}99` : C.border;
      ctx.lineWidth = isActive ? 2.5 : 1;
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.fillStyle = C.textSub; ctx.font = "10px JetBrains Mono";
      ctx.fillText(w, (a.x + b.x) / 2 - 4, (a.y + b.y) / 2 - 4);
    });

    NODES.forEach(({ id }) => {
      const { x, y } = nodePos(id);
      const r = id === current ? 22 : 18;
      if (id === current) {
        ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = `${C.teal}22`; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      if (id === current) ctx.fillStyle = C.teal;
      else if (id === relaxed) ctx.fillStyle = C.amber;
      else if (visited.has(id)) ctx.fillStyle = C.accent;
      else ctx.fillStyle = C.surface;
      ctx.fill();
      ctx.strokeStyle = id === current ? C.teal : visited.has(id) ? C.accent : C.border;
      ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = visited.has(id) || id === current ? "#fff" : C.textSub;
      ctx.font = `${id === current ? "700" : "500"} 13px JetBrains Mono`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(id, x, y);
      if (algo === "dijkstra" && dist[id] !== undefined) {
        ctx.fillStyle = C.amber; ctx.font = "9px JetBrains Mono";
        ctx.fillText(dist[id] === Infinity ? "∞" : dist[id], x, y + r + 10);
      }
    });
  }, [stepIdx, steps, algo]);

  const algos = [
    { id: "bfs", name: "BFS", best: "O(V+E)", space: "O(V)" },
    { id: "dfs", name: "DFS", best: "O(V+E)", space: "O(V)" },
    { id: "dijkstra", name: "Dijkstra", best: "O(V²)", space: "O(V)" },
  ];

  const graphExplanations = {
    bfs: "BFS explores layer by layer using a queue. It guarantees shortest path by hop count.",
    dfs: "DFS dives deep along one path before backtracking. Great for detecting cycles and topological sort.",
    dijkstra: "Dijkstra picks the minimum-distance unvisited node each step, greedily building shortest paths.",
  };

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Oxanium', sans-serif" }}>Graph Algorithms</div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 18 }}>Interactive traversal and shortest path visualization on a weighted undirected graph.</div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {algos.map(a => (
          <button key={a.id} onClick={() => setAlgo(a.id)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: algo === a.id ? C.accent : C.card,
            color: algo === a.id ? "#fff" : C.textSub,
            border: `1px solid ${algo === a.id ? C.accent : C.border}`,
            transition: "all 0.2s", fontFamily: "inherit",
            boxShadow: algo === a.id ? `0 0 12px ${C.accentGlow}` : "none",
          }}>{a.name}</button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 12, color: C.textSub }}>Start:</span>
          <select value={startNode} onChange={e => setStartNode(+e.target.value)}>
            {NODES.map(n => <option key={n.id} value={n.id}>Node {n.id}</option>)}
          </select>
        </div>
      </div>

      <ExplanationPanel text={graphExplanations[algo]} stepNum={stepIdx + 1} total={steps.length} />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <canvas ref={canvasRef} width={480} height={340}
          style={{ borderRadius: 14, border: `1px solid ${C.border}`, maxWidth: "100%" }} />
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Legend</div>
            {[["Current node", C.teal], ["Visited", C.accent], ["Relaxed", C.amber], ["Unvisited", C.surface]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: `1px solid ${C.border}` }} />
                <span style={{ fontSize: 12, color: C.textSub }}>{l}</span>
              </div>
            ))}
          </div>
          <InfoPanel title="Step Info" rows={[
            ["Step", `${stepIdx + 1} / ${steps.length}`],
            ["Algorithm", algo.toUpperCase()],
            ["Time", algos.find(a => a.id === algo)?.best],
            ["Space", algos.find(a => a.id === algo)?.space],
          ]} />
        </div>
      </div>

      {info && (
        <div style={{
          background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 10,
          padding: "10px 16px", margin: "14px 0", fontSize: 13, color: C.text,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: C.accent, marginRight: 8 }}>→</span>{info}
        </div>
      )}

      <ControlBar playing={playing}
        onPlay={() => { if (stepIdx >= steps.length - 1) reset(); setPlaying(true); dispatch({ type: "PLAY_PAUSE" }); }}
        onPause={() => setPlaying(false)}
        onStep={() => { setStepIdx(i => Math.min(i + 1, steps.length - 1)); dispatch({ type: "STEP" }); }}
        onReset={reset} speed={speed} onSpeed={setSpeed} />
    </div>
  );
}

// ─── KNAPSACK VISUALIZER ─────────────────────────────────────────
function KnapsackVisualizer({ dispatch }) {
  const [weights, setWeights] = useState("2 3 4 5");
  const [values, setValues] = useState("3 4 5 6");
  const [capacity, setCapacity] = useState(8);
  const [stepIdx, setStepIdx] = useState(-1);
  const [steps, setSteps] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [table, setTable] = useState(null);
  const timerRef = useRef(null);

  function buildSteps(W, V, Cap) {
    const n = W.length, steps = [], dp = Array.from({ length: n + 1 }, () => new Array(Cap + 1).fill(0));
    steps.push({ dp: dp.map(r => [...r]), i: 0, w: 0, desc: `Initialize DP table: dp[0..${n}][0..${Cap}] = 0` });
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j <= Cap; j++) {
        if (W[i-1] <= j) {
          dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j - W[i-1]] + V[i-1]);
          steps.push({ dp: dp.map(r => [...r]), i, j, desc: `Item ${i} (w=${W[i-1]}, v=${V[i-1]}): dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i-1][j-W[i-1]]+V[i-1]}) = ${dp[i][j]}` });
        } else {
          dp[i][j] = dp[i-1][j];
          steps.push({ dp: dp.map(r => [...r]), i, j, desc: `Item ${i} too heavy for cap ${j}: carry forward ${dp[i][j]}` });
        }
      }
    }
    let i = n, j = Cap, selected = [];
    while (i > 0 && j > 0) {
      if (dp[i][j] !== dp[i-1][j]) { selected.push(i - 1); j -= W[i-1]; }
      i--;
    }
    steps.push({ dp: dp.map(r => [...r]), i: -1, j: -1, selected, desc: `Optimal value = ${dp[n][Cap]}. Selected items: [${selected.map(x => x + 1).join(', ')}]` });
    return { steps, dp };
  }

  function reset() {
    clearInterval(timerRef.current); setPlaying(false);
    const W = weights.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 8);
    const V = values.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 8);
    const Cap = Math.max(1, Math.min(capacity, 15));
    if (!W.length || !V.length) return;
    const len = Math.min(W.length, V.length);
    const { steps, dp } = buildSteps(W.slice(0, len), V.slice(0, len), Cap);
    setSteps(steps); setTable({ W: W.slice(0, len), V: V.slice(0, len), Cap, dp }); setStepIdx(0);
    dispatch({ type: "VISIT_ALGO", algo: "knapsack" });
  }

  useEffect(() => { reset(); }, []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i + 1 >= steps.length) { setPlaying(false); clearInterval(timerRef.current); return i; }
          dispatch({ type: "STEP" });
          return i + 1;
        });
      }, Math.max(100, 1000 / speed));
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps]);

  const cur = steps[stepIdx];
  const dp = cur?.dp;

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Oxanium', sans-serif" }}>0/1 Knapsack — DP Table</div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 18 }}>Watch the DP table fill cell by cell. Each cell dp[i][j] = max value using first i items with capacity j.</div>

      <ExplanationPanel text={cur?.desc || "Configure items and click Build to start."} stepNum={stepIdx + 1} total={steps.length} />

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Weights</div>
          <input type="text" value={weights} onChange={e => setWeights(e.target.value)} style={{ width: 180 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Values</div>
          <input type="text" value={values} onChange={e => setValues(e.target.value)} style={{ width: 180 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Capacity</div>
          <input type="number" value={capacity} min="1" max="15" onChange={e => setCapacity(+e.target.value)} style={{ width: 70 }} />
        </div>
        <Btn onClick={reset} label="▶ Build" accent />
      </div>

      {table && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {table.W.map((w, i) => (
            <div key={i} style={{
              background: cur?.selected?.includes(i) ? `${C.teal}18` : C.card,
              border: `1px solid ${cur?.selected?.includes(i) ? C.teal : C.border}`,
              borderRadius: 10, padding: "8px 14px", textAlign: "center",
              transition: "all 0.3s",
              boxShadow: cur?.selected?.includes(i) ? `0 0 12px ${C.tealGlow}` : "none",
            }}>
              <div style={{ fontSize: 10, color: C.textSub, marginBottom: 2 }}>Item {i + 1}</div>
              <div className="mono" style={{ fontSize: 13, color: C.text }}>w={w}, v={table.V[i]}</div>
              {cur?.selected?.includes(i) && <div style={{ fontSize: 10, color: C.teal, marginTop: 2 }}>✓ Selected</div>}
            </div>
          ))}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px" }}>
            <div style={{ fontSize: 10, color: C.textSub, marginBottom: 2 }}>Capacity</div>
            <div className="mono" style={{ fontSize: 13, color: C.amber }}>{table.Cap}</div>
          </div>
        </div>
      )}

      {dp && (
        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table style={{ borderCollapse: "collapse", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 10px", background: C.card, color: C.textSub, border: `1px solid ${C.border}`, minWidth: 60 }}>i\c</th>
                {Array.from({ length: (table?.Cap || 0) + 1 }, (_, j) => (
                  <th key={j} style={{ padding: "6px 10px", background: cur?.j === j ? `${C.accent}22` : C.card, color: cur?.j === j ? C.accent : C.textSub, border: `1px solid ${C.border}`, minWidth: 40 }}>{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "5px 10px", background: cur?.i === i ? `${C.accent}22` : C.surface, color: cur?.i === i ? C.accent : C.textSub, border: `1px solid ${C.border}`, fontWeight: 700 }}>
                    {i === 0 ? "∅" : `Item ${i}`}
                  </td>
                  {row.map((v, j) => {
                    const isActive = cur?.i === i && cur?.j === j;
                    const isSelected = cur?.selected && i > 0 && cur.selected.includes(i - 1);
                    return (
                      <td key={j} style={{
                        padding: "5px 10px", border: `1px solid ${C.border}`,
                        background: isActive ? `${C.teal}33` : C.card,
                        color: isActive ? C.teal : v > 0 ? C.text : C.textMuted,
                        fontWeight: isActive ? 700 : 400,
                        transition: "all 0.2s",
                      }}>{v}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ControlBar playing={playing}
        onPlay={() => { if (stepIdx >= steps.length - 1) reset(); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onStep={() => setStepIdx(i => Math.min(i + 1, steps.length - 1))}
        onReset={reset} speed={speed} onSpeed={setSpeed} />

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <InfoPanel title="Knapsack DP" rows={[["Time", "O(nW)"], ["Space", "O(nW)"], ["Type", "Bottom-Up"]]} />
      </div>
    </div>
  );
}

// ─── STRING VISUALIZER ────────────────────────────────────────────
function StringVisualizer({ dispatch }) {
  const [algo, setAlgo] = useState("kmp");
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const timerRef = useRef(null);

  function genNaive(T, P) {
    const steps = [], n = T.length, m = P.length;
    for (let i = 0; i <= n - m; i++) {
      let j = 0;
      steps.push({ i, j: 0, matches: [], checking: i, desc: `Trying pattern at position ${i}` });
      while (j < m && T[i + j] === P[j]) {
        j++;
        steps.push({ i, j, matches: [], checking: i, desc: `Match at T[${i+j-1}]='${T[i+j-1]}' == P[${j-1}]='${P[j-1]}'` });
      }
      if (j === m) steps.push({ i, j, matches: [i], checking: i, desc: `✓ Pattern found at index ${i}!` });
      else if (j < m) steps.push({ i, j, matches: [], checking: i, mismatch: i + j, desc: `Mismatch at T[${i+j}]='${T[i+j]}' vs P[${j}]='${P[j]}'` });
    }
    return steps;
  }

  function buildLPS(P) {
    const m = P.length, lps = new Array(m).fill(0);
    let len = 0, i = 1;
    while (i < m) {
      if (P[i] === P[len]) { lps[i++] = ++len; }
      else if (len) { len = lps[len - 1]; }
      else { lps[i++] = 0; }
    }
    return lps;
  }

  function genKMP(T, P) {
    const steps = [], n = T.length, m = P.length, lps = buildLPS(P);
    steps.push({ lps: [...lps], i: 0, j: 0, found: [], desc: `LPS array computed: [${lps.join(', ')}]` });
    let i = 0, j = 0, found = [];
    while (i < n) {
      steps.push({ lps, i, j, found: [...found], checking: i, desc: `Comparing T[${i}]='${T[i]}' with P[${j}]='${P[j]}'` });
      if (T[i] === P[j]) {
        i++; j++;
        if (j === m) {
          found.push(i - j);
          steps.push({ lps, i, j, found: [...found], checking: i - j, desc: `✓ Pattern found at index ${i - j}!` });
          j = lps[j - 1];
        }
      } else {
        if (j !== 0) { j = lps[j - 1]; steps.push({ lps, i, j, found: [...found], desc: `Mismatch — skip using LPS: j = ${j}` }); }
        else { i++; }
      }
    }
    steps.push({ lps, i, j, found, desc: `KMP complete. Found ${found.length} occurrence(s)` });
    return steps;
  }

  function reset() {
    clearInterval(timerRef.current); setPlaying(false);
    const s = algo === "kmp" ? genKMP(text, pattern) : genNaive(text, pattern);
    setSteps(s); setStepIdx(0);
    dispatch({ type: "VISIT_ALGO", algo });
  }

  useEffect(() => { reset(); }, [algo]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i + 1 >= steps.length) { setPlaying(false); clearInterval(timerRef.current); return i; }
          dispatch({ type: "STEP" });
          return i + 1;
        });
      }, Math.max(150, 1000 / speed));
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps]);

  const cur = steps[stepIdx] || {};

  const strExplanation = algo === "kmp"
    ? "KMP uses a precomputed LPS (Longest Proper Prefix-Suffix) array to skip comparisons on mismatch. This avoids going back in the text."
    : "Naive search tries every position and backtracks on mismatch. Simple but O(nm) in worst case.";

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Oxanium', sans-serif" }}>String Matching</div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 18 }}>Visualize character-by-character matching with pattern skip optimization.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["kmp", "KMP (Knuth-Morris-Pratt)"], ["naive", "Naive Search"]].map(([k, l]) => (
          <button key={k} onClick={() => setAlgo(k)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: algo === k ? C.accent : C.card,
            color: algo === k ? "#fff" : C.textSub,
            border: `1px solid ${algo === k ? C.accent : C.border}`,
            fontFamily: "inherit", transition: "all 0.2s",
          }}>{l}</button>
        ))}
      </div>

      <ExplanationPanel text={strExplanation} stepNum={stepIdx + 1} total={steps.length} />

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Text</div>
          <input type="text" value={text} onChange={e => setText(e.target.value)} style={{ width: 260 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Pattern</div>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)} style={{ width: 140 }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Btn onClick={reset} label="▶ Run" accent />
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 14px", marginBottom: 14, overflowX: "auto" }}>
        <div style={{ fontSize: 10, color: C.textSub, marginBottom: 8, fontWeight: 600, letterSpacing: "0.8px" }}>TEXT</div>
        <div style={{ display: "flex", gap: 2, flexWrap: "nowrap" }}>
          {text.split("").map((ch, i) => {
            const isChecking = i === cur.checking || (cur.found || []).some(f => i >= f && i < f + pattern.length);
            const isFound = (cur.found || []).some(f => i >= f && i < f + pattern.length);
            const isMismatch = i === cur.mismatch;
            return (
              <div key={i} style={{
                width: 28, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 6, flexShrink: 0,
                background: isMismatch ? `${C.red}33` : isFound ? `${C.green}33` : isChecking ? `${C.accent}33` : C.surface,
                border: `1px solid ${isMismatch ? C.red : isFound ? C.green : isChecking ? C.accent : C.border}`,
                transition: "all 0.15s",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: isMismatch ? C.red : isFound ? C.green : isChecking ? C.text : C.textSub }}>{ch}</div>
                  <div style={{ fontSize: 8, color: C.muted }}>{i}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, color: C.textSub, marginTop: 12, marginBottom: 6, fontWeight: 600 }}>PATTERN (at i={cur.i ?? 0})</div>
        <div style={{ display: "flex", gap: 2, paddingLeft: (cur.checking ?? cur.i ?? 0) * 30 }}>
          {pattern.split("").map((ch, j) => (
            <div key={j} style={{
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, flexShrink: 0,
              background: j < (cur.j ?? 0) ? `${C.teal}33` : `${C.amber}22`,
              border: `1px solid ${j < (cur.j ?? 0) ? C.teal : C.amber}`,
            }}>
              <span className="mono" style={{ fontSize: 12, color: j < (cur.j ?? 0) ? C.teal : C.amber }}>{ch}</span>
            </div>
          ))}
        </div>
      </div>

      {algo === "kmp" && cur.lps && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.textSub, marginBottom: 8, fontWeight: 600, letterSpacing: "0.8px" }}>LPS ARRAY</div>
          <div style={{ display: "flex", gap: 2 }}>
            {pattern.split("").map((ch, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 11, color: C.textSub, marginBottom: 2 }}>{ch}</div>
                <div style={{
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 6, background: cur.lps[i] > 0 ? `${C.accent}33` : C.surface,
                  border: `1px solid ${cur.lps[i] > 0 ? C.accent : C.border}`,
                }}>
                  <span className="mono" style={{ fontSize: 12, color: cur.lps[i] > 0 ? C.accent : C.muted }}>{cur.lps[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cur.desc && (
        <div style={{
          background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 10,
          padding: "10px 16px", marginBottom: 14, fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: C.accent, marginRight: 8 }}>→</span>{cur.desc}
        </div>
      )}

      <ControlBar playing={playing}
        onPlay={() => { if (stepIdx >= steps.length - 1) reset(); setPlaying(true); dispatch({ type: "PLAY_PAUSE" }); }}
        onPause={() => setPlaying(false)}
        onStep={() => setStepIdx(i => Math.min(i + 1, steps.length - 1))}
        onReset={reset} speed={speed} onSpeed={setSpeed} />

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <InfoPanel title="KMP" rows={[["Time", "O(n+m)"], ["Space", "O(m)"], ["Advantage", "No backtrack"]]} />
        <InfoPanel title="Naive" rows={[["Time", "O(nm)"], ["Space", "O(1)"], ["Simple", "Yes"]]} />
      </div>
    </div>
  );
}

// ─── COMPLEXITY MODULE ────────────────────────────────────────────
function ComplexityModule() {
  const canvasRef = useRef(null);
  const [highlight, setHighlight] = useState(null);

  const fns = [
    { label: "O(1)", fn: () => 1, color: C.green, desc: "Constant — best case, no growth" },
    { label: "O(log n)", fn: n => Math.log2(n + 1), color: C.teal, desc: "Logarithmic — Binary Search, Heap ops" },
    { label: "O(n)", fn: n => n, color: C.accent, desc: "Linear — Linear Search, single loops" },
    { label: "O(n log n)", fn: n => n * Math.log2(n + 1), color: C.amber, desc: "Linearithmic — Merge Sort, Quick Sort" },
    { label: "O(n²)", fn: n => n * n, color: "#ff7c7c", desc: "Quadratic — Bubble, Insertion, Selection Sort" },
    { label: "O(2ⁿ)", fn: n => Math.pow(2, Math.min(n, 20)), color: C.red, desc: "Exponential — Recursive Fibonacci, Subsets" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, W, H);
    const N = 30, maxY = fns[4].fn(N);
    ctx.strokeStyle = C.border; ctx.lineWidth = 0.5;
    [0.2, 0.4, 0.6, 0.8, 1].forEach(f => {
      ctx.beginPath(); ctx.moveTo(50, H * (1 - f) - 10); ctx.lineTo(W - 10, H * (1 - f) - 10); ctx.stroke();
    });
    fns.forEach(({ fn, color, label }, idx) => {
      const isHL = highlight === idx;
      ctx.beginPath();
      ctx.strokeStyle = color; ctx.lineWidth = isHL ? 3 : 1.5;
      ctx.globalAlpha = highlight !== null ? (isHL ? 1 : 0.15) : 1;
      for (let i = 1; i <= N; i++) {
        const x = 50 + (i / N) * (W - 60);
        const y = Math.max(10, H - 10 - (Math.min(fn(i), maxY) / maxY) * (H - 30));
        i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    });
    ctx.fillStyle = C.textSub; ctx.font = "10px JetBrains Mono";
    ctx.fillText("n →", W - 26, H - 2); ctx.fillText("ops", 2, 14);
  }, [highlight]);

  const TABLE = [
    ["Bubble Sort", "O(n)", "O(n²)", "O(n²)", "O(1)"],
    ["Selection Sort", "O(n²)", "O(n²)", "O(n²)", "O(1)"],
    ["Insertion Sort", "O(n)", "O(n²)", "O(n²)", "O(1)"],
    ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"],
    ["Quick Sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)"],
    ["Heap Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)"],
    ["Binary Search", "O(1)", "O(log n)", "O(log n)", "O(1)"],
    ["BFS/DFS", "O(V+E)", "O(V+E)", "O(V+E)", "O(V)"],
    ["Dijkstra", "O(V+E)", "O(V²)", "O(V²)", "O(V)"],
    ["Knapsack DP", "—", "O(nW)", "O(nW)", "O(nW)"],
    ["KMP", "—", "O(n+m)", "O(n+m)", "O(m)"],
  ];

  function complexityColor(s) {
    if (s.includes("1)")) return C.green;
    if (s.includes("log") && !s.includes("n ")) return C.teal;
    if (s.includes("n²")) return C.red;
    if (s.includes("2ⁿ")) return "#ff3333";
    if (s.includes("log n") && s.includes("n")) return C.amber;
    if (s === "—") return C.textMuted;
    return C.accent;
  }

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Oxanium', sans-serif" }}>Complexity Reference</div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 18 }}>Hover a curve to highlight it. Compare growth rates visually.</div>

      <canvas ref={canvasRef} width={580} height={220}
        style={{ borderRadius: 14, border: `1px solid ${C.border}`, display: "block", maxWidth: "100%", marginBottom: 16 }} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {fns.map((f, i) => (
          <button key={i}
            onMouseEnter={() => setHighlight(i)}
            onMouseLeave={() => setHighlight(null)}
            style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              background: highlight === i ? `${f.color}22` : C.card,
              color: f.color, border: `1px solid ${highlight === i ? f.color : C.border}`,
              cursor: "pointer", transition: "all 0.15s", fontWeight: 600,
              boxShadow: highlight === i ? `0 0 10px ${f.color}44` : "none",
            }}>
            {f.label}
          </button>
        ))}
      </div>
      {highlight !== null && (
        <div style={{ background: `${fns[highlight].color}11`, border: `1px solid ${fns[highlight].color}33`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: C.text }}>
          <span style={{ color: fns[highlight].color, fontWeight: 700, marginRight: 8 }}>{fns[highlight].label}</span>
          {fns[highlight].desc}
        </div>
      )}

      <div style={{ fontSize: 11, color: C.textSub, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Full Complexity Table</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>{["Algorithm", "Best", "Average", "Worst", "Space"].map(h => (
              <th key={h} style={{ padding: "10px 14px", background: C.card, color: C.textSub, border: `1px solid ${C.border}`, textAlign: "left", fontWeight: 600, letterSpacing: "0.5px" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {TABLE.map(([name, ...rest], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${C.surface}88` }}>
                <td style={{ padding: "9px 14px", border: `1px solid ${C.border}`, color: C.text, fontWeight: 500 }}>{name}</td>
                {rest.map((v, j) => (
                  <td key={j} className="mono" style={{ padding: "9px 14px", border: `1px solid ${C.border}`, color: complexityColor(v) }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PRACTICE MODE ────────────────────────────────────────────────
function PracticeMode({ dispatch }) {
  const [algo, setAlgo] = useState("bubble");
  const [arr, setArr] = useState(() => Array.from({ length: 8 }, () => Math.floor(Math.random() * 60) + 20));
  const [stepState, setStepState] = useState(null);
  const [genRef] = useState({ current: null });
  const [prediction, setPrediction] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionType, setQuestionType] = useState("predict_swap");
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [totalQ, setTotalQ] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);

  function newGame() {
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 60) + 20);
    setArr(a);
    genRef.current = SORT_ALGOS[algo].gen(a);
    setStepState(null);
    setPrediction(null);
    setFeedback(null);
    setAnswered(false);
    nextQuestion(a, SORT_ALGOS[algo].gen(a));
  }

  function nextQuestion(a, gen) {
    const res = gen ? gen.next() : genRef.current?.next();
    if (!res || res.done) { setFeedback("🎉 Array sorted! Starting new round..."); setTimeout(newGame, 1500); return; }
    const s = res.value;
    setStepState(s);
    setAnswered(false);
    setPrediction(null);
    setFeedback(null);

    // Generate question
    if (s.swapping) {
      const [i, j] = s.swapping;
      const correct = `Swap indices ${i} and ${j}`;
      const distractors = [
        `Swap indices ${i} and ${Math.max(0, j-1)}`,
        `Swap indices ${Math.min(a.length-1, i+1)} and ${j}`,
        `No swap needed`,
      ].filter(d => d !== correct).slice(0, 2);
      const opts = shuffle([correct, ...distractors]);
      setOptions(opts);
      setQuestionType({ q: "What happens next?", correct });
    } else if (s.comparing) {
      const [i, j] = s.comparing;
      const correct = s.arr[i] > s.arr[j] ? `Yes — swap them` : `No — they are in order`;
      const opts = shuffle([`Yes — swap them`, `No — they are in order`]);
      setOptions(opts);
      setQuestionType({ q: `Should a[${i}]=${s.arr[i]} and a[${j}]=${s.arr[j]} be swapped?`, correct });
    } else {
      // Skip trivial steps
      nextQuestion(a, null);
    }
  }

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function handleAnswer(choice) {
    if (answered) return;
    setAnswered(true);
    setTotalQ(t => t + 1);
    const isCorrect = choice === questionType.correct;
    dispatch({ type: "PRACTICE_ATTEMPT", correct: isCorrect });
    if (isCorrect) {
      setCorrectQ(c => c + 1);
      setScore(s => s + 10 + streak * 2);
      setStreak(s => s + 1);
      setFeedback("✅ Correct! " + (streak >= 2 ? `${streak + 1}x streak bonus!` : ""));
    } else {
      setStreak(0);
      setFeedback(`❌ Incorrect. The answer was: "${questionType.correct}"`);
    }
    setTimeout(() => nextQuestion(arr, null), 1500);
  }

  useEffect(() => { newGame(); dispatch({ type: "VISIT_ALGO", algo: "practice" }); }, [algo]);

  const displayArr = stepState ? stepState.arr : arr;
  const maxVal = Math.max(...displayArr, 1);

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Oxanium', sans-serif" }}>Practice Mode</div>
      </div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 20 }}>Predict what the algorithm will do next. Build intuition through active learning!</div>

      {/* Score bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          ["Score", score, C.accent],
          ["Streak", `${streak}x`, streak >= 3 ? C.amber : C.textSub],
          ["Accuracy", totalQ > 0 ? `${Math.round((correctQ / totalQ) * 100)}%` : "—", C.green],
          ["Correct", `${correctQ}/${totalQ}`, C.teal],
        ].map(([k, v, c]) => (
          <div key={k} className="metric-card" style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90,
          }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Algorithm select */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {["bubble", "selection", "insertion"].map(a => (
          <button key={a} onClick={() => setAlgo(a)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: algo === a ? C.accent : C.card,
            color: algo === a ? "#fff" : C.textSub,
            border: `1px solid ${algo === a ? C.accent : C.border}`,
            fontFamily: "inherit", transition: "all 0.2s",
          }}>{SORT_ALGOS[a].name}</button>
        ))}
        <Btn small onClick={newGame} label="🔀 New Array" />
      </div>

      {/* Array visualization */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 140, justifyContent: "center" }}>
          {displayArr.map((v, i) => {
            const isComparing = stepState?.comparing?.includes(i);
            const isSwapping = stepState?.swapping?.includes(i);
            const isSorted = stepState?.sorted?.includes(i);
            return (
              <div key={i} style={{
                flex: 1, height: `${(v / maxVal) * 100}%`,
                background: isSorted ? C.green : isSwapping ? C.red : isComparing ? C.amber : C.accent,
                borderRadius: "4px 4px 0 0", minWidth: 28, maxWidth: 50,
                display: "flex", flexDirection: "column-reverse", alignItems: "center",
                transition: "all 0.15s",
                boxShadow: isComparing ? `0 0 10px ${C.amberGlow}` : isSwapping ? `0 0 10px ${C.redGlow}` : "none",
              }}>
                <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question */}
      {questionType && !answered && (
        <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.purple, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>❓ Predict the next step</div>
          <div style={{ fontSize: 15, color: C.text, marginBottom: 16, fontWeight: 500 }}>{questionType.q}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: C.card, color: C.text, border: `1px solid ${C.border}`,
                fontFamily: "inherit", transition: "all 0.15s", cursor: "pointer",
              }}
                onMouseEnter={e => e.target.style.borderColor = C.purple}
                onMouseLeave={e => e.target.style.borderColor = C.border}
              >{opt}</button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{
          background: feedback.startsWith("✅") ? `${C.green}11` : feedback.startsWith("🎉") ? `${C.accent}11` : `${C.red}11`,
          border: `1px solid ${feedback.startsWith("✅") ? C.green : feedback.startsWith("🎉") ? C.accent : C.red}44`,
          borderRadius: 10, padding: "12px 18px", fontSize: 14, fontWeight: 600,
          color: feedback.startsWith("✅") ? C.green : feedback.startsWith("🎉") ? C.accent : C.red,
          animation: "bounceIn 0.3s ease",
        }}>
          {feedback}
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: C.textMuted }}>
        💡 Tip: Use the regular Sorting Visualizer to study the algorithm, then test yourself here!
      </div>
    </div>
  );
}

// ─── ALGORITHM BUILDER ────────────────────────────────────────────
function AlgorithmBuilder({ dispatch }) {
  const [steps, setSteps] = useState([
    { id: 1, type: "compare", a: 0, b: 1, desc: "Compare first two elements" },
    { id: 2, type: "swap", a: 0, b: 1, desc: "Swap if out of order" },
  ]);
  const [arr, setArr] = useState([42, 17, 88, 31, 65]);
  const [simStep, setSimStep] = useState(-1);
  const [simLog, setSimLog] = useState([]);
  const [nextId, setNextId] = useState(3);
  const [arrInput, setArrInput] = useState("42 17 88 31 65");
  const [name, setName] = useState("My Custom Algorithm");

  function addStep(type) {
    setSteps(s => [...s, { id: nextId, type, a: 0, b: 1, desc: type === "compare" ? "Compare elements" : type === "swap" ? "Swap elements" : "Mark as sorted" }]);
    setNextId(n => n + 1);
  }

  function removeStep(id) { setSteps(s => s.filter(x => x.id !== id)); }

  function updateStep(id, field, value) {
    setSteps(s => s.map(x => x.id === id ? { ...x, [field]: value } : x));
  }

  function simulate() {
    const a = [...arr];
    const log = [];
    steps.forEach((step, idx) => {
      const ai = Math.min(step.a, a.length - 1);
      const bi = Math.min(step.b, a.length - 1);
      if (step.type === "compare") {
        log.push({ step: idx + 1, desc: `Step ${idx + 1}: ${step.desc} — a[${ai}]=${a[ai]} vs a[${bi}]=${a[bi]} → ${a[ai] > a[bi] ? "out of order" : "in order"}` });
      } else if (step.type === "swap") {
        if (a[ai] > a[bi]) {
          [a[ai], a[bi]] = [a[bi], a[ai]];
          log.push({ step: idx + 1, desc: `Step ${idx + 1}: ${step.desc} — swapped positions ${ai} and ${bi}` });
        } else {
          log.push({ step: idx + 1, desc: `Step ${idx + 1}: ${step.desc} — no swap needed` });
        }
      } else if (step.type === "mark_sorted") {
        log.push({ step: idx + 1, desc: `Step ${idx + 1}: ${step.desc} — position ${ai} marked sorted` });
      }
    });
    log.push({ step: "final", desc: `Result: [${a.join(", ")}]` });
    setSimLog(log);
    dispatch({ type: "VISIT_ALGO", algo: "builder" });
  }

  const displayArr = arr;
  const maxVal = Math.max(...displayArr, 1);

  return (
    <div style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Oxanium', sans-serif" }}>Algorithm Builder</div>
      </div>
      <div style={{ fontSize: 13, color: C.textSub, marginBottom: 24 }}>Design your own sorting algorithm by composing steps. Simulate it to see what happens!</div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Builder panel */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Algorithm Name</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%" }} />
          </div>

          {/* Array input */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Input Array</div>
            <input type="text" value={arrInput} onChange={e => {
              setArrInput(e.target.value);
              const parsed = e.target.value.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
              if (parsed.length > 0) setArr(parsed);
            }} style={{ width: "100%" }} />
          </div>

          {/* Array preview */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.textSub, marginBottom: 8, fontWeight: 600 }}>ARRAY PREVIEW</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
              {displayArr.slice(0, 10).map((v, i) => (
                <div key={i} style={{
                  flex: 1, height: `${(v / maxVal) * 100}%`, background: C.accent,
                  borderRadius: "3px 3px 0 0", minWidth: 20,
                  display: "flex", alignItems: "flex-start", justifyContent: "center",
                }}>
                  <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Steps ({steps.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {steps.map((step, idx) => (
              <div key={step.id} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    background: step.type === "compare" ? `${C.amber}22` : step.type === "swap" ? `${C.red}22` : `${C.green}22`,
                    fontSize: 10, fontWeight: 700, color: step.type === "compare" ? C.amber : step.type === "swap" ? C.red : C.green,
                  }}>{idx + 1}</div>
                  <select value={step.type} onChange={e => updateStep(step.id, "type", e.target.value)}
                    style={{ fontSize: 12, padding: "4px 8px" }}>
                    <option value="compare">Compare</option>
                    <option value="swap">Swap</option>
                    <option value="mark_sorted">Mark Sorted</option>
                  </select>
                  <span style={{ fontSize: 11, color: C.textSub }}>indices:</span>
                  <input type="number" min="0" max={arr.length - 1} value={step.a}
                    onChange={e => updateStep(step.id, "a", +e.target.value)}
                    style={{ width: 50, fontSize: 12, padding: "3px 6px" }} />
                  <span style={{ color: C.textSub }}>↔</span>
                  <input type="number" min="0" max={arr.length - 1} value={step.b}
                    onChange={e => updateStep(step.id, "b", +e.target.value)}
                    style={{ width: 50, fontSize: 12, padding: "3px 6px" }} />
                  <button onClick={() => removeStep(step.id)} style={{
                    marginLeft: "auto", color: C.red, fontSize: 14, padding: "2px 6px",
                    background: `${C.red}11`, borderRadius: 6, border: `1px solid ${C.red}33`,
                  }}>✕</button>
                </div>
                <input type="text" value={step.desc} onChange={e => updateStep(step.id, "desc", e.target.value)}
                  placeholder="Step description..." style={{ width: "100%", fontSize: 12, padding: "4px 8px" }} />
              </div>
            ))}
          </div>

          {/* Add step buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Btn small label="+ Compare" onClick={() => addStep("compare")} />
            <Btn small label="+ Swap" onClick={() => addStep("swap")} />
            <Btn small label="+ Mark Sorted" onClick={() => addStep("mark_sorted")} />
          </div>

          <Btn accent label="▶ Simulate Algorithm" onClick={simulate} />
        </div>

        {/* Simulation log */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Simulation Log
          </div>
          {simLog.length === 0 ? (
            <div style={{ background: C.card, border: `1px dashed ${C.border}`, borderRadius: 12, padding: "30px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>⬛</div>
              <div style={{ fontSize: 13, color: C.textSub }}>Click "Simulate Algorithm" to see what your steps do to the array</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {simLog.map((entry, i) => (
                <div key={i} style={{
                  background: entry.step === "final" ? `${C.green}11` : C.card,
                  border: `1px solid ${entry.step === "final" ? C.green : C.border}`,
                  borderRadius: 10, padding: "10px 14px",
                  fontSize: 12, color: entry.step === "final" ? C.green : C.text,
                  fontFamily: "'JetBrains Mono', monospace",
                  animation: `slideRight 0.3s ${i * 0.05}s ease both`,
                }}>
                  {entry.desc}
                </div>
              ))}
            </div>
          )}

          {simLog.length > 0 && (
            <div style={{ marginTop: 16, background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: C.textSub }}>
              💡 Try building a complete Bubble Sort: add Compare + Swap steps for every adjacent pair in each pass!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DRY RUN VISUALIZER ───────────────────────────────────────────
// Deep Real-World Simulation Engine
// Safe offline tracing, deep Python/C++/Java/JS emulation,
// animated array/tree/graph/stack/queue/DP visualizations,
// auto-play, recursion trees, unlimited steps, zero API cost.

// ── EXAMPLE DATABASE ──────────────────────────────────────────────
const DR_EXAMPLES = {
  "Bubble Sort": { lang: "C++", code: `#include <iostream>
using namespace std;
int main() {
    int arr[] = {5, 3, 8, 1, 9, 2};
    int n = 6;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}` },

  "Merge Sort": { lang: "Python", code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:]); result.extend(right[j:])
    return result

arr = [6, 3, 8, 5, 2, 7, 4, 1]
print(merge_sort(arr))` },

  "Quick Sort": { lang: "Python", code: `def quicksort(arr, low, high):
    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i+1], arr[high] = arr[high], arr[i+1]
        pi = i + 1
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)

arr = [10, 7, 8, 9, 1, 5]
quicksort(arr, 0, len(arr)-1)
print(arr)` },

  "Insertion Sort": { lang: "C++", code: `#include <iostream>
using namespace std;
int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = 5;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
}` },

  "BFS Traversal": { lang: "Python", code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

graph = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1], 5:[2]}
print(bfs(graph, 0))` },

  "DFS Recursive": { lang: "Python", code: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node, end=" ")
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

graph = {'A':['B','C'], 'B':['A','D','E'],
         'C':['A','F'], 'D':['B'], 'E':['B'], 'F':['C']}
dfs(graph, 'A')` },

  "Dijkstra SSSP": { lang: "Python", code: `import heapq

def dijkstra(graph, src):
    dist = {node: float('inf') for node in graph}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist

graph = {
    'A': [('B',4),('C',2)],
    'B': [('D',5),('C',1)],
    'C': [('B',1),('D',8),('E',10)],
    'D': [('E',2)], 'E': []
}
print(dijkstra(graph, 'A'))` },

  "Fibonacci DP": { lang: "Python", code: `def fibonacci_dp(n):
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

n = 9
for i in range(n+1):
    print(f"fib({i}) = {fibonacci_dp(i)}")` },

  "0/1 Knapsack": { lang: "Python", code: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(capacity+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][capacity]

weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
print(knapsack(weights, values, 8))` },

  "Coin Change": { lang: "Python", code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i-coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

coins = [1, 5, 6, 9]
print(coin_change(coins, 11))` },

  "LCS (DP)": { lang: "Python", code: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

print(lcs("ABCBDAB", "BDCAB"))` },

  "Edit Distance": { lang: "Python", code: `def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]

print(edit_distance("sunday", "saturday"))` },

  "Tree Inorder": { lang: "Python", code: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root, result=[]):
    if root is None:
        return result
    inorder(root.left, result)
    result.append(root.val)
    inorder(root.right, result)
    return result

root = Node(4)
root.left = Node(2); root.right = Node(6)
root.left.left = Node(1); root.left.right = Node(3)
root.right.left = Node(5); root.right.right = Node(7)
print(inorder(root, []))` },

  "BST Insert": { lang: "Python", code: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)

root = None
for v in [5, 3, 7, 1, 4, 6, 8]:
    root = insert(root, v)
inorder(root)` },

  "Balanced Parens": { lang: "C++", code: `#include <iostream>
#include <stack>
#include <string>
using namespace std;
bool isBalanced(string s) {
    stack<char> st;
    for (char c : s) {
        if (c=='(' || c=='{' || c=='[')
            st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c==')' && top!='(') ||
                (c=='}' && top!='{') ||
                (c==']' && top!='['))
                return false;
        }
    }
    return st.empty();
}
int main() {
    cout << isBalanced("{[()]}") << endl;
    cout << isBalanced("{[(])}") << endl;
}` },

  "Linked List Rev": { lang: "Python", code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

def print_list(head):
    vals = []
    while head:
        vals.append(str(head.val))
        head = head.next
    print(" -> ".join(vals))

head = Node(1)
head.next = Node(2); head.next.next = Node(3)
head.next.next.next = Node(4); head.next.next.next.next = Node(5)
print_list(head)
head = reverse(head)
print_list(head)` },

  "Binary Search": { lang: "JavaScript", code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
const arr = [1,3,5,7,9,11,13,15,17,19];
console.log(binarySearch(arr, 13));
console.log(binarySearch(arr, 6));` },

  "Two Sum Hash": { lang: "Python", code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))` },

  "Sliding Window": { lang: "Python", code: `from collections import deque

def sliding_window_max(nums, k):
    result = []
    dq = deque()
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

nums = [1,3,-1,-3,5,3,6,7]
print(sliding_window_max(nums, 3))` },

  "Factorial": { lang: "JavaScript", code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
for (let i = 0; i <= 7; i++) {
  console.log(i + "! = " + factorial(i));
}` },

  "N-Queens": { lang: "Python", code: `def solve_n_queens(n):
    solutions = []
    board = [-1] * n
    def is_safe(row, col):
        for r in range(row):
            if board[r] == col: return False
            if abs(board[r]-col) == abs(r-row): return False
        return True
    def backtrack(row):
        if row == n:
            solutions.append(board[:])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1
    backtrack(0)
    return len(solutions)

print(solve_n_queens(4))` },

  "Min Heap": { lang: "Python", code: `import heapq

def heap_demo():
    nums = [5, 3, 8, 1, 9, 2, 7, 4, 6]
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        print(f"push {n}: min={heap[0]}, heap={heap[:4]}")
    print("Sorted:", end=" ")
    while heap:
        print(heapq.heappop(heap), end=" ")

heap_demo()` },

  "Cycle Detection": { lang: "Python", code: `def has_cycle(graph, n):
    visited = [False] * n
    rec_stack = [False] * n
    def dfs(v):
        visited[v] = True
        rec_stack[v] = True
        for neighbor in graph[v]:
            if not visited[neighbor]:
                if dfs(neighbor): return True
            elif rec_stack[neighbor]: return True
        rec_stack[v] = False
        return False
    for node in range(n):
        if not visited[node]:
            if dfs(node): return True
    return False

graph = {0:[1], 1:[2], 2:[3], 3:[1]}
print(has_cycle(graph, 4))` },

  "Permutations": { lang: "Python", code: `def permutations(nums, start=0):
    if start == len(nums) - 1:
        print(nums[:])
        return
    for i in range(start, len(nums)):
        nums[start], nums[i] = nums[i], nums[start]
        permutations(nums, start + 1)
        nums[start], nums[i] = nums[i], nums[start]

permutations([1, 2, 3])` },

  "Subsets": { lang: "Python", code: `def subsets(nums):
    result = [[]]
    for num in nums:
        new_subsets = [sub + [num] for sub in result]
        result.extend(new_subsets)
        print(f"After adding {num}: {result}")
    return result

subsets([1, 2, 3])` },
};

const DR_CATEGORIES = {
  "Sorting":      ["Bubble Sort","Merge Sort","Quick Sort","Insertion Sort"],
  "Graphs":       ["BFS Traversal","DFS Recursive","Dijkstra SSSP","Cycle Detection"],
  "Dynamic Prog": ["Fibonacci DP","0/1 Knapsack","Coin Change","LCS (DP)","Edit Distance"],
  "Trees":        ["Tree Inorder","BST Insert"],
  "Data Structs": ["Balanced Parens","Linked List Rev","Min Heap"],
  "Backtracking": ["N-Queens","Permutations","Subsets","Factorial"],
  "Search/Ptr":   ["Binary Search","Two Sum Hash","Sliding Window"],
};

// ── DEEP TRACE ENGINE ─────────────────────────────────────────────
function detectLang(src) {
  if (/^\s*#include|cout\s*<<|cin\s*>>|int\s+main\s*\(/.test(src)) return "C++";
  if (/^\s*def\s+\w+|print\s*\(|:\s*$|from\s+\w+\s+import/.test(src)) return "Python";
  if (/\bpublic\s+class\b|\bSystem\.out\.print/.test(src)) return "Java";
  if (/function\s+\w+|const\s+\w+\s*=|let\s+\w+|console\.log|=>\s*{/.test(src)) return "JavaScript";
  return "Python";
}

function deepTrace(src, lang) {
  const detectedLang = lang === "auto" ? detectLang(src) : lang;
  try {
    if (detectedLang === "JavaScript") return traceJS(src);
    return traceUniversal(src, detectedLang);
  } catch(e) {
    return [{ step:1, line:1, lineText: src.split("\n")[0]||"", description:"Trace error: "+e.message, highlight:"error", variables:{}, callStack:["main"], heap:{}, output:null, explanation:"Error during trace.", depth:0, activeIndices:[], swapIndices:[], comparingIndices:[], pointers:{}, memoCells:[], nodeVisited:null }];
  }
}

// ── SAFE JS TRACER (offline pattern simulation, no arbitrary execution) ────
function traceJS(src) {
  return traceUniversal(src, "JavaScript");
}

function instrumentJS(src, lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (!t || t.startsWith("//")) { out.push(raw); continue; }
    const ln = i+1;
    const esc = JSON.stringify(t);

    // Function declaration
    const fnM = t.match(/^(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>))/);
    if (fnM) {
      const name = fnM[1]||fnM[2]||"fn";
      out.push(`__addStep(${ln},${esc},"Define function ${name}","call",{explanation:"📋 Function '${name}' is declared and ready to be called. Its code is stored but not executed yet."});`);
      out.push(raw);
      continue;
    }

    // Variable assignment
    const varM = t.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+?)(?:;)?$/) || t.match(/^(\w+)\s*=(?!=)\s*(.+?)(?:;)?$/);
    if (varM && !["if","for","while"].includes(varM[1])) {
      out.push(raw);
      const vn = varM[1];
      out.push(`try{__setVar(${JSON.stringify(vn)},${vn});__addStep(${ln},${esc},"${vn} = "+JSON.stringify(${vn}),"assign",{explanation:"📦 Variable '${vn}' is stored in memory with the computed value."});}catch(_e){}`);
      continue;
    }

    // console.log
    if (/console\.log/.test(t)) {
      out.push(`try{const __cl=[];const __lo=console.log;console.log=(...a)=>__cl.push(a.map(x=>JSON.stringify(x)).join(' '));${raw};console.log=__lo;__addStep(${ln},${esc},"Output: "+__cl.join(' '),"call",{output:__cl.join(' '),explanation:"🖥️ Printing output to console."});}catch(_e){${raw};__addStep(${ln},${esc},"Print output","call");}`);
      continue;
    }

    // for loop
    if (/^for\s*\(/.test(t)) {
      out.push(`__addStep(${ln},${esc},"Loop start","loop",{explanation:"🔄 For loop begins. The loop variable is initialized, condition checked — if true, body executes, then increment, repeat."});`);
      out.push(raw);
      continue;
    }

    // while loop
    if (/^while\s*\(/.test(t)) {
      out.push(`__addStep(${ln},${esc},"While condition checked","loop",{explanation:"🔄 While loop checks its condition. As long as it's true, the body keeps executing."});`);
      out.push(raw);
      continue;
    }

    // if/else
    if (/^(?:if|else if)\s*\(/.test(t)) {
      out.push(raw);
      out.push(`__addStep(${ln},${esc},"Branch: ${t.slice(0,40)}","branch",{explanation:"⑂ Decision point! The program evaluates this condition and chooses which path to follow."});`);
      continue;
    }
    if (/^else\s*\{?$/.test(t)) {
      out.push(raw);
      out.push(`__addStep(${ln},${esc},"Else branch","branch",{explanation:"⑂ Condition was false, taking the else path."});`);
      continue;
    }

    // return
    if (/^return\b/.test(t)) {
      const retM = t.match(/^return\s+(.+?)(?:;)?$/);
      if (retM) {
        out.push(`try{const __rv=(${retM[1]});__addStep(${ln},${esc},"return "+JSON.stringify(__rv),"return",{rv:__rv,explanation:"↩ Function returns this value back to its caller. The call stack frame is popped."});return __rv;}catch(_e){${raw};}`);
      } else {
        out.push(`__addStep(${ln},${esc},"return","return",{explanation:"↩ Function returns, call stack frame popped."});${raw};`);
      }
      continue;
    }

    // array push/pop
    if (/\.push\(/.test(t)) { out.push(raw); out.push(`__addStep(${ln},${esc},"Push to array","push",{explanation:"↓ Element added to end of array. Array grows by one."});`); continue; }
    if (/\.pop\(\)/.test(t)) { out.push(raw); out.push(`__addStep(${ln},${esc},"Pop from array","pop",{explanation:"↑ Last element removed. Array shrinks by one (stack behavior)."});`); continue; }

    // swap pattern
    if (/\[.+\]\s*,\s*\[.+\]\s*=|swap/.test(t)) {
      out.push(`__addStep(${ln},${esc},"Swap elements","swap",{explanation:"⇄ Two values exchange positions in memory."});`);
      out.push(raw);
      continue;
    }

    out.push(raw);
  }
  return out.join("\n");
}

function getDefaultExpl(hl, desc) {
  const map = {
    assign: "📦 A value is stored in a variable. Memory is updated.",
    loop: "🔄 Loop iteration — checking condition and executing body.",
    branch: "⑂ Condition evaluated — program takes one of two paths.",
    call: "📞 Function called — control jumps to that function.",
    return: "↩ Function returns — control goes back to caller.",
    swap: "⇄ Two elements swap their positions in memory.",
    compare: "≷ Two values are compared to decide next action.",
    push: "↓ Element pushed — data structure grows.",
    pop: "↑ Element popped — data structure shrinks.",
    recurse: "↻ Function calls itself with a smaller subproblem.",
    memo: "✦ Value cached — will be reused instead of recalculating.",
    enqueue: "▷ Element joins the queue at the back.",
    dequeue: "◁ Element leaves the queue from the front (FIFO).",
    mark: "✓ Node/element marked — won't be processed again.",
    normal: "Executing this line of code.",
    error: "An error occurred during trace.",
  };
  return map[hl] || desc || "Executing.";
}

// ── UNIVERSAL DEEP TRACER (Python/C++/Java + rich algorithm sim) ──
function traceUniversal(src, lang) {
  const steps = [];
  const lines = src.split("\n");
  const vars = {};
  const heap = {};
  const callStack = ["main"];
  const MAX = 800;

  function addStep(lineIdx, desc, hl, extra={}) {
    if (steps.length >= MAX) return;
    steps.push({
      step: steps.length+1, line: lineIdx+1, lineText: (lines[lineIdx]||"").trim(),
      description: desc, highlight: hl,
      variables: Object.assign({},vars), callStack: [...callStack], heap: Object.assign({},heap),
      output: extra.output||null, explanation: extra.explanation||getDefaultExpl(hl,desc),
      depth: callStack.length-1, activeIndices: extra.ai||[], swapIndices: extra.si||[],
      comparingIndices: extra.ci||[], pointers: extra.ptrs||{}, memoCells: extra.mc||[],
      nodeVisited: extra.nv||null, returnVal: extra.rv
    });
  }

  // Detect and extract arrays from Python/JS, C/C++, and Java-style literals.
  const detectedArrays = {};
  const arrayPatterns = [
    /(?:let|const|var)?\s*(\w+)\s*=\s*\[([0-9,\s\-\.]+)\]/g,
    /(?:int|long|double|float|short)\s+(\w+)\s*\[\s*\]\s*=\s*\{([0-9,\s\-\.]+)\}/g,
    /(?:int|long|double|float|short)\s*\[\s*\]\s+(\w+)\s*=\s*\{([0-9,\s\-\.]+)\}/g,
    /vector\s*<\s*\w+\s*>\s+(\w+)\s*=\s*\{([0-9,\s\-\.]+)\}/g,
    /(?:ArrayList|List)\s*<\s*\w+\s*>\s+(\w+)\s*=\s*Arrays\.asList\s*\(([0-9,\s\-\.]+)\)/g,
  ];
  for (const arrRe of arrayPatterns) {
    let am;
    while ((am = arrRe.exec(src)) !== null) {
      const items = am[2].split(",").map(s=>parseFloat(s.trim())).filter(n=>!isNaN(n));
      if (items.length > 1) {
        detectedArrays[am[1]] = items;
        heap[am[1]] = JSON.stringify(items);
        vars[am[1]] = JSON.stringify(items);
      }
    }
  }

  const txt = src.toLowerCase();

  // Algorithm pattern detection
  const IS = {
    bubble:   /bubble.*sort|for.*i.*for.*j.*swap|arr\[j\]\s*>\s*arr\[j\+1\]/.test(txt),
    selection:/selection.*sort|min.*idx|find.*min/.test(txt),
    insertion:/insertion.*sort|key\s*=|while.*key/.test(txt),
    merge:    /merge.*sort|def merge|function merge/.test(txt),
    quick:    /quick.*sort|pivot|partition/.test(txt),
    bfs:      /\bbfs\b|breadth.*first|from.*deque|queue\.append/.test(txt),
    dfs:      /\bdfs\b|depth.*first|def dfs|function dfs/.test(txt),
    dijkstra: /dijkstra|dist\[|heapq/.test(txt),
    fib:      /fibonacci|fib\s*\(|dp\[i-1\]\s*\+\s*dp\[i-2\]/.test(txt),
    knapsack: /knapsack|capacity|weights.*values/.test(txt),
    coin:     /coin.?change|coins\s*=\s*\[/.test(txt),
    lcs:      /\blcs\b|longest.common/.test(txt),
    editdist: /edit.dist|levenshtein/.test(txt),
    factorial:/factorial/.test(txt),
    nqueens:  /n.?queens|is_safe|backtrack/.test(txt),
    perm:     /permut/.test(txt),
    subsets:  /subsets/.test(txt),
    binSearch:/binary.*search|left.*right.*mid|arr\[mid\]/.test(txt),
    twoptr:   /two.*pointer|left\s*=.*right\s*=/.test(txt),
    sliding:  /sliding.*window|deque/.test(txt),
    hash:     /two.*sum.*hash|seen\s*=\s*\{|complement/.test(txt),
    stack:    /stack\s*=\s*\[|balanced.*paren|\.push\(|\.pop\(\)/.test(txt),
    heap:     /heapq\.|heappush|heappop/.test(txt),
    linkedlist:/\.next|ListNode|linked.?list|reverse.*head/.test(txt),
    tree:     /def.*inorder|def.*preorder|TreeNode|\.left|\.right/.test(txt),
    recursion:/def\s+\w+\(|function\s+\w+\s*\(/.test(txt) && /return.*\(/.test(txt),
  };

  const arrName = Object.keys(detectedArrays)[0] || "arr";
  let arr = detectedArrays[arrName] ? [...detectedArrays[arrName]] : [5,3,8,1,9,2,7,4];

  // ── SORTING ───────────────────────────────────────────────────────
  if (IS.bubble) return traceBubble(lines, arr, arrName, addStep, vars, heap, steps);
  if (IS.selection) return traceSelection(lines, arr, arrName, addStep, vars, heap, steps);
  if (IS.insertion) return traceInsertion(lines, arr, arrName, addStep, vars, heap, steps);
  if (IS.merge) return traceMerge(lines, arr, arrName, addStep, vars, heap, steps);
  if (IS.quick) return traceQuick(lines, arr, arrName, addStep, vars, heap, steps);

  // ── SEARCH ────────────────────────────────────────────────────────
  if (IS.binSearch) return traceBinSearch(lines, arr, addStep, vars, heap, steps);
  if (IS.twoptr) return traceTwoPointers(lines, arr, addStep, vars, heap, steps);
  if (IS.sliding) return traceSliding(lines, arr, addStep, vars, heap, steps);

  // ── GRAPHS ────────────────────────────────────────────────────────
  if (IS.bfs) return traceBFS(lines, addStep, vars, heap, steps, src);
  if (IS.dfs) return traceDFS(lines, addStep, vars, heap, steps, src);
  if (IS.dijkstra) return traceDijkstra(lines, addStep, vars, heap, steps);

  // ── DYNAMIC PROGRAMMING ──────────────────────────────────────────
  if (IS.fib) return traceFib(lines, addStep, vars, heap, steps);
  if (IS.knapsack) return traceKnapsack(lines, src, addStep, vars, heap, steps);
  if (IS.coin) return traceCoin(lines, src, addStep, vars, heap, steps);
  if (IS.lcs) return traceLCS(lines, addStep, vars, heap, steps);
  if (IS.editdist) return traceEditDist(lines, addStep, vars, heap, steps);

  // ── RECURSION / BACKTRACKING ──────────────────────────────────────
  if (IS.factorial) return traceFactorial(lines, src, addStep, vars, heap, steps);
  if (IS.nqueens) return traceNQueens(lines, addStep, vars, heap, steps);
  if (IS.perm) return tracePermutations(lines, addStep, vars, heap, steps);
  if (IS.subsets) return traceSubsets(lines, addStep, vars, heap, steps);

  // ── DATA STRUCTURES ──────────────────────────────────────────────
  if (IS.stack) return traceStack(lines, addStep, vars, heap, steps);
  if (IS.heap) return traceHeap(lines, addStep, vars, heap, steps);
  if (IS.linkedlist) return traceLinkedList(lines, addStep, vars, heap, steps);
  if (IS.tree) return traceTree(lines, addStep, vars, heap, steps);
  if (IS.hash) return traceHash(lines, src, addStep, vars, heap, steps);

  // ── GENERIC FALLBACK ─────────────────────────────────────────────
  return traceGeneric(lines, src, addStep, vars, heap, steps);
}

// ── BUBBLE SORT ───────────────────────────────────────────────────
function traceBubble(lines, arr, name, addStep, vars, heap, steps) {
  const a=[...arr], n=a.length;
  const li=(re)=>lines.findIndex(l=>re.test(l.trim()));
  const L={outer:li(/for.*i/)||0, inner:li(/for.*j/)||1, cmp:li(/arr\[j\].*>/)||2, swap:li(/temp|swap/)||3};
  heap[name]=JSON.stringify(a);
  addStep(0,`Init: arr=[${a.join(",")}]`,"assign",{ai:[],explanation:`🎯 Starting Bubble Sort on ${n} elements. In each pass, the largest unsorted element "bubbles up" to its correct position at the end.`});
  let swaps=0, comps=0;
  for(let i=0;i<n-1&&steps.length<750;i++){
    vars["i"]=String(i);
    addStep(L.outer,`Pass ${i+1}: outer i=${i}`,"loop",{ai:Array.from({length:i},(_,k)=>n-1-k),explanation:`🔄 Pass ${i+1} of ${n-1}. The last ${i} element(s) are already in their final sorted position. We scan indices 0..${n-2-i}.`});
    let swapped=false;
    for(let j=0;j<n-1-i&&steps.length<750;j++){
      vars["j"]=String(j); comps++;
      heap[name]=JSON.stringify(a);
      addStep(L.inner,`Inner j=${j}, compare a[${j}]=${a[j]} vs a[${j+1}]=${a[j+1]}`,"compare",{ci:[j,j+1],explanation:`👀 Comparing neighbors: a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}. ${a[j]>a[j+1]?`${a[j]} > ${a[j+1]} → SWAP! Larger value bubbles right.`:`${a[j]} ≤ ${a[j+1]} → No swap, already ordered.`}`});
      if(a[j]>a[j+1]){
        const tmp=a[j];a[j]=a[j+1];a[j+1]=tmp; swaps++; swapped=true;
        heap[name]=JSON.stringify(a);
        vars["swaps"]=String(swaps);
        addStep(L.swap,`SWAP a[${j}]↔a[${j+1}] → [${a.join(",")}]`,"swap",{si:[j,j+1],explanation:`🔀 Swapped! Larger value moves right. Array now: [${a.join(", ")}]. This was swap #${swaps}.`});
      }
    }
    heap[name]=JSON.stringify(a);
    addStep(L.outer,`Pass ${i+1} done. a[${n-1-i}]=${a[n-1-i]} is in final position ✓`,"mark",{ai:Array.from({length:i+1},(_,k)=>n-1-k),explanation:`✅ After pass ${i+1}, the top ${i+1} element(s) are now permanently sorted.`});
    if(!swapped){addStep(L.outer,"Early exit: no swaps — array already sorted!","assign",{explanation:`⚡ Optimization: if a full pass makes zero swaps, the array is sorted. We stop early! This makes Bubble Sort O(n) in best case.`});break;}
  }
  heap[name]=JSON.stringify(a);
  addStep(lines.length-1,`✅ Sorted: [${a.join(",")}]. Comparisons:${comps}, Swaps:${swaps}`,"mark",{ai:Array.from({length:n},(_,k)=>k),explanation:`🏁 Bubble Sort complete! ${comps} comparisons, ${swaps} swaps. Time: O(n²) worst/avg, O(n) best. Space: O(1) in-place.`});
  return steps;
}

// ── SELECTION SORT ────────────────────────────────────────────────
function traceSelection(lines, arr, name, addStep, vars, heap, steps) {
  const a=[...arr],n=a.length;
  heap[name]=JSON.stringify(a);
  addStep(0,`Selection Sort on [${a.join(",")}]`,"assign",{explanation:`📋 Selection Sort: Divide array into sorted (left) and unsorted (right) parts. Repeatedly find the minimum in the unsorted part and move it to the sorted part.`});
  for(let i=0;i<n-1&&steps.length<750;i++){
    vars["i"]=String(i); vars["minIdx"]=String(i);
    addStep(1,`Find min in a[${i}..${n-1}], starting minIdx=${i} (val=${a[i]})`,"loop",{ai:[i],explanation:`🔍 Unsorted portion: [${a.slice(i).join(",")}]. Searching for minimum, assume a[${i}]=${a[i]} is minimum for now.`});
    let minIdx=i;
    for(let j=i+1;j<n&&steps.length<750;j++){
      vars["j"]=String(j);
      addStep(2,`Compare a[${j}]=${a[j]} with current min a[${minIdx}]=${a[minIdx]}`,"compare",{ci:[j,minIdx],explanation:`Is a[${j}]=${a[j]} < current min ${a[minIdx]}? → ${a[j]<a[minIdx]?"YES! New minimum found.":"No, keep current minimum."}`});
      if(a[j]<a[minIdx]){
        minIdx=j; vars["minIdx"]=String(minIdx);
        addStep(2,`New min! minIdx=${minIdx}, val=${a[minIdx]}`,"assign",{ai:[minIdx],explanation:`🎯 New minimum found: a[${minIdx}]=${a[minIdx]}. This is the smallest we've seen in the unsorted portion.`});
      }
    }
    if(minIdx!==i){
      const tmp=a[i];a[i]=a[minIdx];a[minIdx]=tmp;
      heap[name]=JSON.stringify(a);
      addStep(3,`SWAP a[${i}]↔a[${minIdx}] → [${a.join(",")}]`,"swap",{si:[i,minIdx],explanation:`🔀 Minimum ${a[i]} placed at position ${i}. It joins the sorted portion permanently.`});
    } else {
      addStep(3,`a[${i}]=${a[i]} is already minimum, no swap needed`,"mark",{ai:[i],explanation:`✅ a[${i}] is already the minimum of the unsorted portion. No swap needed.`});
    }
    addStep(3,`Position ${i} sorted. Sorted: [${a.slice(0,i+1).join(",")}]`,"mark",{ai:Array.from({length:i+1},(_,k)=>k),explanation:`Sorted portion grows to ${i+1} elements.`});
  }
  addStep(lines.length-1,`Selection Sort done: [${a.join(",")}]`,"mark",{ai:Array.from({length:n},(_,k)=>k),explanation:`🏁 Done! Selection Sort always makes exactly n(n-1)/2 = ${n*(n-1)/2} comparisons regardless of input. Time: O(n²), Space: O(1).`});
  return steps;
}

// ── INSERTION SORT ────────────────────────────────────────────────
function traceInsertion(lines, arr, name, addStep, vars, heap, steps) {
  const a=[...arr];
  heap[name]=JSON.stringify(a);
  addStep(0,`Insertion Sort on [${a.join(",")}]`,"assign",{explanation:`🃏 Insertion Sort: Like sorting cards in your hand. Pick up one card at a time and insert it at the correct position in the already-sorted left portion.`});
  for(let i=1;i<a.length&&steps.length<750;i++){
    const key=a[i]; vars["i"]=String(i); vars["key"]=String(key);
    addStep(1,`Pick key=a[${i}]=${key}. Sorted left: [${a.slice(0,i).join(",")}]`,"assign",{ai:[i],explanation:`✋ Picking element at position ${i}: key=${key}. The left portion [${a.slice(0,i).join(",")}] is already sorted. We find where key belongs there.`});
    let j=i-1;
    while(j>=0&&a[j]>key&&steps.length<750){
      vars["j"]=String(j);
      addStep(2,`a[${j}]=${a[j]} > key=${key}, shift right`,"compare",{ci:[j],explanation:`${a[j]} > ${key}, so we shift a[${j}] one step right to make room for key.`});
      a[j+1]=a[j]; j--;
      heap[name]=JSON.stringify(a);
      addStep(2,`Shifted. Array: [${a.join(",")}]`,"swap",{explanation:`Element moved right by one position.`});
    }
    a[j+1]=key; heap[name]=JSON.stringify(a);
    addStep(3,`Insert key=${key} at position ${j+1}. Array: [${a.join(",")}]`,"mark",{ai:[j+1],explanation:`📌 Inserted ${key} at index ${j+1}. Sorted left portion is now [${a.slice(0,i+1).join(",")}].`});
  }
  addStep(lines.length-1,`Done: [${a.join(",")}]`,"mark",{ai:Array.from({length:a.length},(_,k)=>k),explanation:`🏁 Insertion Sort complete! O(n) for nearly-sorted inputs, O(n²) worst case. Excellent for small arrays and streaming data.`});
  return steps;
}

// ── MERGE SORT ────────────────────────────────────────────────────
function traceMerge(lines, arr, name, addStep, vars, heap, steps) {
  const a=[...arr];
  heap[name]=JSON.stringify(a);
  addStep(0,`Merge Sort on [${a.join(",")}]`,"assign",{explanation:`🌳 Merge Sort: Divide-and-conquer. Split array in half recursively until single elements, then merge sorted halves. Guaranteed O(n log n) — never degrades.`});
  function ms(arr,depth){
    if(arr.length<=1){
      addStep(Math.min(depth,lines.length-1),`Base case: [${arr.join(",")}] — trivially sorted`,"return",{depth,explanation:`🎯 A single element is always sorted. Returning it directly.`});
      return arr;
    }
    const mid=Math.floor(arr.length/2);
    addStep(Math.min(depth+1,lines.length-1),`Split [${arr.join(",")}] → L=[${arr.slice(0,mid).join(",")}] R=[${arr.slice(mid).join(",")}]`,"recurse",{depth,explanation:`✂️ Splitting at index ${mid}. Left=[${arr.slice(0,mid).join(",")}], Right=[${arr.slice(mid).join(",")}]. Each half will be recursively sorted.`});
    if(steps.length>=750)return arr;
    const L=ms(arr.slice(0,mid),depth+1);
    const R=ms(arr.slice(mid),depth+1);
    if(steps.length>=750)return arr;
    addStep(Math.min(depth+1,lines.length-1),`Merge [${L.join(",")}] + [${R.join(",")}]`,"call",{depth,explanation:`🤝 Both halves are sorted. Now merging by comparing front elements and always taking the smaller one.`});
    const merged=[]; let li=0,ri=0;
    while(li<L.length&&ri<R.length&&steps.length<750){
      addStep(Math.min(depth+2,lines.length-1),`L[${li}]=${L[li]} vs R[${ri}]=${R[ri]} → take ${L[li]<=R[ri]?L[li]:R[ri]}`,"compare",{explanation:`${L[li]<=R[ri]?`✅ L[${li}]=${L[li]} ≤ R[${ri}]=${R[ri]}, take from left.`:`✅ R[${ri}]=${R[ri]} < L[${li}]=${L[li]}, take from right.`}`});
      if(L[li]<=R[ri])merged.push(L[li++]); else merged.push(R[ri++]);
    }
    while(li<L.length)merged.push(L[li++]);
    while(ri<R.length)merged.push(R[ri++]);
    addStep(Math.min(depth+1,lines.length-1),`Merged: [${merged.join(",")}]`,"assign",{explanation:`✅ Merge complete. Result: [${merged.join(",")}]`});
    return merged;
  }
  const sorted=ms(a,0);
  heap[name]=JSON.stringify(sorted);
  addStep(lines.length-1,`Sorted: [${sorted.join(",")}]`,"mark",{ai:Array.from({length:sorted.length},(_,k)=>k),explanation:`🏁 Merge Sort done! O(n log n) guaranteed. Stable sort. Uses O(n) extra space. log₂(${a.length}) ≈ ${Math.ceil(Math.log2(a.length))} levels of recursion.`});
  return steps;
}

// ── QUICK SORT ────────────────────────────────────────────────────
function traceQuick(lines, arr, name, addStep, vars, heap, steps) {
  const a=[...arr];
  heap[name]=JSON.stringify(a);
  addStep(0,`Quick Sort on [${a.join(",")}]`,"assign",{explanation:`⚡ Quick Sort: Choose a pivot, partition so all smaller go left, all larger go right, then recurse. Average O(n log n), in-place.`});
  function partition(low,high){
    const pivot=a[high]; vars["pivot"]=String(pivot);
    addStep(2,`Partition a[${low}..${high}], pivot=a[${high}]=${pivot}`,"assign",{ai:[high],explanation:`🎯 Pivot=${pivot}. We'll rearrange so everything ≤ pivot is left of it, everything > pivot is right.`});
    let i=low-1; vars["i"]=String(i);
    for(let j=low;j<high&&steps.length<750;j++){
      vars["j"]=String(j);
      addStep(3,`a[${j}]=${a[j]} ≤ pivot ${pivot}? → ${a[j]<=pivot}`,"compare",{ci:[j,high],explanation:`${a[j]<=pivot?`✅ ${a[j]} ≤ pivot ${pivot}: belongs in left partition.`:`❌ ${a[j]} > pivot ${pivot}: stays in right partition.`}`});
      if(a[j]<=pivot){
        i++; vars["i"]=String(i);
        if(i!==j){const tmp=a[i];a[i]=a[j];a[j]=tmp;heap[name]=JSON.stringify(a);addStep(4,`SWAP a[${i}]↔a[${j}]: [${a.join(",")}]`,"swap",{si:[i,j],explanation:`🔀 Moving ${a[i]} to left partition.`});}
      }
      if(steps.length>=750)break;
    }
    const tmp=a[i+1];a[i+1]=a[high];a[high]=tmp; heap[name]=JSON.stringify(a);
    addStep(4,`Place pivot ${pivot} at index ${i+1}: [${a.join(",")}]`,"mark",{ai:[i+1],explanation:`📌 Pivot ${pivot} placed at its FINAL sorted position ${i+1}. Left side ≤ pivot, right side > pivot.`});
    return i+1;
  }
  function qs(low,high){
    if(low>=high||steps.length>=750)return;
    addStep(1,`quicksort a[${low}..${high}]: [${a.slice(low,high+1).join(",")}]`,"recurse",{explanation:`Recursing into subarray indices ${low} to ${high}.`});
    const pi=partition(low,high);
    if(steps.length<750)qs(low,pi-1);
    if(steps.length<750)qs(pi+1,high);
  }
  qs(0,a.length-1);
  heap[name]=JSON.stringify(a);
  addStep(lines.length-1,`Sorted: [${a.join(",")}]`,"mark",{ai:Array.from({length:a.length},(_,k)=>k),explanation:`🏁 Quick Sort done! O(n log n) average, O(n²) worst (bad pivots). In-place: O(log n) stack space.`});
  return steps;
}

// ── BINARY SEARCH ─────────────────────────────────────────────────
function traceBinSearch(lines, arr, addStep, vars, heap, steps) {
  const a=[...arr].sort((x,y)=>x-y);
  const source = lines.join("\n");
  const tm = source.match(/target\s*=\s*(-?\d+)/) || source.match(/binarySearch\s*\([^,]+,\s*(-?\d+)\s*\)/i);
  const target=tm?parseInt(tm[1]):a[Math.floor(a.length/2)];
  heap["arr"]=JSON.stringify(a); vars["target"]=String(target);
  addStep(0,`Binary Search for ${target} in [${a.join(",")}]`,"assign",{explanation:`🔍 Binary Search: Works on SORTED arrays. Each step eliminates HALF the remaining elements. O(log n) — for 1000 elements, at most 10 comparisons!`});
  let left=0,right=a.length-1,iter=0;
  while(left<=right&&steps.length<750){
    iter++;
    const mid=Math.floor((left+right)/2);
    vars["left"]=String(left); vars["right"]=String(right); vars["mid"]=String(mid);
    addStep(2,`Iter ${iter}: left=${left}, mid=${mid}, right=${right}`,"loop",{ai:[mid],ptrs:{left,mid,right},explanation:`🔎 Search space: a[${left}..${right}] = [${a.slice(left,right+1).join(",")}]. Midpoint: a[${mid}]=${a[mid]}. ${right-left+1} elements remain.`});
    addStep(3,`a[mid]=${a[mid]} vs target=${target} → ${a[mid]===target?"FOUND":a[mid]<target?"too small":"too large"}`,"compare",{ci:[mid],ptrs:{left,mid,right},explanation:a[mid]===target?`🎉 a[${mid}]=${a[mid]} === target=${target}! Found in ${iter} comparison(s) instead of ${a.length} in linear search!`:a[mid]<target?`📍 a[${mid}]=${a[mid]} < ${target}: target must be in RIGHT half a[${mid+1}..${right}]. Move left pointer → ${mid+1}.`:`📍 a[${mid}]=${a[mid]} > ${target}: target must be in LEFT half a[${left}..${mid-1}]. Move right pointer → ${mid-1}.`});
    if(a[mid]===target){vars["result"]=String(mid);addStep(3,`FOUND ${target} at index ${mid}!`,"return",{ai:[mid],explanation:`✅ Found at index ${mid}! It took only ${iter} step(s) vs ${a.length} in linear search.`});return steps;}
    else if(a[mid]<target)left=mid+1; else right=mid-1;
  }
  addStep(lines.length-1,`${target} not found.`,"return",{explanation:`❌ Target ${target} not in array. Binary search exhausted all possibilities.`});
  return steps;
}

// ── TWO POINTERS ──────────────────────────────────────────────────
function traceTwoPointers(lines, arr, addStep, vars, heap, steps) {
  const a=[...arr].sort((x,y)=>x-y);
  const tm=lines.join("\n").match(/target\s*=\s*(-?\d+)/);
  const target=tm?parseInt(tm[1]):a[Math.floor(a.length/2)]+a[Math.floor(a.length/3)];
  heap["arr"]=JSON.stringify(a); vars["target"]=String(target);
  addStep(0,`Two Pointers: sorted=[${a.join(",")}], target=${target}`,"assign",{explanation:`👆👆 Two Pointer: On a sorted array, start left at 0 and right at end. If sum too small → move left right. If too large → move right left. O(n) after O(n log n) sort.`});
  let left=0,right=a.length-1;
  while(left<right&&steps.length<750){
    const sum=a[left]+a[right];
    vars["left"]=String(left); vars["right"]=String(right); vars["sum"]=String(sum);
    addStep(2,`a[${left}]=${a[left]} + a[${right}]=${a[right]} = ${sum} vs ${target}`,"compare",{ci:[left,right],ptrs:{left,right},explanation:`📊 Sum=${a[left]}+${a[right]}=${sum} vs target=${target}. ${sum===target?"🎉 Equal!":sum<target?"⬆ Too small → move left pointer right to increase sum.":"⬇ Too large → move right pointer left to decrease sum."}`});
    if(sum===target){addStep(3,`Found! a[${left}]+a[${right}]=${a[left]}+${a[right]}=${target}`,"return",{ci:[left,right],ptrs:{left,right},explanation:`🎉 Target sum ${target} achieved with a[${left}]=${a[left]} and a[${right}]=${a[right]}`});left++;right--;}
    else if(sum<target){left++;addStep(3,`Sum<target, move left→${left}`,"assign",{ptrs:{left,right},explanation:`Sum ${sum} < target ${target}: increase sum by moving left pointer right.`});}
    else{right--;addStep(3,`Sum>target, move right→${right}`,"assign",{ptrs:{left,right},explanation:`Sum ${sum} > target ${target}: decrease sum by moving right pointer left.`});}
  }
  addStep(lines.length-1,"Two pointers search complete","mark",{explanation:`🏁 Done! Two Pointers: O(n) time. Classic technique for pair-sum problems on sorted arrays.`});
  return steps;
}

// ── SLIDING WINDOW ────────────────────────────────────────────────
function traceSliding(lines, arr, addStep, vars, heap, steps) {
  const nums=arr.length>2?[...arr]:[1,3,-1,-3,5,3,6,7];
  const k=3; vars["k"]=String(k);
  heap["nums"]=JSON.stringify(nums);
  addStep(0,`Sliding Window Max on [${nums.join(",")}], k=${k}`,"assign",{explanation:`🪟 Sliding Window Maximum: Maintain a window of k elements. Use a deque (monotone decreasing) to track the maximum in O(1) per step. Total: O(n).`});
  const dq=[],result=[];
  for(let i=0;i<nums.length&&steps.length<750;i++){
    vars["i"]=String(i);
    heap["deque"]=JSON.stringify(dq.map(d=>`[${d}]=${nums[d]}`));
    addStep(1,`i=${i}, nums[i]=${nums[i]}`,"loop",{ai:Array.from({length:Math.min(i+1,k)},(_,p)=>i-p).filter(x=>x>=0),explanation:`Processing nums[${i}]=${nums[i]}.`});
    while(dq.length&&dq[0]<i-k+1){
      addStep(2,`Remove front ${dq[0]} (out of window)`,"dequeue",{explanation:`Index ${dq[0]} is outside window [${Math.max(0,i-k+1)}..${i}]. Remove from deque front.`});
      dq.shift();
    }
    while(dq.length&&nums[dq[dq.length-1]]<nums[i]){
      const rm=dq.pop();
      addStep(3,`Pop ${rm} (nums[${rm}]=${nums[rm]} < nums[${i}]=${nums[i]})`,"pop",{explanation:`nums[${rm}]=${nums[rm]} will never be a window maximum since nums[${i}]=${nums[i]}>${nums[rm]}. Remove it.`});
    }
    dq.push(i);
    heap["deque"]=JSON.stringify(dq.map(d=>`[${d}]=${nums[d]}`));
    addStep(4,`Push ${i} to deque: [${dq.map(d=>`${d}(${nums[d]})`).join(",")}]`,"push",{ai:[i],explanation:`Index ${i} added to deque. Deque is monotone decreasing.`});
    if(i>=k-1){
      const mx=nums[dq[0]]; result.push(mx);
      vars["result"]=JSON.stringify(result);
      addStep(4,`Window max=nums[${dq[0]}]=${mx}. Result:[${result.join(",")}]`,"assign",{ai:[dq[0]],explanation:`🏆 Window [${i-k+1}..${i}] max is ${mx} (front of deque). Added to result.`});
    }
  }
  addStep(lines.length-1,`Result: [${result.join(",")}]`,"mark",{explanation:`🏁 Done! Each element enters/exits deque at most once → O(n). Much better than naive O(nk).`});
  return steps;
}

// ── BFS ───────────────────────────────────────────────────────────
function traceBFS(lines, addStep, vars, heap, steps, src) {
  const g=extractGraph(src)||{0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1,5],5:[2,4]};
  const start=0, n=Object.keys(g).length;
  heap["graph"]=Object.entries(g).map(([k,v])=>`${k}:[${v}]`).join(" ");
  heap["queue"]=`front→[${start}]←back`; heap["visited"]=`{${start}}`;
  addStep(0,`BFS from node ${start}`,"call",{explanation:`🌊 Breadth-First Search: Explore level by level, like ripples on water. Uses a QUEUE (FIFO). Guarantees shortest path in unweighted graphs. O(V+E).`});
  const visited=new Set([start]),queue=[start],order=[];
  vars["start"]=String(start); let level=0;
  while(queue.length&&steps.length<750){
    const sz=queue.length;
    addStep(2,`Level ${level}: processing [${queue.join(",")}]`,"loop",{explanation:`📊 BFS Level ${level}: Processing ${sz} node(s). All nodes at distance ${level} from source processed before going to distance ${level+1}.`});
    for(let k=0;k<sz&&steps.length<750;k++){
      const node=queue.shift(); order.push(node);
      vars["node"]=String(node); vars["order"]=JSON.stringify(order);
      heap["queue"]=`front→[${queue.join(",")}]←back`;
      heap["visited"]=`{${[...visited].join(",")}}`;
      addStep(3,`Dequeue ${node}. Visited order: [${order.join("→")}]`,"dequeue",{nv:node,explanation:`🔵 Visiting node ${node}. Now exploring all its unvisited neighbors.`});
      for(const nb of (g[node]||[])){
        addStep(4,`Neighbor ${nb}: visited=${visited.has(nb)}`,"compare",{explanation:visited.has(nb)?`⏭ Node ${nb} already visited. Skip.`:`✅ Node ${nb} not yet visited. Enqueue it.`});
        if(!visited.has(nb)){
          visited.add(nb); queue.push(nb);
          heap["queue"]=`front→[${queue.join(",")}]←back`;
          heap["visited"]=`{${[...visited].join(",")}}`;
          addStep(5,`Enqueue ${nb}. Queue:[${queue.join(",")}]`,"enqueue",{nv:nb,explanation:`Added node ${nb} to back of queue.`});
        }
        if(steps.length>=750)break;
      }
    }
    level++;
  }
  addStep(lines.length-1,`BFS done. Order: ${order.join("→")}`,"mark",{explanation:`🏁 BFS visited all ${n} reachable nodes in ${level} levels. Order: ${order.join("→")}. Time: O(V+E).`});
  return steps;
}

// ── DFS ───────────────────────────────────────────────────────────
function traceDFS(lines, addStep, vars, heap, steps, src) {
  const g=extractGraph(src)||{0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1,5],5:[2,4]};
  const start=0;
  heap["graph"]=Object.entries(g).map(([k,v])=>`${k}:[${v}]`).join(" ");
  addStep(0,`DFS from node ${start}`,"call",{explanation:`🌲 Depth-First Search: Explore as deep as possible before backtracking. Like navigating a maze — always go deeper until stuck, then backtrack. Uses recursion (implicit stack). O(V+E).`});
  const visited=new Set(),order=[];
  function dfs(node,depth){
    if(steps.length>=750)return;
    visited.add(node); order.push(node);
    vars["node"]=String(node); vars["depth"]=String(depth);
    heap["visited"]=`{${[...visited].join(",")}}`;
    addStep(2,`Visit ${node} (depth ${depth}). Order:[${order.join("→")}]`,"recurse",{nv:node,depth,explanation:`🔵 DFS at node ${node}, depth ${depth}. Marking visited, then exploring all unvisited neighbors recursively.`});
    for(const nb of (g[node]||[])){
      addStep(3,`Check neighbor ${nb}: visited=${visited.has(nb)}`,"compare",{explanation:visited.has(nb)?`⏭ ${nb} already visited. Backtracking (cycle/revisit).`:`✅ ${nb} not visited. Recursing into it.`});
      if(!visited.has(nb)){
        addStep(4,`DFS recurse into ${nb}`,"call",{depth,explanation:`Going deeper into node ${nb}.`});
        dfs(nb,depth+1);
        if(steps.length<750)addStep(4,`Backtrack to ${node} from ${nb}`,"return",{depth,explanation:`↩ All paths from ${nb} explored. Returning to ${node}.`});
      }
      if(steps.length>=750)break;
    }
  }
  dfs(start,0);
  addStep(lines.length-1,`DFS done. Order: ${order.join("→")}`,"mark",{explanation:`🏁 DFS complete! Visited all reachable nodes. Order: ${order.join("→")}. Time: O(V+E).`});
  return steps;
}

// ── DIJKSTRA ──────────────────────────────────────────────────────
function traceDijkstra(lines, addStep, vars, heap, steps) {
  const g={0:{1:4,2:2},1:{3:5},2:{1:1,3:8},3:{}};
  const dist={0:0,1:Infinity,2:Infinity,3:Infinity};
  const pq=[[0,0]]; const vis=new Set();
  heap["dist"]=JSON.stringify(Object.entries(dist).map(([k,v])=>`d[${k}]=${v===Infinity?"∞":v}`).join(" "));
  addStep(0,"Dijkstra SSSP from node 0","assign",{explanation:`🗺️ Dijkstra's Algorithm: Find shortest paths from source to all nodes. Greedily processes the closest unvisited node. Uses min-priority queue. O((V+E) log V).`});
  while(pq.length&&steps.length<750){
    pq.sort((a,b)=>a[0]-b[0]);
    const [d,u]=pq.shift();
    vars["u"]=String(u); vars["dist_u"]=String(d);
    heap["dist"]=Object.entries(dist).map(([k,v])=>`d[${k}]=${v===Infinity?"∞":v}`).join(" ");
    heap["visited"]=`{${[...vis].join(",")}}`;
    if(vis.has(u)){addStep(2,`Skip node ${u} (finalized)`,"compare",{explanation:`Node ${u} already has its shortest distance finalized.`});continue;}
    vis.add(u);
    addStep(2,`Process node ${u}: dist=${d}`,"mark",{nv:u,explanation:`✅ Finalizing shortest distance to node ${u}: ${d}. It's now permanent.`});
    for(const [v,w] of Object.entries(g[u]||{})){
      const nd=d+Number(w);
      addStep(3,`Relax ${u}→${v}: ${d}+${w}=${nd} vs dist[${v}]=${dist[v]===Infinity?"∞":dist[v]}`,"compare",{explanation:nd<dist[v]?`🎯 ${nd} < ${dist[v]===Infinity?"∞":dist[v]}: Better path found! Update dist[${v}]=${nd}.`:`❌ ${nd} ≥ ${dist[v]===Infinity?"∞":dist[v]}: No improvement.`});
      if(nd<dist[v]){
        dist[v]=nd; vars[`dist[${v}]`]=String(nd);
        heap["dist"]=Object.entries(dist).map(([k,v2])=>`d[${k}]=${v2===Infinity?"∞":v2}`).join(" ");
        pq.push([nd,parseInt(v)]);
        addStep(4,`Update dist[${v}]=${nd}, add to PQ`,"assign",{explanation:`Shorter path to node ${v} via node ${u}: ${nd}.`});
      }
    }
  }
  addStep(lines.length-1,`Dijkstra done. Distances: ${Object.entries(dist).map(([k,v])=>`d[${k}]=${v}`).join(", ")}`,"mark",{explanation:`🏁 All shortest distances computed! ${Object.entries(dist).map(([k,v])=>`${k}:${v}`).join(", ")}`});
  return steps;
}

// ── FIBONACCI DP ──────────────────────────────────────────────────
function traceFib(lines, addStep, vars, heap, steps) {
  const n=9; const dp=new Array(n+1).fill(0); dp[0]=0; dp[1]=1;
  vars["n"]=String(n); heap["dp"]=JSON.stringify(dp);
  addStep(0,`Fibonacci DP: compute fib(0..${n})`,"assign",{explanation:`🌀 Fibonacci with DP (bottom-up): Instead of recursively recomputing sub-results, store them. fib(n) = fib(n-1) + fib(n-2). O(n) time, O(n) space — vs O(2ⁿ) naive recursion!`});
  addStep(1,`Base cases: dp[0]=0, dp[1]=1`,"assign",{mc:[{i:0,val:0,isNew:true},{i:1,val:1,isNew:true}],explanation:`📌 Base cases are the foundation of DP. fib(0)=0 and fib(1)=1 by definition.`});
  for(let i=2;i<=n&&steps.length<750;i++){
    dp[i]=dp[i-1]+dp[i-2]; vars["i"]=String(i); vars[`dp[${i}]`]=String(dp[i]);
    heap["dp"]=JSON.stringify(dp);
    addStep(2,`dp[${i}] = dp[${i-1}](${dp[i-1]}) + dp[${i-2}](${dp[i-2]}) = ${dp[i]}`,"memo",{mc:dp.map((v,idx)=>({i:idx,val:v,isNew:idx===i,isUsed:idx===i-1||idx===i-2})),explanation:`💾 dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}. This value is now cached — future calls return it instantly.`});
  }
  addStep(lines.length-1,`fib sequence: [${dp.join(",")}]`,"mark",{explanation:`🏁 All Fibonacci numbers up to n=${n} computed in O(n) time. Memoization turned exponential recursion into linear iteration!`});
  return steps;
}

// ── KNAPSACK ─────────────────────────────────────────────────────
function traceKnapsack(lines, src, addStep, vars, heap, steps) {
  const wm=src.match(/weights\s*=\s*\[([0-9,\s]+)\]/),vm=src.match(/values\s*=\s*\[([0-9,\s]+)\]/);
  const W=wm?wm[1].split(",").map(s=>parseInt(s.trim())):[2,3,4,5];
  const V=vm?vm[1].split(",").map(s=>parseInt(s.trim())):[3,4,5,6];
  const cap=8, n=Math.min(W.length,V.length);
  const dp=Array.from({length:n+1},()=>new Array(cap+1).fill(0));
  heap["weights"]=JSON.stringify(W.slice(0,n)); heap["values"]=JSON.stringify(V.slice(0,n));
  addStep(0,`0/1 Knapsack: ${n} items, capacity=${cap}`,"assign",{explanation:`🎒 0/1 Knapsack DP: For each item, decide: include (if weight allows) or exclude. dp[i][w] = max value using first i items with capacity w. O(nW) time and space.`});
  for(let i=1;i<=n&&steps.length<750;i++){
    for(let w=0;w<=cap&&steps.length<750;w++){
      if(W[i-1]<=w){
        const incl=V[i-1]+dp[i-1][w-W[i-1]]; const excl=dp[i-1][w];
        dp[i][w]=Math.max(excl,incl);
        addStep(2,`dp[${i}][${w}] = max(excl=${excl}, incl=${incl}) = ${dp[i][w]}`,"memo",{mc:[{i,j:w,val:dp[i][w],isNew:true}],explanation:`Item ${i} (w=${W[i-1]},v=${V[i-1]}): exclude→${excl}, include→${incl}. Take max=${dp[i][w]}.`});
      } else {
        dp[i][w]=dp[i-1][w];
        addStep(2,`dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]} (item too heavy)`,"assign",{explanation:`Item ${i} weighs ${W[i-1]} > capacity ${w}. Cannot include. Inherit dp[${i-1}][${w}]=${dp[i][w]}.`});
      }
      vars["dp"]=`dp[${i}][${w}]=${dp[i][w]}`;
    }
  }
  addStep(lines.length-1,`Optimal value = dp[${n}][${cap}] = ${dp[n][cap]}`,"return",{explanation:`🏁 Maximum value achievable = ${dp[n][cap]}!`});
  return steps;
}

// ── COIN CHANGE ───────────────────────────────────────────────────
function traceCoin(lines, src, addStep, vars, heap, steps) {
  const cm=src.match(/coins\s*=\s*\[([0-9,\s]+)\]/);
  const coins=cm?cm[1].split(",").map(s=>parseInt(s.trim())):[1,5,6,9];
  const am=src.match(/amount\s*=\s*(\d+)/);
  const amount=am?parseInt(am[1]):11;
  const dp=new Array(amount+1).fill(Infinity); dp[0]=0;
  heap["coins"]=JSON.stringify(coins); vars["amount"]=String(amount);
  addStep(0,`Coin Change: coins=[${coins.join(",")}], amount=${amount}`,"assign",{explanation:`🪙 Coin Change DP (bottom-up): dp[i] = fewest coins to make amount i. For each amount, try all coins. O(amount × coins).`});
  addStep(1,`Init: dp[0]=0, dp[1..${amount}]=∞`,"assign",{mc:dp.map((v,i)=>({i,val:v===Infinity?"∞":v,isNew:true})),explanation:`Base case: dp[0]=0 (0 coins needed for amount 0). All others start as ∞ (impossible until proven).`});
  for(let i=1;i<=amount&&steps.length<750;i++){
    for(const coin of coins){
      if(coin<=i&&dp[i-coin]+1<dp[i]){
        dp[i]=dp[i-coin]+1;
        vars[`dp[${i}]`]=String(dp[i]);
        heap["dp"]=JSON.stringify(dp.map(v=>v===Infinity?"∞":v));
        addStep(2,`dp[${i}] = dp[${i-coin}]+1 = ${dp[i]} (using coin ${coin})`,"memo",{mc:dp.map((v,idx)=>({i:idx,val:v===Infinity?"∞":v,isNew:idx===i,isUsed:idx===i-coin})),explanation:`💡 Amount ${i}: Using coin ${coin}, dp[${i-coin}]+1=${dp[i]}. New best!`});
      }
    }
  }
  addStep(lines.length-1,`Min coins for ${amount}: ${dp[amount]===Infinity?-1:dp[amount]}`,"return",{explanation:`🏁 Answer: ${dp[amount]===Infinity?"Impossible":dp[amount]+" coins"}. dp[${amount}]=${dp[amount]===Infinity?"∞":dp[amount]}.`});
  return steps;
}

// ── LCS ───────────────────────────────────────────────────────────
function traceLCS(lines, addStep, vars, heap, steps) {
  const s1="ABCBDAB",s2="BDCAB", m=s1.length,n=s2.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  vars["s1"]=s1; vars["s2"]=s2;
  addStep(0,`LCS of "${s1}" and "${s2}"`,"assign",{explanation:`🧬 Longest Common Subsequence: dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]. Match → extend diagonal; else → max of top/left. O(mn) time and space.`});
  for(let i=1;i<=m&&steps.length<750;i++){
    for(let j=1;j<=n&&steps.length<750;j++){
      if(s1[i-1]===s2[j-1]){dp[i][j]=dp[i-1][j-1]+1;addStep(2,`s1[${i-1}]='${s1[i-1]}'=s2[${j-1}]='${s2[j-1]}' → dp[${i}][${j}]=${dp[i][j]}`,"memo",{explanation:`✅ Match! '${s1[i-1]}'='${s2[j-1]}'. Extend LCS: dp[${i}][${j}]=dp[${i-1}][${j-1}]+1=${dp[i][j]}.`});}
      else{dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);addStep(2,`'${s1[i-1]}'≠'${s2[j-1]}' → dp[${i}][${j}]=max(${dp[i-1][j]},${dp[i][j-1]})=${dp[i][j]}`,"assign",{explanation:`❌ No match. Take best of ignoring last char of s1 or s2.`});}
      vars["dp"]=`dp[${i}][${j}]=${dp[i][j]}`;
    }
  }
  addStep(lines.length-1,`LCS length = ${dp[m][n]}`,"return",{explanation:`🏁 LCS length=${dp[m][n]} between "${s1}" and "${s2}".`});
  return steps;
}

// ── EDIT DISTANCE ─────────────────────────────────────────────────
function traceEditDist(lines, addStep, vars, heap, steps) {
  const s1="horse",s2="ros",m=s1.length,n=s2.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  vars["s1"]=s1; vars["s2"]=s2;
  addStep(0,`Edit Distance: "${s1}" → "${s2}"`,"assign",{explanation:`✏️ Edit Distance (Levenshtein): Minimum operations (insert/delete/replace) to transform s1 into s2. dp[i][j] = edit dist of s1[0..i-1] and s2[0..j-1]. O(mn).`});
  for(let i=1;i<=m&&steps.length<750;i++){
    for(let j=1;j<=n&&steps.length<750;j++){
      if(s1[i-1]===s2[j-1]){dp[i][j]=dp[i-1][j-1];addStep(2,`'${s1[i-1]}'='${s2[j-1]}': no op. dp[${i}][${j}]=${dp[i][j]}`,"assign",{explanation:`✅ Same character — no edit needed. Inherit diagonal.`});}
      else{dp[i][j]=1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);const ops=["delete","insert","replace"];const best=ops[[dp[i-1][j],dp[i][j-1],dp[i-1][j-1]].indexOf(dp[i][j]-1)];addStep(2,`'${s1[i-1]}'≠'${s2[j-1]}': ${best} → dp[${i}][${j}]=${dp[i][j]}`,"memo",{explanation:`❌ Different chars. Best operation: ${best} with cost ${dp[i][j]}.`});}
      vars[`dp[${i}][${j}]`]=String(dp[i][j]);
    }
  }
  addStep(lines.length-1,`Edit distance = ${dp[m][n]}`,"return",{explanation:`🏁 Minimum edits from "${s1}" to "${s2}" = ${dp[m][n]}.`});
  return steps;
}

// ── FACTORIAL (RECURSION) ─────────────────────────────────────────
function traceFactorial(lines, src, addStep, vars, heap, steps) {
  const nm=src.match(/factorial\s*\(\s*(\d+)\s*\)/);
  const n=nm?parseInt(nm[1]):6;
  vars["n"]=String(n);
  addStep(0,`Compute factorial(${n})`,"call",{explanation:`🔢 Factorial via recursion: n! = n × (n-1)!  Base case: 0!=1!=1. Each call pushes a new frame onto the call stack. Stack depth = n.`});
  function fact(k,depth){
    if(steps.length>=750)return 1;
    vars["n"]=String(k); vars["depth"]=String(depth);
    addStep(Math.min(depth,lines.length-1),`factorial(${k}) called (depth=${depth})`,"recurse",{depth,explanation:`📞 Call factorial(${k}). Call stack depth: ${depth}. ${k<=1?"⚡ Base case! Return 1.":`Will call factorial(${k-1}) and multiply by ${k}.`}`});
    if(k<=1){addStep(Math.min(depth+1,lines.length-1),`Base case: return 1`,"return",{rv:1,depth,explanation:`🎯 Base case hit! factorial(1)=1. Start unwinding the call stack.`});return 1;}
    const sub=fact(k-1,depth+1);
    const res=k*sub;
    if(steps.length<750)addStep(Math.min(depth,lines.length-1),`return ${k}×factorial(${k-1})=${k}×${sub}=${res}`,"return",{rv:res,depth,explanation:`↩ Back at factorial(${k}). ${k} × ${sub} = ${res}.`});
    return res;
  }
  const res=fact(n,0); vars["result"]=String(res);
  addStep(lines.length-1,`factorial(${n}) = ${res}`,"mark",{explanation:`🏁 ${n}! = ${res}. The recursion used ${n} stack frames, each containing its own value of n.`});
  return steps;
}

// ── N-QUEENS ──────────────────────────────────────────────────────
function traceNQueens(lines, addStep, vars, heap, steps) {
  const n=4; const board=new Array(n).fill(-1); let solutions=0;
  vars["n"]=String(n); heap["board"]=JSON.stringify(board);
  addStep(0,`Solve ${n}-Queens problem`,"call",{explanation:`♛ N-Queens Backtracking: Place ${n} queens on a ${n}×${n} board so none attack each other. Try each column in each row; if safe, place queen and recurse; if stuck, backtrack.`});
  function isSafe(row,col){for(let r=0;r<row;r++){if(board[r]===col||Math.abs(board[r]-col)===Math.abs(r-row))return false;}return true;}
  function backtrack(row){
    if(steps.length>=750)return;
    if(row===n){solutions++;vars["solutions"]=String(solutions);addStep(Math.min(row,lines.length-1),`✅ Solution #${solutions}: [${board.join(",")}]`,"mark",{explanation:`🎉 Valid arrangement found! Queens at cols: [${board.join(",")}]. Solution #${solutions}.`});return;}
    addStep(Math.min(row,lines.length-1),`Row ${row}: trying columns 0..${n-1}`,"loop",{explanation:`Row ${row}: Try placing queen in each column and check safety.`});
    for(let col=0;col<n&&steps.length<750;col++){
      vars["row"]=String(row); vars["col"]=String(col);
      const safe=isSafe(row,col);
      addStep(Math.min(row+1,lines.length-1),`(${row},${col}): safe=${safe}`,"compare",{explanation:safe?`✅ (${row},${col}) is safe — no queen attacks this position.`:`❌ (${row},${col}) is under attack. Try next column.`});
      if(safe){
        board[row]=col; heap["board"]=JSON.stringify(board);
        addStep(Math.min(row+2,lines.length-1),`Place queen at (${row},${col}). Board:[${board.join(",")}]`,"assign",{explanation:`♛ Queen placed at row ${row}, column ${col}.`});
        backtrack(row+1);
        board[row]=-1; heap["board"]=JSON.stringify(board);
        if(steps.length<750)addStep(Math.min(row+2,lines.length-1),`Backtrack from (${row},${col})`,"return",{explanation:`↩ Backtracking. Removing queen from (${row},${col}) to try other columns.`});
      }
    }
  }
  backtrack(0);
  addStep(lines.length-1,`${n}-Queens: ${solutions} solutions found`,"mark",{explanation:`🏁 Found ${solutions} valid arrangement(s) for ${n}-Queens problem.`});
  return steps;
}

// ── PERMUTATIONS ──────────────────────────────────────────────────
function tracePermutations(lines, addStep, vars, heap, steps) {
  const nums=[1,2,3]; let count=0;
  heap["nums"]=JSON.stringify(nums);
  addStep(0,`Generate permutations of [${nums.join(",")}]`,"call",{explanation:`🎲 Permutations via backtracking: Swap each element to the current position, recurse, then swap back. Generates all n! arrangements. For n=3: 3!=6 permutations.`});
  function perm(arr,start){
    if(steps.length>=750)return;
    if(start===arr.length-1){count++;vars["count"]=String(count);heap["current"]=JSON.stringify(arr);addStep(Math.min(start,lines.length-1),`Permutation #${count}: [${arr.join(",")}]`,"mark",{explanation:`✅ Complete permutation: [${arr.join(",")}]. This is arrangement #${count}.`});return;}
    for(let i=start;i<arr.length&&steps.length<750;i++){
      vars["start"]=String(start); vars["i"]=String(i);
      const tmp=arr[start];arr[start]=arr[i];arr[i]=tmp;
      heap["nums"]=JSON.stringify(arr);
      addStep(Math.min(start+1,lines.length-1),`Swap arr[${start}]↔arr[${i}]: [${arr.join(",")}]`,"swap",{si:[start,i],explanation:`🔄 Swap positions ${start} and ${i} to place ${arr[start]} at position ${start}. Now recurse for positions ${start+1} onwards.`});
      perm(arr,start+1);
      const tmp2=arr[start];arr[start]=arr[i];arr[i]=tmp2;
      heap["nums"]=JSON.stringify(arr);
      if(steps.length<750)addStep(Math.min(start+1,lines.length-1),`Restore: [${arr.join(",")}]`,"return",{si:[start,i],explanation:`↩ Swap back arr[${start}]↔arr[${i}] to restore state for next iteration.`});
    }
  }
  perm([...nums],0);
  addStep(lines.length-1,`Generated ${count} permutations`,"mark",{explanation:`🏁 All ${count} permutations generated. 3! = 6. Backtracking ensures each arrangement is explored exactly once.`});
  return steps;
}

// ── SUBSETS ───────────────────────────────────────────────────────
function traceSubsets(lines, addStep, vars, heap, steps) {
  const nums=[1,2,3]; const result=[[]]; vars["nums"]=JSON.stringify(nums);
  heap["result"]=JSON.stringify(result);
  addStep(0,`Generate subsets of [${nums.join(",")}]`,"assign",{explanation:`📦 Subsets: Start with [[]] (empty set). For each number, create new subsets by adding it to all existing subsets. Total: 2ⁿ = ${Math.pow(2,nums.length)} subsets.`});
  for(const num of nums){
    const before=[...result];
    const newSubsets=result.map(sub=>[...sub,num]);
    result.push(...newSubsets);
    heap["result"]=JSON.stringify(result);
    vars["num"]=String(num); vars["count"]=String(result.length);
    addStep(2,`Add ${num}: ${result.length} subsets now`,"assign",{explanation:`Adding ${num}: Each of the ${before.length} existing subsets generates a new subset with ${num} added. ${before.length} × 2 = ${result.length} total subsets.`});
  }
  addStep(lines.length-1,`All ${result.length} subsets: ${JSON.stringify(result)}`,"mark",{explanation:`🏁 All 2³=${result.length} subsets generated! Power set of [${nums.join(",")}].`});
  return steps;
}

// ── STACK ─────────────────────────────────────────────────────────
function traceStack(lines, addStep, vars, heap, steps) {
  const inputs=["({[]})", "((())", "{[}]"];
  for(const s of inputs){
    if(steps.length>=750)break;
    const stack=[]; vars["s"]=s;
    heap["stack"]="empty";
    addStep(0,`Check balanced brackets: "${s}"`,"assign",{explanation:`🔤 Balanced Brackets using Stack: Open brackets get pushed. Close brackets must match the top of the stack. Stack empty at end = balanced.`});
    let valid=true;
    for(let i=0;i<s.length&&steps.length<750;i++){
      const c=s[i]; vars["c"]=c; vars["i"]=String(i);
      heap["stack"]=stack.length?`top→${[...stack].reverse().join("|")}←bottom`:"empty";
      if("([{".includes(c)){
        stack.push(c);
        heap["stack"]=`top→${[...stack].reverse().join("|")}←bottom`;
        addStep(1,`'${c}' is open → push. Stack:[${stack.join("")}]`,"push",{explanation:`↓ Opening bracket '${c}' pushed to stack. Stack: [${stack.join("")}].`});
      } else {
        const match={")":"(", "]":"[", "}":"{"};
        if(!stack.length||stack[stack.length-1]!==match[c]){
          addStep(2,`'${c}' has no matching opener! → INVALID`,"branch",{explanation:`❌ "${s}" is INVALID! '${c}' has no matching opening bracket.`});valid=false;break;
        }
        const popped=stack.pop();
        heap["stack"]=stack.length?`top→${[...stack].reverse().join("|")}←bottom`:"empty";
        addStep(2,`'${c}' matches '${popped}' ✓ Pop. Stack:[${stack.join("")||"empty"}]`,"pop",{explanation:`✅ '${c}' matches opener '${popped}'. Pop stack. ${stack.length===0?"Stack empty — this pair is complete.":""}`});
      }
    }
    if(valid){const ok=stack.length===0;addStep(lines.length-1,`"${s}" → ${ok?"VALID ✅":"INVALID ❌"}`,ok?"mark":"branch",{explanation:ok?`✅ Stack is empty at end — all brackets matched! "${s}" is balanced.`:`❌ Stack has [${stack.join("")}] unmatched openers. "${s}" is NOT balanced.`});}
  }
  return steps;
}

// ── HEAP ──────────────────────────────────────────────────────────
function traceHeap(lines, addStep, vars, heap, steps) {
  const nums=[5,3,8,1,9,2,7,4,6];
  const h=[]; heap["heap"]="[]";
  addStep(0,`Min-Heap operations on [${nums.join(",")}]`,"assign",{explanation:`🏔️ Min-Heap: A complete binary tree where every parent ≤ its children. Root is always the minimum. heappush: O(log n). heappop: O(log n). Building: O(n).`});
  function siftUp(arr,i){
    while(i>0){const parent=Math.floor((i-1)/2);if(arr[parent]>arr[i]){const tmp=arr[parent];arr[parent]=arr[i];arr[i]=tmp;addStep(2,`Sift up: swap a[${parent}]=${arr[parent]} ↔ a[${i}]=${arr[i]}`,"swap",{si:[parent,i],explanation:`Parent ${arr[parent]} > child ${arr[i]} — swap to maintain min-heap property.`});i=parent;}else break;}
  }
  for(const n of nums){
    if(steps.length>=750)break;
    h.push(n); heap["heap"]=JSON.stringify(h);
    addStep(1,`heappush(${n}): heap=[${h.join(",")}]`,"push",{ai:[h.length-1],explanation:`Inserting ${n}: Add at end of array (last position in complete tree), then sift up.`});
    siftUp(h,h.length-1);
    heap["heap"]=JSON.stringify(h);
    addStep(1,`After sift-up: heap=[${h.join(",")}], min=${h[0]}`,"assign",{ai:[0],explanation:`Min-heap maintained! Root=${h[0]} is the current minimum.`});
  }
  addStep(lines.length-1,`Heap built: [${h.join(",")}]. min=${h[0]}`,"mark",{ai:[0],explanation:`🏁 Min-heap built in O(n) time. Root is always minimum. Heapsort: repeatedly extract root to get sorted order.`});
  return steps;
}

// ── LINKED LIST ───────────────────────────────────────────────────
function traceLinkedList(lines, addStep, vars, heap, steps) {
  const vals=[1,2,3,4,5];
  function render(v){return v.join("→")+"→NULL";}
  heap["list"]=render(vals);
  addStep(0,`Linked List: ${render(vals)}`,"assign",{explanation:`🔗 Linked List: Nodes connected by pointers. Each node stores a value and a reference (pointer) to the next node. Last node points to NULL.`});
  addStep(1,`Traverse the list`,"call",{explanation:`Walking from head to tail, following .next pointers.`});
  for(let i=0;i<vals.length&&steps.length<750;i++){
    vars["current"]=String(vals[i]); vars["next"]=i<vals.length-1?String(vals[i+1]):"NULL";
    addStep(2,`Visit node ${vals[i]}, next→${i<vals.length-1?vals[i+1]:"NULL"}`,"assign",{ptrs:{current:i},explanation:`📍 At node val=${vals[i]}. Following .next pointer ${i<vals.length-1?`to node ${vals[i+1]}`:"to NULL — we've reached the end!"}.`});
  }
  // Simulate reversal
  addStep(3,`Reverse the linked list`,"call",{explanation:`↩ Reversal algorithm: Use 3 pointers (prev, curr, next). Make each node's .next point to its predecessor. O(n) time, O(1) space.`});
  let prev=null,curr=0; const reversed=[];
  for(let i=0;i<vals.length&&steps.length<750;i++){
    reversed.unshift(vals[i]);
    vars["prev"]=String(i>0?vals[i-1]:"NULL"); vars["curr"]=String(vals[i]);
    vars["next"]=String(i<vals.length-1?vals[i+1]:"NULL");
    heap["list"]=reversed.join("→")+"→(rest)";
    addStep(4,`curr=${vals[i]}: curr.next→prev. Reversed so far: ${reversed.join("→")}`,"assign",{explanation:`Reversing: node ${vals[i]}.next now points to ${i>0?vals[i-1]:"NULL"} (its previous predecessor).`});
  }
  heap["list"]=reversed.join("→")+"→NULL";
  addStep(lines.length-1,`Reversed: ${reversed.join("→")}→NULL`,"mark",{explanation:`🏁 Reversal complete! Original: ${vals.join("→")}. Reversed: ${reversed.join("→")}.`});
  return steps;
}

// ── TREE ──────────────────────────────────────────────────────────
function traceTree(lines, addStep, vars, heap, steps) {
  const tree={val:4,left:{val:2,left:{val:1,left:null,right:null},right:{val:3,left:null,right:null}},right:{val:6,left:{val:5,left:null,right:null},right:{val:7,left:null,right:null}}};
  const inorder=[];
  addStep(0,`BST inorder traversal`,"assign",{explanation:`🌳 Binary Search Tree (BST): Left subtree has smaller values, right has larger. Inorder traversal (left→root→right) always visits nodes in SORTED order.`});
  function traverse(node,depth){
    if(!node||steps.length>=750)return;
    vars["node"]=String(node.val); vars["depth"]=String(depth);
    addStep(Math.min(depth,lines.length-1),`At node ${node.val} (depth ${depth}): go left first`,"recurse",{depth,explanation:`🌿 At node ${node.val}. Inorder: explore left subtree, then visit this node, then right subtree.`});
    if(node.left){addStep(Math.min(depth+1,lines.length-1),`Go LEFT from ${node.val} → ${node.left.val}`,"call",{depth,explanation:`↙ Going left to ${node.left.val} (smaller value).`});traverse(node.left,depth+1);addStep(Math.min(depth,lines.length-1),`Back at ${node.val} from left subtree`,"return",{depth,explanation:`↩ Left subtree of ${node.val} fully explored.`});}
    inorder.push(node.val); vars["inorder"]=JSON.stringify(inorder);
    addStep(Math.min(depth,lines.length-1),`Visit ${node.val}. Inorder so far:[${inorder.join(",")}]`,"mark",{nv:node.val,explanation:`✅ Visiting node ${node.val}. Inorder result: [${inorder.join(",")}].`});
    if(node.right){addStep(Math.min(depth+1,lines.length-1),`Go RIGHT from ${node.val} → ${node.right.val}`,"call",{depth,explanation:`↗ Going right to ${node.right.val} (larger value).`});traverse(node.right,depth+1);addStep(Math.min(depth,lines.length-1),`Back at ${node.val} from right subtree`,"return",{depth,explanation:`↩ Right subtree of ${node.val} fully explored.`});}
  }
  traverse(tree,0);
  addStep(lines.length-1,`Inorder: [${inorder.join(",")}] (sorted!)`,"mark",{explanation:`🏁 Inorder of a BST is always sorted! [${inorder.join(",")}]. This is why BSTs enable O(log n) search.`});
  return steps;
}

// ── HASH ──────────────────────────────────────────────────────────
function traceHash(lines, src, addStep, vars, heap, steps) {
  const nm=src.match(/nums\s*=\s*\[([0-9,\s]+)\]/);
  const nums=nm?nm[1].split(",").map(s=>parseInt(s.trim())):[2,7,11,15];
  const tm=src.match(/target\s*=\s*(\d+)/);
  const target=tm?parseInt(tm[1]):9;
  const seen={}; heap["nums"]=JSON.stringify(nums); vars["target"]=String(target);
  addStep(0,`Two Sum hash: nums=[${nums.join(",")}], target=${target}`,"assign",{explanation:`#️⃣ Two Sum with Hash Map: For each num, check if (target-num) was seen before. O(n) time vs O(n²) for brute force!`});
  for(let i=0;i<nums.length&&steps.length<750;i++){
    const num=nums[i]; const comp=target-num;
    vars["i"]=String(i); vars["num"]=String(num); vars["complement"]=String(comp);
    addStep(1,`i=${i}: num=${num}, complement=${comp}`,"loop",{ai:[i],explanation:`Examining nums[${i}]=${num}. Need complement=${target}-${num}=${comp} to complete the pair.`});
    addStep(2,`Is ${comp} in hashmap? → ${comp in seen}`,"compare",{explanation:comp in seen?`🎉 YES! complement ${comp} found in hash map at index ${seen[comp]}. Answer: [${seen[comp]}, ${i}]!`:`❌ ${comp} not yet in map. Store nums[${i}]=${num}→index ${i}.`});
    if(comp in seen){vars["result"]=`[${seen[comp]},${i}]`;addStep(3,`Found! indices [${seen[comp]},${i}]: ${nums[seen[comp]]}+${num}=${target}`,"return",{explanation:`✅ Two Sum solution: indices [${seen[comp]}, ${i}]. ${nums[seen[comp]]}+${num}=${target}.`});return steps;}
    seen[num]=i; heap["seen"]=JSON.stringify(seen);
    addStep(2,`Store seen[${num}]=${i}. Map:${JSON.stringify(seen)}`,"assign",{explanation:`Added ${num}→${i} to hash map.`});
  }
  addStep(lines.length-1,"No solution found.","return",{explanation:`No pair sums to target ${target}.`});
  return steps;
}

// ── GENERIC ───────────────────────────────────────────────────────
function traceGeneric(lines, src, addStep, vars, heap, steps) {
  for(let i=0;i<lines.length&&steps.length<800;i++){
    const t=lines[i].trim();
    if(!t||/^(\/\/|#|\/\*)/.test(t)||t==="{"|t==="}")continue;
    if(/^(?:def|function)\s+(\w+)/.test(t)){const m=t.match(/(?:def|function)\s+(\w+)/);addStep(i,`Enter function ${m?m[1]:"fn"}`,  "call",{explanation:`Function definition — code inside runs when the function is called.`});continue;}
    if(/^return\b/.test(t)){addStep(i,`Return statement`,"return",{explanation:`Function returns a value to its caller.`});continue;}
    if(/^(?:for|while)\b/.test(t)){addStep(i,`Loop: ${t.slice(0,50)}`,"loop",{explanation:`Loop iterates — check condition, execute body, repeat.`});continue;}
    if(/^(?:if|elif|else if|else)\b/.test(t)){addStep(i,`Branch: ${t.slice(0,40)}`,"branch",{explanation:`Decision point — condition evaluated.`});continue;}
    const am=t.match(/^(?:(?:let|const|var|int|float|double|string|bool|auto)\s+)?(\w+)\s*=(?!=)\s*(.+)/);
    if(am&&!["if","while","for"].includes(am[1])){vars[am[1]]=am[2].replace(/[;,]$/, "").slice(0,30);addStep(i,`${am[1]} = ${vars[am[1]]}`,"assign",{explanation:`Variable ${am[1]} assigned.`});continue;}
    if(/(?:console\.log|print|cout|printf)/.test(t)){addStep(i,`Output: ${t.slice(0,50)}`,"call",{explanation:`Printing output.`});continue;}
    if(/\.push\(|\.append\(/.test(t)){addStep(i,`Push element`,"push",{explanation:`Element added to data structure.`});continue;}
    if(/\.pop\(\)|\.popleft\(\)/.test(t)){addStep(i,`Pop element`,"pop",{explanation:`Element removed from data structure.`});continue;}
    if(/swap/.test(t)){addStep(i,`Swap: ${t.slice(0,40)}`,"swap",{explanation:`Two elements exchange positions.`});continue;}
    const fc=t.match(/^(\w+)\s*\(/);
    if(fc&&!["if","for","while","def","function"].includes(fc[1])){addStep(i,`Call ${fc[1]}(...)`,"call",{explanation:`Function ${fc[1]} is called.`});continue;}
    addStep(i,t.slice(0,60),"normal",{explanation:`Executing line.`});
  }
  if(steps.length===0)lines.forEach((raw,i)=>{const t=raw.trim();if(t&&steps.length<800)addStep(i,t.slice(0,60),"normal",{explanation:`Line execution.`});});
  return steps;
}

// ── HELPER ────────────────────────────────────────────────────────
function extractGraph(src) {
  try {
    const m=src.match(/(?:graph|adj)\s*=\s*\{([^}]+)\}/s);
    if(!m)return null;
    const entries=[...m[1].matchAll(/(\d+)\s*:\s*\[([^\]]*)\]/g)];
    const g={};
    for(const e of entries){g[parseInt(e[1])]=e[2].split(",").map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));}
    return Object.keys(g).length>0?g:null;
  } catch { return null; }
}

// ── MAIN DRY RUN COMPONENT ────────────────────────────────────────
function DryRunVisualizer() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("auto");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Sorting");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(500);
  const [showExpl, setShowExpl] = useState(true);
  const [viewMode, setViewMode] = useState("split");
  const intervalRef = useRef(null);
  const codeRef = useRef(null);

  const cur = steps[currentStep] || null;
  const cumOutput = steps.slice(0, currentStep+1).filter(s=>s.output).map(s=>s.output).join("\n");

  // Auto-scroll code editor to active line
  useEffect(() => {
    if (hasRun && cur && codeRef.current) {
      const scrollTo = (cur.line - 1) * 20 - 80;
      codeRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [currentStep, hasRun]);

  // Auto-play
  useEffect(() => {
    if (isPlaying && hasRun) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(s => {
          if (s >= steps.length - 1) { setIsPlaying(false); return s; }
          return s + 1;
        });
      }, playSpeed);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, playSpeed, steps.length, hasRun]);

  // Keyboard
  useEffect(() => {
    if (!hasRun) return;
    const h = (e) => {
      if (e.key==="ArrowRight"||e.key==="ArrowDown") { e.preventDefault(); setCurrentStep(s=>Math.min(s+1,steps.length-1)); }
      if (e.key==="ArrowLeft"||e.key==="ArrowUp") { e.preventDefault(); setCurrentStep(s=>Math.max(s-1,0)); }
      if (e.key===" ") { e.preventDefault(); setIsPlaying(p=>!p); }
      if (e.key==="Home") { e.preventDefault(); setCurrentStep(0); }
      if (e.key==="End") { e.preventDefault(); setCurrentStep(steps.length-1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [hasRun, steps.length]);

  function run() {
    if (!code.trim()) { setError("Paste some code first."); return; }
    setError(""); setLoading(true); setSteps([]); setCurrentStep(-1); setHasRun(false); setIsPlaying(false);
    setTimeout(() => {
      try {
        const traced = deepTrace(code, lang);
        if (!traced || traced.length === 0) { setError("Could not extract steps. Try a different snippet."); setLoading(false); return; }
        setSteps(traced); setCurrentStep(0); setHasRun(true);
      } catch(e) { setError("Trace failed: " + e.message); }
      setLoading(false);
    }, 60);
  }

  // ── COLORS ────────────────────────────────────────────────────────
  const hlColor = {
    normal:C.text, branch:C.amber, loop:C.teal, call:C.accent, return:C.purple,
    assign:C.green, push:C.teal, pop:C.red, compare:C.amber, dequeue:C.pink,
    enqueue:C.teal, recurse:C.purple, memo:C.amber, swap:C.red, mark:C.green, error:C.red,
  };
  const hlBg = Object.fromEntries(Object.entries(hlColor).map(([k,v])=>[k,`${v}18`]));
  const hlIcon = {
    normal:"→", branch:"⑂", loop:"↺", call:"↗", return:"↙", assign:"=",
    push:"↓", pop:"↑", compare:"≷", dequeue:"◁", enqueue:"▷", recurse:"↻",
    memo:"✦", swap:"⇄", mark:"✓", error:"✗",
  };

  // ── ANIMATED ARRAY VISUALIZER ─────────────────────────────────────
  function ArrayViz({ val, ai, si, ci, ptrs }) {
    let arr = [];
    try { arr = JSON.parse(val); } catch { return null; }
    if (!Array.isArray(arr) || arr.length === 0) return null;
    if (arr.length > 32) return <div style={{fontSize:11,color:C.textSub,fontFamily:"'JetBrains Mono',monospace"}}>[{arr.slice(0,12).join(", ")}... ({arr.length} items)]</div>;
    const maxV = Math.max(...arr.filter(v=>typeof v==="number").map(v=>Math.abs(v)), 1);
    return (
      <div style={{overflowX:"auto"}}>
        {ptrs && Object.keys(ptrs).length > 0 && (
          <div style={{display:"flex",gap:0,marginBottom:2}}>
            {arr.map((_,i)=>{
              const ps=Object.entries(ptrs).filter(([,v])=>v===i).map(([k])=>k);
              return <div key={i} style={{minWidth:36,textAlign:"center",fontSize:9,color:C.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{ps.join("/")}</div>;
            })}
          </div>
        )}
        <div style={{display:"flex",alignItems:"flex-end",gap:2,marginBottom:4}}>
          {arr.map((v,i)=>{
            const isSwap=(si||[]).includes(i), isCmp=(ci||[]).includes(i), isAct=(ai||[]).includes(i);
            const hasPtr=ptrs&&Object.values(ptrs).includes(i);
            const numV=typeof v==="number"?Math.abs(v):1;
            const barH=Math.max(8,(numV/maxV)*64);
            let bg=C.surface, border=C.border, tc=C.textSub;
            if(isSwap){bg=`${C.red}30`;border=C.red;tc=C.red;}
            else if(isCmp){bg=`${C.amber}30`;border=C.amber;tc=C.amber;}
            else if(isAct){bg=`${C.teal}28`;border=C.teal;tc=C.teal;}
            else if(hasPtr){bg=`${C.accent}18`;border=C.accent;tc=C.accent;}
            return (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:34,height:barH,background:isSwap?`linear-gradient(180deg,${C.red}80,${C.red}30)`:isCmp?`linear-gradient(180deg,${C.amber}80,${C.amber}30)`:isAct?`linear-gradient(180deg,${C.teal}80,${C.teal}30)`:`linear-gradient(180deg,${C.accent}28,${C.accent}12)`,border:`1px solid ${border}`,borderRadius:"3px 3px 0 0",transition:"all 0.18s ease",boxShadow:isSwap?`0 0 10px ${C.red}55`:isCmp?`0 0 10px ${C.amber}55`:isAct?`0 0 10px ${C.teal}55`:"none"}}/>
                <div style={{minWidth:34,height:28,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:bg,border:`1px solid ${border}`,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:tc,fontWeight:(isSwap||isCmp||isAct)?700:400,padding:"0 2px",transition:"all 0.18s ease",boxShadow:(isSwap||isCmp||isAct)?`0 0 8px ${border}55`:"none"}}>{String(v).slice(0,5)}</div>
                <div style={{fontSize:9,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{i}</div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8,marginTop:2}}>
          {(si||[]).length>0&&<span style={{fontSize:9,color:C.red}}>⇄ swapping</span>}
          {(ci||[]).length>0&&<span style={{fontSize:9,color:C.amber}}>≷ comparing</span>}
          {(ai||[]).length>0&&<span style={{fontSize:9,color:C.teal}}>● active</span>}
        </div>
      </div>
    );
  }

  // ── CALL STACK VIZ ────────────────────────────────────────────────
  function CallStackViz({ stack, depth }) {
    if (!stack || stack.length === 0) return <div style={{fontSize:11,color:C.textMuted}}>Empty</div>;
    return (
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        <div style={{fontSize:9,color:C.textMuted,textAlign:"center"}}>─ TOP ─</div>
        {[...stack].reverse().map((fn,i)=>(
          <div key={i} style={{padding:"6px 10px",borderRadius:6,fontSize:11,background:i===0?`${C.accent}20`:C.surface,border:`1px solid ${i===0?`${C.accent}55`:C.border}`,color:i===0?C.accent:C.textSub,fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:5,transition:"all 0.2s",boxShadow:i===0?`0 0 8px ${C.accent}30`:"none"}}>
            {i===0&&<span style={{fontSize:8,color:C.accent}}>▶</span>}
            <span>{fn}</span>
            {depth&&i===0&&<span style={{marginLeft:"auto",fontSize:9,color:C.textMuted,background:C.card,padding:"1px 5px",borderRadius:3}}>d={depth}</span>}
          </div>
        ))}
        <div style={{fontSize:9,color:C.textMuted,textAlign:"center",borderTop:`1px dashed ${C.border}`,paddingTop:3}}>─ BOTTOM ─</div>
      </div>
    );
  }

  // ── MEMO/DP TABLE VIZ ─────────────────────────────────────────────
  function MemoCellViz({ mc }) {
    if (!mc || mc.length === 0) return null;
    return (
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
        <div style={{fontSize:10,color:C.textSub,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>✦ DP / Memo Table</div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
          {mc.map((cell,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:8,color:C.textMuted,marginBottom:1,fontFamily:"'JetBrains Mono',monospace"}}>{cell.i}{cell.j!==undefined?`,${cell.j}`:""}</div>
              <div style={{minWidth:32,height:32,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:cell.isNew?`${C.amber}35`:cell.isUsed?`${C.teal}25`:`${C.accent}15`,border:`1px solid ${cell.isNew?C.amber:cell.isUsed?C.teal:`${C.accent}44`}`,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:cell.isNew?C.amber:cell.isUsed?C.teal:C.accent,fontWeight:cell.isNew?700:400,transition:"all 0.22s",boxShadow:cell.isNew?`0 0 8px ${C.amber}55`:"none"}}>{String(cell.val).slice(0,5)}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginTop:6}}>
          <span style={{fontSize:9,color:C.amber}}>✦ new</span>
          <span style={{fontSize:9,color:C.teal}}>● referenced</span>
        </div>
      </div>
    );
  }

  // ── SMART HEAP VALUE RENDERER ─────────────────────────────────────
  function renderVal(name, val, changed) {
    if (!val || val === "empty") return <div style={{fontSize:12,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>empty</div>;

    // 1D array
    if (val.startsWith("[") && val.endsWith("]") && !val.startsWith("[[")) {
      try {
        const arr = JSON.parse(val);
        return <ArrayViz val={val} ai={cur?.activeIndices} si={cur?.swapIndices} ci={cur?.comparingIndices} ptrs={cur?.pointers} />;
      } catch {}
    }

    // 2D DP table
    if (val.startsWith("[[")) {
      try {
        const table=JSON.parse(val);
        return (
          <div style={{overflowX:"auto"}}>
            <table style={{borderCollapse:"collapse",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}}>
              <tbody>{table.map((row,ri)=>(<tr key={ri}>{row.map((cell,ci)=>(<td key={ci} style={{border:`1px solid ${C.border}`,padding:"3px 6px",textAlign:"center",background:cell>0?`${C.accent}20`:C.surface,color:cell>0?C.accent:C.textMuted,minWidth:26,fontSize:10,fontWeight:cell>0?600:400}}>{cell}</td>))}</tr>))}</tbody>
            </table>
          </div>
        );
      } catch {}
    }

    // Stack
    if (val.includes("top→") || val.includes("←bottom")) {
      const parts=val.replace("top→","").replace("←bottom","").split("|").map(s=>s.trim()).filter(Boolean);
      return (
        <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-start"}}>
          <div style={{fontSize:9,color:C.textMuted}}>TOP</div>
          {parts.length===0?<div style={{fontSize:11,color:C.textMuted}}>empty</div>:parts.map((p,i)=>(
            <div key={i} style={{padding:"3px 12px",borderRadius:5,fontSize:12,minWidth:40,textAlign:"center",background:i===0?`${C.red}20`:C.surface,border:`1px solid ${i===0?`${C.red}44`:C.border}`,color:i===0?C.red:C.textSub,fontFamily:"'JetBrains Mono',monospace",boxShadow:i===0?`0 0 6px ${C.red}40`:"none"}}>{p}</div>
          ))}
          <div style={{fontSize:9,color:C.textMuted}}>BOTTOM</div>
        </div>
      );
    }

    // Queue
    if (val.includes("front→") || val.includes("←back")) {
      const inner=val.replace("front→","").replace("←back","").replace(/[\[\]]/g,"").trim();
      const parts=inner.split(",").map(s=>s.trim()).filter(Boolean);
      return (
        <div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.pink,fontWeight:700}}>FRONT</span>
          {parts.map((p,i)=>(<div key={i} style={{padding:"2px 9px",borderRadius:5,fontSize:12,background:i===0?`${C.pink}20`:C.surface,border:`1px solid ${i===0?`${C.pink}44`:C.border}`,color:i===0?C.pink:C.textSub,fontFamily:"'JetBrains Mono',monospace"}}>{p}</div>))}
          <span style={{fontSize:9,color:C.textSub,fontWeight:700}}>BACK</span>
        </div>
      );
    }

    // Linked list
    if (val.includes("→") && (val.includes("NULL") || val.includes("null"))) {
      const parts=val.split("→");
      return (
        <div style={{display:"flex",alignItems:"center",gap:2,flexWrap:"wrap"}}>
          {parts.map((p,i)=>(
            <React.Fragment key={i}>
              <div style={{padding:"2px 9px",borderRadius:5,fontSize:12,background:["NULL","null","None"].includes(p.trim())?C.surface:`${C.accent}15`,border:`1px solid ${["NULL","null","None"].includes(p.trim())?C.border:`${C.accent}33`}`,color:["NULL","null","None"].includes(p.trim())?C.textMuted:C.accent,fontFamily:"'JetBrains Mono',monospace"}}>{p.trim()}</div>
              {i<parts.length-1&&<span style={{color:C.textMuted,fontSize:13}}>→</span>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    // Graph adjacency
    if (val.match(/\w+:\[/)) {
      const entries=val.trim().split(/\s+/);
      return (
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {entries.map((entry,i)=>{const [node,nb]=entry.split(":");return(<div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${C.accent}18`,border:`1px solid ${C.accent}40`,fontSize:11,color:C.accent,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{node}</div><span style={{fontSize:10,color:C.textMuted}}>→</span><span style={{fontSize:11,color:C.textSub,fontFamily:"'JetBrains Mono',monospace"}}>{nb}</span></div>);})}
        </div>
      );
    }

    // Set / hash map
    if (val.startsWith("{") && val.endsWith("}")) {
      const items=val.slice(1,-1).split(",").map(s=>s.trim()).filter(Boolean);
      return (
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
          {items.length===0?<span style={{fontSize:11,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>∅</span>:items.map((it,i)=>(<div key={i} style={{padding:"2px 7px",borderRadius:4,fontSize:11,background:`${C.purple}15`,border:`1px solid ${C.purple}33`,color:C.purple,fontFamily:"'JetBrains Mono',monospace"}}>{it}</div>))}
        </div>
      );
    }

    // DP array (key contains "dp" or "memo")
    if ((name.toLowerCase().includes("dp") || name.toLowerCase().includes("memo")) && val.startsWith("[")) {
      try {
        const dp=JSON.parse(val.replace(/∞/g,'"∞"'));
        return (
          <div style={{overflowX:"auto"}}>
            <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
              {dp.map((v,i)=>(<div key={i} style={{textAlign:"center"}}><div style={{fontSize:8,color:C.textMuted,marginBottom:1,fontFamily:"'JetBrains Mono',monospace"}}>{i}</div><div style={{minWidth:30,height:30,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:v===0||v==="0"?C.surface:`${C.accent}18`,border:`1px solid ${v===0||v==="0"?C.border:`${C.accent}44`}`,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:v===0||v==="0"?C.textMuted:C.accent}}>{String(v).slice(0,4)}</div></div>))}
            </div>
          </div>
        );
      } catch {}
    }

    // Default
    return (
      <div style={{background:C.surface,borderRadius:6,padding:"4px 9px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:changed?C.teal:C.textSub,border:`1px solid ${changed?`${C.teal}28`:"transparent"}`,wordBreak:"break-all"}}>{val}</div>
    );
  }

  const progress = steps.length > 0 ? ((currentStep+1)/steps.length)*100 : 0;

  return (
    <div style={{animation:"slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards"}}>
      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${C.teal},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 0 24px ${C.tealGlow}`}}>▷</div>
          <div>
            <div className="oxanium" style={{fontSize:22,fontWeight:800,color:C.text}}>
              Deep Dry Run
              <span style={{fontSize:11,color:C.teal,fontWeight:500,fontFamily:"'DM Sans',sans-serif",marginLeft:8}}>Real-world simulation engine</span>
            </div>
            <div style={{fontSize:12,color:C.textSub}}>Any code · Any language · Animated arrays · Recursion trees · DP tables · Auto-play · 800+ steps</div>
          </div>
        </div>
        {hasRun && (
          <div style={{display:"flex",gap:4,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:3}}>
            {[["split","⊞ Split"],["viz","◧ Viz"],["code","▤ Code"]].map(([m,l])=>(
              <button key={m} onClick={()=>setViewMode(m)} style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",background:viewMode===m?C.accent:"transparent",color:viewMode===m?"#fff":C.textSub,border:"none",transition:"all 0.15s"}}>{l}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>
        {/* ── LEFT: CODE INPUT ──────────────────────────────────────── */}
        {(viewMode==="split"||viewMode==="code"||!hasRun) && (
          <div style={{flex:"0 0 400px",display:"flex",flexDirection:"column",gap:10,minWidth:0}}>

            {/* Language + AI toggle */}
            <div style={{display:"flex",gap:8}}>
              <select value={lang} onChange={e=>{setLang(e.target.value);setSteps([]);setCurrentStep(-1);setHasRun(false);}} style={{flex:1,fontSize:12}}>
                <option value="auto">🔍 Auto-detect</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="C">C</option>
              </select>
              <button onClick={()=>setShowExpl(e=>!e)} style={{padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:"inherit",background:showExpl?`${C.purple}20`:C.surface,border:`1px solid ${showExpl?`${C.purple}44`:C.border}`,color:showExpl?C.purple:C.textSub,cursor:"pointer"}}>
                💬 {showExpl?"Hide":"Show"} Explain
              </button>
            </div>

            {/* Example picker */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}>Try an example</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {Object.keys(DR_CATEGORIES).map(cat=>(
                  <button key={cat} onClick={()=>setActiveCategory(cat)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,fontFamily:"inherit",cursor:"pointer",background:activeCategory===cat?`${C.accent}22`:C.surface,border:`1px solid ${activeCategory===cat?`${C.accent}55`:C.border}`,color:activeCategory===cat?C.accent:C.textSub,fontWeight:activeCategory===cat?700:400,transition:"all 0.15s"}}>{cat}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {DR_CATEGORIES[activeCategory].map(name=>(
                  <button key={name} onClick={()=>{const ex=DR_EXAMPLES[name];setCode(ex.code);setLang(ex.lang);setSteps([]);setCurrentStep(-1);setHasRun(false);setError("");setIsPlaying(false);}} style={{fontSize:11,padding:"4px 10px",borderRadius:6,fontFamily:"inherit",cursor:"pointer",background:C.surface,border:`1px solid ${C.border}`,color:C.teal,transition:"all 0.15s"}}>{name}</button>
                ))}
              </div>
            </div>

            {/* Code editor with line numbers */}
            <div style={{position:"relative",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              {hasRun && cur && (
                <div style={{position:"absolute",left:36,right:0,top:`${(cur.line-1)*20}px`,height:20,pointerEvents:"none",zIndex:2,background:hlBg[cur.highlight]||`${C.accent}12`,borderLeft:`2px solid ${hlColor[cur.highlight]||C.accent}`,transition:"top 0.15s ease"}}/>
              )}
              <div style={{display:"flex"}}>
                <div style={{width:36,padding:"10px 0",textAlign:"right",userSelect:"none",background:C.card,borderRight:`1px solid ${C.border}`,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.textMuted,lineHeight:"20px",minHeight:240}}>
                  {(code||" ").split("\n").map((_,i)=>(
                    <div key={i} style={{paddingRight:8,color:hasRun&&cur?.line===i+1?hlColor[cur?.highlight]||C.accent:C.textMuted,fontWeight:hasRun&&cur?.line===i+1?700:400,transition:"color 0.15s"}}>{i+1}</div>
                  ))}
                </div>
                <textarea
                  ref={codeRef}
                  value={code}
                  onChange={e=>{setCode(e.target.value);setSteps([]);setCurrentStep(-1);setHasRun(false);setError("");setIsPlaying(false);}}
                  placeholder={`Paste any code here...\n\nC++, Python, JavaScript, Java, C\n\nBubble/Merge/Quick Sort\nBFS, DFS, Dijkstra\nDP: Fibonacci, Knapsack, Coins\nTrees, Linked Lists, Stacks\nRecursion, Backtracking, Hashing\n\nOr pick an example above ↑`}
                  style={{flex:1,minHeight:280,border:"none",borderRadius:0,resize:"none",fontSize:12,lineHeight:"20px",padding:"10px 12px",background:"transparent",outline:"none",fontFamily:"'JetBrains Mono',monospace",color:C.text,overflowY:"auto"}}
                  spellCheck={false}
                />
              </div>
            </div>

            {error && <div style={{padding:"8px 12px",background:`${C.red}15`,border:`1px solid ${C.red}33`,borderRadius:8,fontSize:12,color:C.red}}>⚠ {error}</div>}

            {/* Run button */}
            <button onClick={run} disabled={loading} style={{width:"100%",padding:"11px 0",borderRadius:10,fontSize:14,fontWeight:700,fontFamily:"inherit",background:loading?C.card:`linear-gradient(135deg,${C.teal},${C.accent})`,color:loading?C.textMuted:"#fff",border:loading?`1px solid ${C.border}`:"none",boxShadow:loading?"none":`0 0 24px ${C.tealGlow}`,cursor:loading?"default":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading?(
                <><div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${C.border}`,borderTopColor:C.teal,animation:"spin 0.7s linear infinite"}}/>Analyzing...</>
              ):"▷ Start Deep Dry Run"}
            </button>

            {/* Controls */}
            {hasRun && steps.length > 0 && (
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textSub}}>
                  <span>Step {currentStep+1} / {steps.length}</span>
                  <span className="mono" style={{color:C.accent}}>{Math.round(progress)}%</span>
                </div>
                <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.teal},${C.accent})`,borderRadius:2,transition:"width 0.2s ease"}}/>
                </div>
                {/* Scrubber */}
                <input type="range" min={0} max={steps.length-1} value={currentStep} onChange={e=>setCurrentStep(parseInt(e.target.value))} style={{width:"100%"}}/>
                {/* Buttons */}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{setCurrentStep(0);setIsPlaying(false);}} title="Reset" style={{flex:"0 0 34px",height:34,borderRadius:7,fontSize:14,fontFamily:"inherit",background:C.surface,border:`1px solid ${C.border}`,color:C.textSub,cursor:"pointer"}}>↺</button>
                  <button onClick={()=>setCurrentStep(s=>Math.max(s-1,0))} disabled={currentStep===0} style={{flex:1,height:34,borderRadius:7,fontSize:12,fontWeight:600,fontFamily:"inherit",background:C.surface,border:`1px solid ${C.border}`,color:currentStep===0?C.textMuted:C.text,cursor:currentStep===0?"default":"pointer",opacity:currentStep===0?0.4:1}}>← Prev</button>
                  <button onClick={()=>setIsPlaying(p=>!p)} style={{flex:"0 0 44px",height:34,borderRadius:7,fontSize:16,background:isPlaying?`${C.red}20`:`${C.teal}20`,border:`1px solid ${isPlaying?`${C.red}44`:`${C.teal}44`}`,color:isPlaying?C.red:C.teal,cursor:"pointer",transition:"all 0.15s"}}>{isPlaying?"⏸":"▶"}</button>
                  <button onClick={()=>setCurrentStep(s=>Math.min(s+1,steps.length-1))} disabled={currentStep===steps.length-1} style={{flex:1,height:34,borderRadius:7,fontSize:13,fontWeight:700,fontFamily:"inherit",background:`linear-gradient(135deg,${C.teal},${C.accent})`,border:"none",color:"#fff",cursor:currentStep===steps.length-1?"default":"pointer",opacity:currentStep===steps.length-1?0.4:1,boxShadow:`0 0 12px ${C.tealGlow}`}}>Next →</button>
                  <button onClick={()=>setCurrentStep(steps.length-1)} title="Jump to end" style={{flex:"0 0 34px",height:34,borderRadius:7,fontSize:14,fontFamily:"inherit",background:C.surface,border:`1px solid ${C.border}`,color:C.textSub,cursor:"pointer"}}>⇥</button>
                </div>
                {/* Speed */}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,color:C.textMuted,whiteSpace:"nowrap"}}>Speed</span>
                  <input type="range" min={50} max={1500} step={50} value={1550-playSpeed} onChange={e=>setPlaySpeed(1550-parseInt(e.target.value))} style={{flex:1}}/>
                  <span style={{fontSize:10,color:C.textSub,whiteSpace:"nowrap"}}>{playSpeed<250?"Fast":playSpeed<700?"Med":"Slow"}</span>
                </div>
                <div style={{fontSize:9,color:C.textMuted,textAlign:"center"}}>← → Navigate · Space Play/Pause · Home/End Jump</div>
              </div>
            )}
          </div>
        )}

        {/* ── RIGHT: VISUALIZATION ──────────────────────────────────── */}
        {(viewMode==="split"||viewMode==="viz") && (
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minWidth:0}}>
            {!hasRun ? (
              <div style={{background:C.card,border:`1px dashed ${C.border}`,borderRadius:16,padding:"48px 32px",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:16}}>▷</div>
                <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:10}}>Deep Real-World Simulator</div>
                <div style={{fontSize:13,color:C.textSub,lineHeight:1.8,maxWidth:420,margin:"0 auto 24px"}}>
                  Paste any code and watch it execute step-by-step. Every variable, pointer, recursive call, DP cell, and data structure is visualized and explained.
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
                  {[["🎬","Animated arrays"],["🌳","Recursion trees"],["💾","DP tables"],["📚","Call stack"],["🔗","Linked lists"],["🌊","Graph traversal"],["✦","Memo cells"],["⚡","800+ steps"]].map(([e,l])=>(
                    <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 11px",fontSize:11,color:C.textSub}}><span style={{marginRight:5}}>{e}</span>{l}</div>
                  ))}
                </div>
                <div style={{fontSize:11,color:C.textMuted}}>Supports: Sorting · Graphs · DP · Trees · Recursion · Backtracking · Data Structures · and more</div>
              </div>
            ) : cur ? (
              <>
                {/* ── STEP BANNER ── */}
                <div style={{background:`linear-gradient(135deg,${hlBg[cur.highlight]||`${C.accent}12`},${C.surface})`,border:`1px solid ${(hlColor[cur.highlight]||C.accent)}44`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:14,animation:"slideRight 0.18s ease"}} key={currentStep}>
                  <div style={{width:40,height:40,borderRadius:10,flexShrink:0,background:`${hlColor[cur.highlight]||C.accent}20`,border:`1px solid ${hlColor[cur.highlight]||C.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:hlColor[cur.highlight]||C.accent,boxShadow:`0 0 14px ${hlColor[cur.highlight]||C.accent}30`}}>
                    {hlIcon[cur.highlight]||"→"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,color:C.textSub}}>Line {cur.line}</span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,background:`${hlColor[cur.highlight]||C.accent}20`,color:hlColor[cur.highlight]||C.accent,textTransform:"uppercase",letterSpacing:"0.5px"}}>{cur.highlight}</span>
                      {cur.depth>0&&<span style={{fontSize:10,color:C.textMuted,background:C.card,padding:"1px 6px",borderRadius:4}}>depth {cur.depth}</span>}
                      {cur.returnVal!==undefined&&<span style={{fontSize:10,color:C.purple,background:`${C.purple}12`,padding:"1px 6px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace"}}>↙ {String(cur.returnVal)}</span>}
                    </div>
                    <div className="mono" style={{fontSize:12,color:C.text,marginBottom:5,background:C.card,padding:"3px 9px",borderRadius:6,display:"inline-block",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {cur.lineText||"(empty line)"}
                    </div>
                    <div style={{fontSize:12,color:C.textSub,marginBottom:showExpl&&cur.explanation?4:0}}>{cur.description}</div>
                    {showExpl && cur.explanation && (
                      <div style={{fontSize:12,color:C.text,background:`${C.accent}0d`,border:`1px solid ${C.accent}22`,borderRadius:7,padding:"7px 12px",marginTop:6,lineHeight:1.65}}>{cur.explanation}</div>
                    )}
                  </div>
                </div>

                {/* ── DATA STRUCTURES (ANIMATED) ── */}
                {Object.keys(cur.heap||{}).length > 0 && (
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:C.textSub,marginBottom:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>🎬 Data Structures (Animated)</div>
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {Object.entries(cur.heap).map(([name,val])=>{
                        const prev=steps[currentStep-1]?.heap||{};
                        const changed=String(prev[name])!==String(val);
                        return (
                          <div key={name}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                              <span className="mono" style={{fontSize:11,color:C.textSub,fontWeight:600}}>{name}</span>
                              {changed&&<span style={{fontSize:9,color:C.green,padding:"1px 5px",borderRadius:4,background:`${C.green}15`}}>● updated</span>}
                            </div>
                            {renderVal(name,val,changed)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── MEMO/DP CELLS ── */}
                {cur.memoCells && cur.memoCells.length > 0 && <MemoCellViz mc={cur.memoCells}/>}

                {/* ── VARIABLES + CALL STACK ── */}
                <div style={{display:"flex",gap:12}}>
                  <div style={{flex:"1 1 0",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",minWidth:0}}>
                    <div style={{fontSize:10,color:C.textSub,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📦 Variables</div>
                    {Object.keys(cur.variables||{}).length===0?(
                      <div style={{fontSize:11,color:C.textMuted}}>No variables yet</div>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {Object.entries(cur.variables).slice(0,22).map(([k,v])=>{
                          const prev=steps[currentStep-1];
                          const changed=prev&&prev.variables&&String(prev.variables[k])!==String(v);
                          const isNew=prev&&!(k in (prev.variables||{}));
                          return (
                            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"4px 8px",borderRadius:6,background:isNew?`${C.accent}10`:changed?`${C.green}10`:C.surface,border:`1px solid ${isNew?`${C.accent}30`:changed?`${C.green}30`:"transparent"}`,transition:"all 0.2s"}}>
                              <span className="mono" style={{fontSize:11,color:C.textSub,flexShrink:0,paddingRight:8}}>{k}</span>
                              <span className="mono" style={{fontSize:11,color:isNew?C.accent:changed?C.green:C.teal,fontWeight:(changed||isNew)?700:400,textAlign:"right",maxWidth:160,wordBreak:"break-all"}}>{String(v).slice(0,50)}</span>
                            </div>
                          );
                        })}
                        {Object.keys(cur.variables).length>22&&<div style={{fontSize:10,color:C.textMuted}}>...+{Object.keys(cur.variables).length-22} more</div>}
                      </div>
                    )}
                  </div>
                  <div style={{flex:"0 0 145px",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:C.textSub,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📚 Call Stack</div>
                    <CallStackViz stack={cur.callStack} depth={cur.depth}/>
                  </div>
                </div>

                {/* ── CONSOLE OUTPUT ── */}
                {cumOutput && (
                  <div style={{background:"#050709",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.textSub,marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>🖥 Console Output</div>
                    <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.green,whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:120,overflowY:"auto"}}>{cumOutput}</pre>
                  </div>
                )}

                {/* ── EXECUTION TIMELINE ── */}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:10,color:C.textSub,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>Execution Timeline</div>
                    <div style={{fontSize:10,color:C.textMuted}}>{steps.length} steps</div>
                  </div>
                  <input type="range" min={0} max={steps.length-1} value={currentStep} onChange={e=>setCurrentStep(parseInt(e.target.value))} style={{width:"100%",marginBottom:8}}/>
                  <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                    {steps.slice(0,Math.min(steps.length,90)).map((s,i)=>{
                      const col=hlColor[s.highlight]||C.accent;
                      return (
                        <button key={i} onClick={()=>setCurrentStep(i)} title={`Step ${i+1}: ${s.description?.slice(0,50)}`} style={{width:i===currentStep?18:11,height:10,borderRadius:i===currentStep?3:2,border:"none",cursor:"pointer",padding:0,transition:"all 0.1s",background:i===currentStep?col:i<currentStep?col+"55":C.surface,outline:i===currentStep?`1px solid ${col}`:"none",transform:i===currentStep?"scaleY(1.6)":"scaleY(1)"}}/>
                      );
                    })}
                    {steps.length>90&&<span style={{fontSize:10,color:C.textMuted,alignSelf:"center"}}>+{steps.length-90} more</span>}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────
export default function App() {
  const [module, setModule] = useState("sorting");
  const [analytics, dispatch] = useReducer(analyticsReducer, analyticsInitState);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const sharedProps = { analytics, dispatch };

  const views = {
    sorting: <SortingVisualizer {...sharedProps} onNavigate={setModule} />,
    graph: <GraphVisualizer {...sharedProps} />,
    knapsack: <KnapsackVisualizer {...sharedProps} />,
    string: <StringVisualizer {...sharedProps} />,
    complexity: <ComplexityModule />,
    practice: <PracticeMode dispatch={dispatch} />,
    builder: <AlgorithmBuilder dispatch={dispatch} />,
    dryrun: <DryRunVisualizer />,
  };

  return (
    <>
      <GlobalStyle />
      {showOnboarding && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(7,8,15,0.92)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}>
          <div className="bounce-in" style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "40px 48px", maxWidth: 500, textAlign: "center",
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16, margin: "0 auto 20px",
              background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, boxShadow: `0 0 30px ${C.accentGlow}`,
            }}>⟨⟩</div>
            <div className="oxanium" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: C.text }}>
              AlgoEase Pro
            </div>
            <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.7, marginBottom: 28 }}>
              Welcome! This platform helps you truly understand algorithms — not just watch them, but learn, predict, and build them.
              <br /><br />
              <strong style={{ color: C.text }}>✨ New features:</strong> Practice Mode, Algorithm Builder, Code Sync, Explanations, Adaptive Hints, XP System.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              {[["🧠", "Adaptive Learning"], ["💬", "Live Explanations"], ["🧪", "Practice Mode"], ["🔗", "Code Sync"]].map(([e, l]) => (
                <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 12, color: C.text }}>
                  <span style={{ marginRight: 6 }}>{e}</span>{l}
                </div>
              ))}
            </div>
            <button onClick={() => setShowOnboarding(false)} style={{
              padding: "12px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 0 24px ${C.accentGlow}`,
            }}>
              Get Started →
            </button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
        <Sidebar active={module} onSelect={setModule} analytics={analytics} />
        <main style={{ flex: 1, marginLeft: 240, padding: "32px 40px", maxWidth: "calc(100vw - 240px)", minHeight: "100vh" }}>
          {views[module]}
        </main>
      </div>
    </>
  );
}

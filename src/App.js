import React, { useState, useEffect } from "react";

const SHOT_POINTS = [
  { name: "3点", radius: 40, score: 3 },
  { name: "5点", radius: 30, score: 5 },
  { name: "7点", radius: 20, score: 7 },
  { name: "9点", radius: 10, score: 9 },
  { name: "10点", radius: 0, score: 10 },
];

const TARGET_RADIUS = 40;

function calculateScore(x, y) {
  const dist = Math.sqrt(x * x + y * y);
  for (let i = SHOT_POINTS.length - 1; i >= 0; i--) {
    if (dist <= SHOT_POINTS[i].radius) {
      return SHOT_POINTS[i].score;
    }
  }
  return 0;
}

function Target({ shots, onShot }) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="-40 -40 80 80"
      style={{
        border: "1px solid #ccc",
        backgroundColor: "#fafafa",
        borderRadius: "50%",
        cursor: onShot ? "pointer" : "default",
      }}
      onClick={(e) => {
        if (!onShot) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = e.clientX - cx;
        const y = e.clientY - cy;
        const scale = 80 / 200;
        const posX = x * scale;
        const posY = y * scale;
        onShot({ x: posX, y: posY, score: calculateScore(posX, posY) });
      }}
    >
      {SHOT_POINTS.map((p, i) => (
        <circle
          key={i}
          cx="0"
          cy="0"
          r={p.radius}
          fill={i % 2 === 0 ? "#eee" : "#ddd"}
          stroke="#999"
          strokeWidth="0.5"
        />
      ))}
      {shots.map((shot, i) => (
        <circle key={i} cx={shot.x} cy={shot.y} r={1.5} fill="red" />
      ))}
    </svg>
  );
}

function Stand({ standData, setStandData, index, tools, editable }) {
  const [showDetails, setShowDetails] = useState(false);

  const addShot = (shot) => {
    if (!editable) return;
    setStandData({
      ...standData,
      shots: [...standData.shots, shot],
    });
  };

  const totalScore = standData.shots.reduce((acc, cur) => acc + cur.score, 0);

  const toggleTool = (toolIndex) => {
    if (!editable) return;
    let selected = standData.selectedTools || [];
    if (selected.includes(toolIndex)) {
      selected = selected.filter((i) => i !== toolIndex);
    } else {
      if (selected.length >= 4) return; // 最大4つまで
      selected = [...selected, toolIndex];
    }
    setStandData({ ...standData, selectedTools: selected });
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: editable ? "white" : "#f9f9f9",
      }}
    >
      <h3>
        立ち {index + 1} {standData.shots.length > 0 && `(得点: ${totalScore})`}
        {editable && (
          <button
            style={{ marginLeft: 12, cursor: "pointer" }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "詳細なし" : "詳細あり"}
          </button>
        )}
      </h3>
      <Target shots={standData.shots} onShot={addShot} />
      <div style={{ marginTop: 10 }}>
        <strong>矢の本数:</strong> {standData.shots.length}
      </div>
      {showDetails && (
        <ul style={{ marginTop: 8 }}>
          {standData.shots.map((shot, i) => (
            <li key={i}>
              矢{i + 1}: 座標({shot.x.toFixed(1)}, {shot.y.toFixed(1)}), 得点:{" "}
              {shot.score}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 12 }}>
        <strong>道具選択（最大4つ）:</strong>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 6 }}>
          {tools.length === 0 && <p>登録された道具はありません</p>}
          {tools.map((tool, i) => {
            const selected = standData.selectedTools?.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleTool(i)}
                disabled={!editable}
                style={{
                  marginRight: 8,
                  marginBottom: 8,
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: selected ? "2px solid #007bff" : "1px solid #ccc",
                  backgroundColor: selected ? "#cce5ff" : "white",
                  cursor: editable ? "pointer" : "default",
                }}
              >
                {tool.name}（{tool.type}）
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToolManagement({ tools, setTools }) {
  const [newTool, setNewTool] = useState({ name: "", type: "" });

  const addTool = () => {
    if (newTool.name.trim() === "" || newTool.type.trim() === "") {
      alert("道具名と種類を入力してください");
      return;
    }
    setTools([...tools, newTool]);
    setNewTool({ name: "", type: "" });
  };

  return (
    <div
      style={{
        marginTop: 40,
        border: "1px solid #666",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h2>道具管理</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="道具名"
          value={newTool.name}
          onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <select
          value={newTool.type}
          onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
          style={{ marginRight: 8 }}
        >
          <option value="">種類を選択</option>
          <option value="弓">弓</option>
          <option value="かけ">かけ</option>
          <option value="弦">弦</option>
          <option value="矢">矢</option>
        </select>
        <button onClick={addTool} style={{ cursor: "pointer" }}>
          追加
        </button>
      </div>
      {tools.length === 0 ? (
        <p>登録された道具はありません</p>
      ) : (
        <ul>
          {tools.map((tool, i) => (
            <li key={i}>
              {tool.name}（{tool.type}）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Calendar({ year, month, onSelectDate, selectedDate, records }) {
  // year, month: 数字。monthは0〜11
  // records: { yyyy-mm-dd: array of stands }

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay(); // 0(日)〜6(土)
  const daysInMonth = lastDay.getDate();

  // カレンダー行計算（最大6行）
  const weeks = [];
  let dayCount = 1 - firstWeekday;
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++, dayCount++) {
      if (dayCount < 1 || dayCount > daysInMonth) {
        days.push(null);
      } else {
        days.push(dayCount);
      }
    }
    weeks.push(days);
  }

  const formatDate = (y, m, d) => {
    const mm = m + 1 < 10 ? "0" + (m + 1) : m + 1;
    const dd = d < 10 ? "0" + d : d;
    return `${y}-${mm}-${dd}`;
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        maxWidth: 350,
        userSelect: "none",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            {["日", "月", "火", "水", "木", "金", "土"].map((wd) => (
              <th key={wd} style={{ padding: "4px 0", borderBottom: "1px solid #ccc" }}>
                {wd}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) {
                  return <td key={di} style={{ padding: 6, backgroundColor: "#f8f8f8" }}></td>;
                }
                const dateStr = formatDate(year, month, day);
                const hasRecord = records[dateStr]?.length > 0;
                const isSelected = selectedDate === dateStr;

                return (
                  <td
                    key={di}
                    onClick={() => onSelectDate(dateStr)}
                    style={{
                      padding: 8,
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#007bff" : hasRecord ? "#d1e7dd" : "white",
                      color: isSelected ? "white" : "black",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      userSelect: "none",
                    }}
                    title={hasRecord ? `記録あり (${records[dateStr].length}件)` : "記録なし"}
                  >
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  // モード切替
  const [mode, setMode] = useState("practice"); // practice or competition

  // カレンダー年月選択
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // 選択した日付 yyyy-mm-dd
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const mm = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    const dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  // 道具リスト
  const [tools, setTools] = useState(() => {
    // ローカルストレージから復元
    const saved = localStorage.getItem("tools");
    return saved ? JSON.parse(saved) : [];
  });

  // 記録データ構造
  // { practice: { 'yyyy-mm-dd': [standData, ...] }, competition: { ... } }
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("records");
    if (saved) return JSON.parse(saved);
    return { practice: {}, competition: {} };
  });

  // 選択日付の立ち（stands）データ
  const standsForSelected = records[mode][selectedDate] || [];

  // 立ちを更新する関数
  const updateStand = (index, newStandData) => {
    const newStands = [...standsForSelected];
    newStands[index] = newStandData;
    const newModeRecords = { ...records[mode], [selectedDate]: newStands };
    const newRecords = { ...records, [mode]: newModeRecords };
    setRecords(newRecords);
  };

  // 立ちを追加
  const addStand = () => {
    const newStands = [...standsForSelected, { shots: [], selectedTools: [] }];
    const newModeRecords = { ...records[mode], [selectedDate]: newStands };
    const newRecords = { ...records, [mode]: newModeRecords };
    setRecords(newRecords);
  };

  // 道具、記録はローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("tools", JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  // カレンダーの月送り
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>遠的スコア記録アプリ</h1>

      {/* モード切替 */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <button
          onClick={() => setMode("practice")}
          style={{
            padding: "8px 20px",
            marginRight: 8,
            backgroundColor: mode === "practice" ? "#007bff" : "#eee",
            color: mode === "practice" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          練習用
        </button>
        <button
          onClick={() => setMode("competition")}
          style={{
            padding: "8px 20px",
            backgroundColor: mode === "competition" ? "#007bff" : "#eee",
            color: mode === "competition" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          試合用
        </button>
      </div>

      {/* カレンダー */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ marginRight: 12, cursor: "pointer" }}>
          &lt;
        </button>
        <h2 style={{ margin: 0 }}>
          {currentYear}年 {currentMonth + 1}月
        </h2>
        <button onClick={nextMonth} style={{ marginLeft: 12, cursor: "pointer" }}>
          &gt;
        </button>
      </div>

      <Calendar
        year={currentYear}
        month={currentMonth}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
        records={records[mode]}
      />

      <h3 style={{ marginTop: 24, textAlign: "center" }}>
        {selectedDate} の記録 ({mode === "practice" ? "練習用" : "試合用"})
      </h3>

      {/* 立ちごとの記録 */}
      {standsForSelected.length === 0 ? (
        <p style={{ textAlign: "center" }}>この日の記録はまだありません。</p>
      ) : (
        standsForSelected.map((stand, i) => (
          <Stand
            key={i}
            index={i}
            standData={stand}
            setStandData={(newData) => updateStand(i, newData)}
            tools={tools}
            editable={true}
          />
        ))
      )}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button onClick={addStand} style={{ padding: "8px 16px", cursor: "pointer" }}>
          立ちを追加
        </button>
      </div>

      {/* 道具管理 */}
      <ToolManagement tools={tools} setTools={setTools} />
    </div>
  );
}

export default App;
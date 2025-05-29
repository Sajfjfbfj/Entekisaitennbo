import React, { useState, useEffect } from "react";
import "./App.css"; // CSSはそのまま使ってください

const SHOT_POINTS = [
  { name: "3点", radius: 50, score: 3 },
  { name: "5点", radius: 40, score: 5 },
  { name: "7点", radius: 30, score: 7 },
  { name: "9点", radius: 20, score: 9 },
  { name: "10点", radius: 10, score: 10 },
];

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
      width="300"
      height="300"
      viewBox="-60 -60 120 120"
      style={{
        border: "1px solid #ccc",
        backgroundColor: "#fafafa",
        borderRadius: "50%",
        cursor: onShot ? "pointer" : "default",
        userSelect: "none",
      }}
      onClick={(e) => {
        if (!onShot) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = e.clientX - cx;
        const y = e.clientY - cy;
        const scale = 120 / rect.width;
        const posX = x * scale;
        const posY = y * scale;
        onShot({ x: posX, y: posY, score: calculateScore(posX, posY) });
      }}
      aria-label="射的ターゲット"
      role="img"
    >
      {SHOT_POINTS.map((p, i) => (
        <circle
          key={i}
          className={`zone-${p.score}`}
          cx="0"
          cy="0"
          r={p.radius}
          stroke="#999"
          strokeWidth="0.5"
          fill="none"
        />
      ))}

      {shots.map((shot, i) => (
        <circle
          key={i}
          cx={shot.x}
          cy={shot.y}
          r={1.5}
          fill="pink"
          stroke="#e91e63"
          strokeWidth={0.5}
          aria-label={`矢 ${i + 1} の着弾点、得点 ${shot.score}`}
        />
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
      if (selected.length >= 4) return;
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
        userSelect: "none",
      }}
      aria-label={`立ち ${index + 1} の記録`}
    >
      <h3>
        立ち {index + 1} {standData.shots.length > 0 && `(得点: ${totalScore})`}
        {editable && (
          <button
            style={{ marginLeft: 12, cursor: "pointer" }}
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls={`stand-details-${index}`}
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
        <ul id={`stand-details-${index}`} style={{ marginTop: 8 }}>
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
                  userSelect: "none",
                }}
                aria-pressed={selected}
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
        userSelect: "none",
      }}
      aria-label="道具管理"
    >
      <h2>道具管理</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="道具名"
          value={newTool.name}
          onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
          style={{ marginRight: 8 }}
          aria-label="道具名"
        />
        <select
          value={newTool.type}
          onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
          style={{ marginRight: 8 }}
          aria-label="道具種類"
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
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

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
      aria-label={`${year}年${month + 1}月のカレンダー`}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
              <th key={d} style={{ padding: 6, borderBottom: "1px solid #ccc" }}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day)
                  return (
                    <td
                      key={di}
                      style={{ padding: 8, backgroundColor: "#f8f9fa" }}
                      aria-disabled="true"
                    ></td>
                  );

                const dateStr = formatDate(year, month, day);
                const isSelected = selectedDate === dateStr;
                const hasRecords = records && records[dateStr]?.length > 0;

                return (
                  <td
                    key={di}
                    onClick={() => onSelectDate(dateStr)}
                    style={{
                      padding: 8,
                      cursor: "pointer",
                      backgroundColor: isSelected
                        ? "#007bff"
                        : hasRecords
                        ? "#d1e7dd"
                        : "transparent",
                      color: isSelected ? "white" : "black",
                      borderRadius: 4,
                      userSelect: "none",
                      transition: "background-color 0.3s ease",
                    }}
                    aria-current={isSelected ? "date" : undefined}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectDate(dateStr);
                      }
                    }}
                    role="button"
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

export default function App() {
  const [tools, setTools] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tools")) || [];
    } catch {
      return [];
    }
  });

  const [records, setRecords] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("records")) || {
          practice: {},
          competition: {},
        }
      );
    } catch {
      return { practice: {}, competition: {} };
    }
  });

  const [mode, setMode] = useState("practice"); // "practice" or "competition"
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
  });

  // 選択日の立ちデータ（配列）
  const stands = records[mode][selectedDate] || [];

  // 立ちデータ更新用
  const updateStandData = (index, newStandData) => {
    const newStands = [...stands];
    newStands[index] = newStandData;
    setRecords((prev) => {
      const newRecords = { ...prev };
      newRecords[mode] = { ...newRecords[mode], [selectedDate]: newStands };
      localStorage.setItem("records", JSON.stringify(newRecords));
      return newRecords;
    });
  };

  // 立ち追加
  const addStand = () => {
    const newStand = { shots: [], selectedTools: [] };
    const newStands = [...stands, newStand];
    setRecords((prev) => {
      const newRecords = { ...prev };
      newRecords[mode] = { ...newRecords[mode], [selectedDate]: newStands };
      localStorage.setItem("records", JSON.stringify(newRecords));
      return newRecords;
    });
  };

  // 道具をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("tools", JSON.stringify(tools));
  }, [tools]);

  // カレンダーの日付で得点合計表示も入れました（ここから）

  const formatDate = (y, m, d) => {
    const mm = m + 1 < 10 ? "0" + (m + 1) : m + 1;
    const dd = d < 10 ? "0" + d : d;
    return `${y}-${mm}-${dd}`;
  };

  // 月の切り替えボタン（左・右）
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

  // カレンダーのセルに合計点を表示する部分を含めて再定義
  function CalendarWithScore({
    year,
    month,
    onSelectDate,
    selectedDate,
    records,
  }) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

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
        aria-label={`${year}年${month + 1}月のカレンダー`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <button onClick={prevMonth} aria-label="前の月へ" style={{ cursor: "pointer" }}>
            &lt;
          </button>
          <strong>
            {year}年 {month + 1}月
          </strong>
          <button onClick={nextMonth} aria-label="次の月へ" style={{ cursor: "pointer" }}>
            &gt;
          </button>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
                <th key={d} style={{ padding: 6, borderBottom: "1px solid #ccc" }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  if (!day)
                    return (
                      <td
                        key={di}
                        style={{ padding: 8, backgroundColor: "#f8f9fa" }}
                        aria-disabled="true"
                      ></td>
                    );

                  const dateStr = formatDate(year, month, day);
                  const isSelected = selectedDate === dateStr;
                  const hasRecords = records && records[dateStr]?.length > 0;

                  const totalScoreForDay = hasRecords
                    ? records[dateStr].reduce(
                        (acc, stand) =>
                          acc +
                          stand.shots.reduce((sum, shot) => sum + shot.score, 0),
                        0
                      )
                    : 0;

                  return (
                    <td
                      key={di}
                      onClick={() => onSelectDate(dateStr)}
                      style={{
                        padding: 8,
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "#007bff"
                          : hasRecords
                          ? "#d1e7dd"
                          : "transparent",
                        color: isSelected ? "white" : "black",
                        borderRadius: 4,
                        userSelect: "none",
                        transition: "background-color 0.3s ease",
                      }}
                      aria-current={isSelected ? "date" : undefined}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelectDate(dateStr);
                        }
                      }}
                      role="button"
                      aria-label={`${day}日${hasRecords ? ` 合計得点${totalScoreForDay}` : ""}`}
                    >
                      {day}
                      {hasRecords && (
                        <div
                          style={{ fontSize: 10, color: "#155724", marginTop: 2 }}
                          aria-hidden="true"
                        >
                          合計得点: {totalScoreForDay}
                        </div>
                      )}
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

  // 最終的に表示される立ちのコンポーネントリスト
  const standComponents = stands.map((stand, i) => (
    <Stand
      key={i}
      index={i}
      standData={stand}
      setStandData={(newData) => updateStandData(i, newData)}
      tools={tools}
      editable={true}
    />
  ));

  return (
    <main
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
        userSelect: "none",
      }}
    >
      <h1>弓道スコア記録アプリ</h1>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="mode-select">
          モード:
          <select
            id="mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginLeft: 8 }}
            aria-label="モード選択"
          >
            <option value="practice">練習</option>
            <option value="competition">試合</option>
          </select>
        </label>
      </div>

      <CalendarWithScore
        year={currentYear}
        month={currentMonth}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
        records={records[mode]}
      />

      <section
        aria-live="polite"
        style={{ marginTop: 24 }}
        aria-label={`${selectedDate}の${mode === "practice" ? "練習" : "試合"}記録`}
      >
        <h2>
          {selectedDate} の {mode === "practice" ? "練習" : "試合"}記録
        </h2>
        {standComponents.length === 0 && <p>まだ立ちの記録はありません</p>}
        {standComponents}
        <button
          onClick={addStand}
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 4,
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
          aria-label="新しい立ちを追加"
        >
          新しい立ちを追加
        </button>
      </section>

      <ToolManagement tools={tools} setTools={setTools} />
    </main>
  );
}


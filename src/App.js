import React, { useState, useEffect } from "react";
import "./App.css"; // 必ずCSSを読み込んでね

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

function Calendar({ year, month, onSelectDate, selectedDate, records })
 {
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
                if (!day) return <td key={di} style={{ padding: 8 }}></td>;

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
                    }}

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
      return JSON.parse(localStorage.getItem("records")) || { practice: {}, competition: {} };
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

  // 選択日付の立ち一覧を取得
  const standsForSelected = records[mode][selectedDate] || [];

  // 立ちを更新
  const updateStand = (index, newData) => {
    const updatedStands = [...standsForSelected];
    updatedStands[index] = newData;
    setRecords({
      ...records,
      [mode]: {
        ...records[mode],
        [selectedDate]: updatedStands,
      },
    });
  };

  // 立ちを追加
  const addStand = () => {
    const newStand = {
      shots: [],
      selectedTools: [],
    };
    const updatedStands = [...standsForSelected, newStand];
    setRecords({
      ...records,
      [mode]: {
        ...records[mode],
        [selectedDate]: updatedStands,
      },
    });
  };

  // 道具と記録はローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("tools", JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  // 年月変更のための関数
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
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 24,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>遠的スコア記録アプリ</h1>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <button
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
          style={{ marginRight: 12, cursor: mode === "practice" ? "default" : "pointer" }}
        >
          練習モード
        </button>
        <button
          onClick={() => setMode("competition")}
          disabled={mode === "competition"}
          style={{ cursor: mode === "competition" ? "default" : "pointer" }}
        >
          大会モード
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
          gap: 12,
          userSelect: "none",
        }}
      >
        <button onClick={prevMonth} style={{ cursor: "pointer" }}>
          &lt; 前月
        </button>
        <div style={{ fontWeight: "bold" }}>
          {currentYear}年 {currentMonth + 1}月
        </div>
        <button onClick={nextMonth} style={{ cursor: "pointer" }}>
          次月 &gt;
        </button>
      </div>

      <Calendar
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}

        records={records[mode]}
      />

      <div style={{ marginTop: 24 }}>
        <h2>
          {selectedDate} の記録（{mode === "practice" ? "練習" : "大会"}モード）
        </h2>
        {standsForSelected.length === 0 && <p>この日に記録はありません。</p>}

        {standsForSelected.map((stand, i) => (
          <Stand
            key={i}
            index={i}
            standData={stand}
            setStandData={(newData) => updateStand(i, newData)}
            tools={tools}
            editable={true}
          />
        ))}

        <button
          onClick={addStand}
          style={{
            cursor: "pointer",
            padding: "8px 16px",
            marginTop: 12,
            borderRadius: 6,
            border: "1px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
          }}
        >
          立ちを追加
        </button>
      </div>


      <ToolManagement tools={tools} setTools={setTools} />
    </div>
  );
}


import React, { useState, useEffect } from "react";

export default function ToolInput() {
  const [toolName, setToolName] = useState("");
  const [registeredTools, setRegisteredTools] = useState([]);

  // 初回ロード時にローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("tools");
    if (saved) {
      setRegisteredTools(JSON.parse(saved));
    }
  }, []);

  // 道具登録処理
  const registerTool = () => {
    const trimmedName = toolName.trim();
    if (!trimmedName) {
      alert("道具名を入力してください！");
      return;
    }
    if (registeredTools.includes(trimmedName)) {
      alert("すでに登録済みの道具です。");
      return;
    }
    const newTools = [...registeredTools, trimmedName];
    setRegisteredTools(newTools);
    localStorage.setItem("tools", JSON.stringify(newTools));
    setToolName("");
  };

  // 登録済み道具を選択した時の処理
  const onSelectChange = (e) => {
    setToolName(e.target.value);
  };

  return (
    <div style={{ maxWidth: 400, margin: "1rem auto", fontFamily: "sans-serif" }}>
      <label htmlFor="tool-input" style={{ display: "block", marginBottom: 8 }}>
        道具名を入力してください：
      </label>
      <input
        id="tool-input"
        type="text"
        value={toolName}
        onChange={(e) => setToolName(e.target.value)}
        placeholder="例：弓、矢、弦"
        style={{ width: "60%", padding: "0.4rem", fontSize: "1rem" }}
      />
      <button
        onClick={registerTool}
        style={{
          marginLeft: 10,
          padding: "0.4rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        登録
      </button>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="tool-select" style={{ display: "block", marginBottom: 8 }}>
          登録済みの道具から選ぶ：
        </label>
        <select
          id="tool-select"
          value={toolName}
          onChange={onSelectChange}
          style={{ width: "100%", padding: "0.4rem", fontSize: "1rem" }}
        >
          <option value="">-- 道具を選択してください --</option>
          {registeredTools.map((tool, idx) => (
            <option key={idx} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
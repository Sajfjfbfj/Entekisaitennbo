import React from "react";

const sumScore = (shots) => shots.reduce((sum, s) => sum + s.score, 0);

export default function HistoryDetail({ comp }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div>使用道具：</div>
      <ul>
        <li>弓: {comp.equipment.bow || "-"}</li>
        <li>矢: {comp.equipment.arrow || "-"}</li>
        <li>弦: {comp.equipment.string || "-"}</li>
      </ul>

      {comp.type === "practice" && (
        <>
          <div>ショット詳細（得点・座標）:</div>
          <ul style={{ maxHeight: 150, overflowY: "auto" }}>
            {comp.shots.map((shot, i) => (
              <li key={i}>
                得点: {shot.score}, X: {Math.round(shot.x)}, Y: {Math.round(shot.y)}
              </li>
            ))}
          </ul>
          <div>合計スコア: {sumScore(comp.shots)}</div>
        </>
      )}

      {comp.type === "competition" && (
        <>
          <div>ラウンド詳細:</div>
          {comp.rounds && comp.rounds.length > 0 ? (
            comp.rounds.map((round, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b>{i + 1}立ち:</b> {round.shots.length}射, 合計スコア: {sumScore(round.shots)}
                <ul style={{ maxHeight: 120, overflowY: "auto", marginTop: 4 }}>
                  {round.shots.map((shot, j) => (
                    <li key={j}>
                      得点: {shot.score}, X: {Math.round(shot.x)}, Y: {Math.round(shot.y)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>ラウンド記録なし</div>
          )}
        </>
      )}
    </div>
  );
}

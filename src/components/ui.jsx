import React from "react";

export function Panel({ title, right, children, tight }) {
  return (
    <section className="panel">
      {(title || right) && (
        <div className="panel-hd">
          {title ? <h2>{title}</h2> : <span />}
          {right}
        </div>
      )}
      <div className={"panel-bd" + (tight ? " tight" : "")}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, sub, color = "var(--ink)" }) {
  return (
    <div>
      <div className="stat-l">{label}</div>
      <div className="stat-v" style={{ color }}>
        {value}
      </div>
      {sub && <div className="stat-s">{sub}</div>}
    </div>
  );
}

export function Btn({ children, onClick, tone = "", className = "", ...rest }) {
  return (
    <button className={`btn ${tone} ${className}`.trim()} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export const Empty = ({ text }) => <div className="empty">{text}</div>;

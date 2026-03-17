export default function Badge({ value, stylesMap }) {
    const s = stylesMap[value] ?? {
        label: value,
        color: "#8a8880",
        bg: "#f8f8f6",
        border: "#e2e2de"
    };

    return (
        <span
            style={{
                fontSize: 12,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: s.color,
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 2,
                padding: "3px 10px",
            }}
        >
            {s.label}
        </span>
    );
}

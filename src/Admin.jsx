import React, { useState } from "react";

const CONTEXTOS = ["inpe", "brasil", "mundo"];

function Admin() {
  const [ano, setAno] = useState("");
  const [contexto, setContexto] = useState("inpe");
  const [topicos, setTopicos] = useState("");
  const [imagens, setImagens] = useState([]);
  const [legendas, setLegendas] = useState([]);
  const [fontesTexto, setFontesTexto] = useState([]);
  const [fontesLink, setFontesLink] = useState([]);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function handleImagens(e) {
    const files = Array.from(e.target.files);
    setImagens(files);
    setLegendas(files.map(() => ""));
    setFontesTexto(files.map(() => ""));
    setFontesLink(files.map(() => ""));
  }

  function atualizarLegenda(i, valor) {
    setLegendas((prev) => prev.map((l, j) => (j === i ? valor : l)));
  }

  function atualizarFonteTexto(i, valor) {
    setFontesTexto((prev) => prev.map((f, j) => (j === i ? valor : f)));
  }

  function atualizarFonteLink(i, valor) {
    setFontesLink((prev) => prev.map((f, j) => (j === i ? valor : f)));
  }

  async function handleSubmit() {
    if (!ano || !contexto || !topicos) {
      setStatus({
        tipo: "erro",
        msg: "Preencha ano, contexto e pelo menos um tópico.",
      });
      return;
    }

    setEnviando(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("ano", ano);
    formData.append("contexto", contexto);

    topicos
      .split("\n")
      .filter(Boolean)
      .forEach((t) => formData.append("topicos", t));

    imagens.forEach((img, i) => {
      formData.append("imagens", img);
      formData.append("legenda", legendas[i] || "");
      formData.append("fonteTexto", fontesTexto[i] || "");
      formData.append("fonteLink", fontesLink[i] || "");
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timeline`, {
        method: "POST",
        headers: {
          "x-api-key": import.meta.env.VITE_ADMIN_API_KEY, // <- adiciona o header
        },
        body: formData,
      });
      const json = await res.json();

      if (res.ok) {
        setStatus({ tipo: "ok", msg: json.mensagem });
        setAno("");
        setTopicos("");
        setImagens([]);
        setLegendas([]);
      } else {
        setStatus({ tipo: "erro", msg: json.mensagem });
      }
    } catch (err) {
      setStatus({ tipo: "erro", msg: "Erro de conexão com o servidor." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "Segoe UI, sans-serif",
        padding: "0 20px",
      }}
    >
      <h1 style={{ color: "#003366" }}>Inserir Ano</h1>

      <label>Ano</label>
      <input
        type="number"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        style={inputStyle}
        placeholder="ex: 1969"
      />

      <label>Contexto</label>
      <select
        value={contexto}
        onChange={(e) => setContexto(e.target.value)}
        style={inputStyle}
      >
        {CONTEXTOS.map((c) => (
          <option key={c} value={c}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>

      <label>Tópicos (um por linha)</label>
      <textarea
        value={topicos}
        onChange={(e) => setTopicos(e.target.value)}
        rows={5}
        style={inputStyle}
        placeholder={"Primeiro tópico\nSegundo tópico"}
      />

      <label>Imagens (opcional)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImagens}
        style={{ marginBottom: 16 }}
      />

      {imagens.map((img, i) => (
        <div
          key={i}
          style={{
            background: "#f0f2f5",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{img.name}</p>
          <input
            placeholder="Legenda"
            value={legendas[i]}
            onChange={(e) => atualizarLegenda(i, e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Fonte (texto)"
            value={fontesTexto[i]}
            onChange={(e) => atualizarFonteTexto(i, e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Fonte (link)"
            value={fontesLink[i]}
            onChange={(e) => atualizarFonteLink(i, e.target.value)}
            style={inputStyle}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={enviando}
        style={{
          background: "#003366",
          color: "#fff",
          border: "none",
          padding: "10px 24px",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        {enviando ? "Enviando..." : "Salvar"}
      </button>

      {status && (
        <p
          style={{
            marginTop: 16,
            color: status.tipo === "ok" ? "green" : "red",
          }}
        >
          {status.msg}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: 12,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};

export default Admin;

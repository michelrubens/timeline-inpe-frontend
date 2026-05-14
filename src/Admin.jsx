import React, { useState } from "react";
import "./Admin.css"; // Importa o novo arquivo CSS
const CONTEXTOS = ["mundo", "brasil", "inpe"];

function Admin() {
  const [ano, setAno] = useState("");
  const [contexto, setContexto] = useState(CONTEXTOS[0]);
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
        // Limpa os estados relacionados às imagens
        // Isso também resetará o input de arquivo
        setImagens([]);
        setLegendas([]);
        setFontesTexto([]);
        setFontesLink([]);
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
    <div className="admin-page-container">
      <div className="admin-card">
        <h1 className="admin-title">Inserir Ano</h1>

        <label className="admin-label">Ano</label>
        <input
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="admin-input"
          placeholder="ex: 1969"
        />

        <label className="admin-label">Contexto</label>
        <select
          value={contexto}
          onChange={(e) => setContexto(e.target.value)}
          className="admin-input admin-select"
        >
          {CONTEXTOS.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <label className="admin-label">Tópicos (um por linha)</label>
        <textarea
          value={topicos}
          onChange={(e) => setTopicos(e.target.value)}
          rows={5}
          className="admin-textarea"
          placeholder={"Primeiro tópico\nSegundo tópico"}
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
              className="admin-input"
            />
            <input
              placeholder="Fonte (texto)"
              value={fontesTexto[i]}
              onChange={(e) => atualizarFonteTexto(i, e.target.value)}
              className="admin-input"
            />
            <input
              placeholder="Fonte (link)"
              value={fontesLink[i]}
              onChange={(e) => atualizarFonteLink(i, e.target.value)}
              className="admin-input"
            />
          </div>
        ))}

        <div className="admin-actions">
          <label className="admin-button">
            {imagens.length > 0
              ? `${imagens.length} img selecionada(s)`
              : "Selecionar Imagens"}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagens}
              className="hidden-file-input"
            />
          </label>

          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="admin-button"
          >
            {enviando ? "Enviando..." : "Salvar"}
          </button>
        </div>

        {status && (
          <p
            className={`admin-status ${status.tipo === "ok" ? "admin-status-success" : "admin-status-error"}`}
          >
            {status.msg}
          </p>
        )}
      </div>
    </div>
  );
}

{
  /* const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: 12,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: "0.95rem",
  boxSizing: "border-box",
}; */
}

export default Admin;

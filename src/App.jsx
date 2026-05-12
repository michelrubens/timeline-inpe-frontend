import React, { useState, useEffect, useRef, useCallback } from "react"; // <- adiciona hooks
import "./App.css";
import logoImg from "./assets/linha-do-tempo-inpe.png";
import timelineData from "./mock/timelineData";

const LIMITE = 2; // Anos carregados por vez

function App() {
  const [timeline, setTimeline] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const sentinelaRef = useRef(null);

  const carregarPagina = useCallback(
    async (paginaAtual) => {
      if (carregando || !temMais) return;
      setCarregando(true);

      // Simula latência de rede (retire quando conectar à API real)
      await new Promise((r) => setTimeout(r, 800));

      const inicio = paginaAtual * LIMITE;
      const slice = timelineData.slice(inicio, inicio + LIMITE);

      setTimeline((prev) => [...prev, ...slice]);
      setPagina(paginaAtual + 1);

      if (inicio + LIMITE >= timelineData.length) setTemMais(false);

      setCarregando(false);
    },
    [carregando, temMais],
  );

  // Carga inicial
  useEffect(() => {
    carregarPagina(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Observa a sentinela para carregar mais
  useEffect(() => {
    if (!sentinelaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) carregarPagina(pagina);
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelaRef.current);
    return () => observer.disconnect();
  }, [pagina, carregarPagina]);

  return (
    <div className="container">
      <header
        className="header"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <img
          src={logoImg}
          alt="Linha do Tempo INPE"
          className="logo-responsiva"
        />
        <p>A trajetória espacial brasileira</p>
      </header>

      {/* Wrapper que contém a linha vertical */}
      <div className="timeline-wrapper">
        {/* Marcador - INÍCIO */}
        <div className="timeline-start">
          <div className="start-label">O INÍCIO</div>
          <div className="start-dot"></div>
        </div>

        {timeline.map((item) => (
          <section key={item.ano} className="ano-section">
            <div className="ano-badge">{item.ano}</div>

            <div className="grid-container">
              <article className="card card-inpe">
                <h3>INPE</h3>
                <ul>
                  {item.contextos.inpe.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </article>

              <article className="card card-brasil">
                <h3>Brasil</h3>
                <ul>
                  {item.contextos.brasil.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </article>

              <article className="card card-mundo">
                <h3>Mundo</h3>
                <ul>
                  {item.contextos.mundo.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        ))}

        {/* Sentinela invisível — dispara o próximo carregamento */}
        <div ref={sentinelaRef} style={{ height: 1 }} />

        {carregando && (
          <p style={{ textAlign: "center", color: "#003366", padding: "20px" }}>
            Carregando...
          </p>
        )}

        {!temMais && (
          <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
            Fim da linha do tempo.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

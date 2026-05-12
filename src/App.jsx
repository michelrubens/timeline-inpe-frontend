import React, { useState, useEffect, useRef, useCallback } from "react"; // <- adiciona hooks
import "./App.css";
import logoImg from "./assets/linha-do-tempo-inpe.png";
import timelineData from "./mock/timelineData";

const LIMITE = 5; // Anos carregados por vez

function App() {
  const [timeline, setTimeline] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const sentinelaRef = useRef(null);
  const paginaRef = useRef(0); // controla a página sem re-renderizar
  const carregandoRef = useRef(false); // evita disparos simultâneos

  const carregarPagina = useCallback(async () => {
    if (
      carregandoRef.current ||
      paginaRef.current * LIMITE >= timelineData.length
    )
      return;

    carregandoRef.current = true;
    setCarregando(true);

    await new Promise((r) => setTimeout(r, 800));

    const inicio = paginaRef.current * LIMITE;
    const slice = timelineData.slice(inicio, inicio + LIMITE);

    setTimeline((prev) => [...prev, ...slice]);
    paginaRef.current += 1;

    if (inicio + LIMITE >= timelineData.length) setTemMais(false);

    carregandoRef.current = false;
    setCarregando(false);
  }, []);

  // Carga inicial
  useEffect(() => {
    carregarPagina();
  }, [carregarPagina]);

  // Observer recriado após cada renderização do timeline
  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el || !temMais) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) carregarPagina();
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [timeline, temMais, carregarPagina]); // <- timeline aqui é a chave

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
        <p>
          A história do Instituto Nacional de Pesquisas Espaciais e algumas
          realizações que marcaram a sua trajetória, inseridas no contexto dos
          principais acontecimentos em ciência e tecnologia no Brasil e no
          Mundo.
        </p>
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
                {item.contextos.inpe.imagens.map((img, i) => (
                  <figure key={i} className="card-figura">
                    <img
                      src={img.url}
                      alt={img.legenda}
                      className="card-imagem"
                    />
                    <figcaption className="card-legenda">
                      {img.legenda}
                    </figcaption>
                  </figure>
                ))}
              </article>

              <article className="card card-brasil">
                <h3>Brasil</h3>
                <ul>
                  {item.contextos.brasil.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
                {item.contextos.brasil.imagens.map((img, i) => (
                  <figure key={i} className="card-figura">
                    <img
                      src={img.url}
                      alt={img.legenda}
                      className="card-imagem"
                    />
                    <figcaption className="card-legenda">
                      {img.legenda}
                    </figcaption>
                  </figure>
                ))}
              </article>

              <article className="card card-mundo">
                <h3>Mundo</h3>
                <ul>
                  {item.contextos.mundo.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
                {item.contextos.mundo.imagens.map((img, i) => (
                  <figure key={i} className="card-figura">
                    <img
                      src={img.url}
                      alt={img.legenda}
                      className="card-imagem"
                    />
                    <figcaption className="card-legenda">
                      {img.legenda}
                    </figcaption>
                  </figure>
                ))}
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

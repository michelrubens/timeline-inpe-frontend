import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import "./App.css";
import logoImg from "./assets/linha-do-tempo-inpe.png";
import footerImg from "./assets/Inpe-Ministerio-Governo-1cor.svg";

const LIMITE = 5;

function App() {
  const [timeline, setTimeline] = useState([]);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const sentinelaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const paginaRef = useRef(0);
  const carregandoRef = useRef(false);

  // Efeito para transformar scroll vertical do mouse em horizontal
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // O scroll horizontal só será ativado se o mouse estiver sobre o cabeçalho do ano ou a dica de scroll
      const isHorizontalZone =
        e.target.closest(".ano-header") || e.target.closest(".scroll-hint");

      if (isHorizontalZone && e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY + e.deltaX;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const carregarPagina = useCallback(async () => {
    if (carregandoRef.current || !temMais) return;

    carregandoRef.current = true;
    setCarregando(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/timeline?pagina=${paginaRef.current + 1}&limite=${LIMITE}`,
      );
      const json = await res.json();

      setTimeline((prev) => [...prev, ...json.dados]);
      paginaRef.current += 1;
      setTemMais(json.temMais);
    } catch (err) {
      console.error("Erro ao carregar timeline:", err);
    } finally {
      carregandoRef.current = false;
      setCarregando(false);
    }
  }, [temMais]);

  // Carga inicial
  useEffect(() => {
    carregarPagina();
  }, [carregarPagina]);

  // Observer — funciona tanto no scroll horizontal quanto vertical
  useEffect(() => {
    const el = sentinelaRef.current;
    const container = scrollContainerRef.current;
    if (!el || !container || !temMais) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) carregarPagina();
      },
      {
        root: container,
        rootMargin: "0px 200px 0px 0px", // Reduzido para evitar cálculos desnecessários longe do fim
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [temMais, carregarPagina]);

  return (
    <div className="container">
      <header className="header">
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

      <div className="timeline-wrapper">
        {/* Área de scroll horizontal (desktop) / vertical (mobile) */}
        <div className="timeline-scroll" ref={scrollContainerRef}>
          {/* Marcador de início */}
          <div className="timeline-start">
            <div className="start-label">O INÍCIO</div>
            <div className="start-dot"></div>
          </div>

          {/* Conector entre marcador e primeiro ano */}
          <div className="timeline-connector" aria-hidden="true" />

          {timeline.map((item, index) => (
            <React.Fragment key={item.ano}>
              <section className="ano-section">
                {/* Badge do ano com linhas laterais */}
                <div className="ano-header">
                  <div className="ano-linha" aria-hidden="true" />
                  <div className="ano-badge">{item.ano}</div>
                  <div className="ano-linha" aria-hidden="true" />
                </div>

                <div className="grid-container">
                  {/* Card Mundo */}
                  <article className="card card-mundo">
                    <h3>Mundo</h3>
                    {(item.contextos.mundo?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">
                          {img.legenda}
                        </figcaption>
                        {img.fonte?.link && (
                          <a
                            href={img.fonte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-imagem-fonte"
                          >
                            Fonte: {img.fonte.texto || img.fonte.link}
                          </a>
                        )}
                      </figure>
                    ))}
                    <ul>
                      {(item.contextos.mundo?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string"
                            ? t
                            : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                  </article>

                  {/* Card Brasil */}
                  <article className="card card-brasil">
                    <h3>Brasil</h3>
                    {(item.contextos.brasil?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">
                          {img.legenda}
                        </figcaption>
                        {img.fonte?.link && (
                          <a
                            href={img.fonte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-imagem-fonte"
                          >
                            Fonte: {img.fonte.texto || img.fonte.link}
                          </a>
                        )}
                      </figure>
                    ))}
                    <ul>
                      {(item.contextos.brasil?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string"
                            ? t
                            : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                  </article>

                  {/* Card INPE */}
                  <article className="card card-inpe">
                    <h3>INPE</h3>
                    {(item.contextos.inpe?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">
                          {img.legenda}
                        </figcaption>
                        {img.fonte?.link && (
                          <a
                            href={img.fonte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-imagem-fonte"
                          >
                            Fonte: {img.fonte.texto || img.fonte.link}
                          </a>
                        )}
                      </figure>
                    ))}
                    <ul>
                      {(item.contextos.inpe?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string"
                            ? t
                            : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            </React.Fragment>
          ))}

          {/* Loading inline (aparece na linha do scroll) */}
          {carregando && <p className="loading-msg">Carregando...</p>}

          {/* Sentinela — dispara o próximo carregamento */}
          <div ref={sentinelaRef} className="sentinela" />

          {/* Marcador de fim */}
          {!temMais && (
            <>
              <div className="timeline-connector" aria-hidden="true" />
              <div className="timeline-end">
                <div className="end-dot"></div>
                <div className="end-label">SEGUE...</div>
              </div>
            </>
          )}
        </div>

        {/* Dica de navegação horizontal (só desktop) */}
        <p className="scroll-hint">
          ← arraste ou use o scroll para navegar pelos anos →
        </p>
      </div>

      <footer className="footer">
        <img
          src={footerImg}
          alt="Logos Institucionais: INPE, MCTI e Governo Federal"
          className="footer-logo"
        />
      </footer>
    </div>
  );
}

export default App;

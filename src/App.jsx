import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import "./App.css";
import logoImg from "./assets/linha-do-tempo-inpe.png";

const LIMITE = 5;

function App() {
  const [timeline, setTimeline] = useState([]);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const sentinelaRef = useRef(null);
  const paginaRef = useRef(0);
  const carregandoRef = useRef(false);

  const carregarPagina = useCallback(async () => {
    if (carregandoRef.current || !temMais) return;

    carregandoRef.current = true;
    setCarregando(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/timeline?pagina=${paginaRef.current + 1}&limite=${LIMITE}`
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
    if (!el || !temMais) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) carregarPagina();
      },
      {
        // root: null observa o viewport, mas no scroll horizontal
        // o elemento sentinela precisa estar dentro do scroll container.
        // Passamos o scroll container como root para funcionar no horizontal.
        root: el.closest(".timeline-scroll") || null,
        rootMargin: "0px 300px 0px 0px", // dispara 300px antes do fim horizontal
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [timeline, temMais, carregarPagina]);

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
        <div className="timeline-scroll">

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
                    <ul>
                      {(item.contextos.mundo?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string" ? t : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                    {(item.contextos.mundo?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">{img.legenda}</figcaption>
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
                  </article>

                  {/* Card Brasil */}
                  <article className="card card-brasil">
                    <h3>Brasil</h3>
                    <ul>
                      {(item.contextos.brasil?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string" ? t : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                    {(item.contextos.brasil?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">{img.legenda}</figcaption>
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
                  </article>

                  {/* Card INPE */}
                  <article className="card card-inpe">
                    <h3>INPE</h3>
                    <ul>
                      {(item.contextos.inpe?.topicos || []).map((t, i) => (
                        <li key={i}>
                          {typeof t === "string" ? t : t.texto || JSON.stringify(t)}
                        </li>
                      ))}
                    </ul>
                    {(item.contextos.inpe?.imagens || []).map((img, i) => (
                      <figure key={i} className="card-figura">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.url}`}
                          alt={img.legenda}
                          className="card-imagem"
                        />
                        <figcaption className="card-legenda">{img.legenda}</figcaption>
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
                  </article>
                </div>
              </section>
            </React.Fragment>
          ))}

          {/* Loading inline (aparece na linha do scroll) */}
          {carregando && (
            <p className="loading-msg">Carregando...</p>
          )}

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
        <p className="scroll-hint">← arraste ou use o scroll para navegar pelos anos →</p>
      </div>
    </div>
  );
}

export default App;

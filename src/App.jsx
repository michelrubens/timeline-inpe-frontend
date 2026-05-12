import React, { useState } from "react";

function App() {
  // Mock inicial para você ver a estrutura funcionando
  const [timeline, setTimeline] = useState([
    {
      ano: 1961,
      contextos: {
        inpe: {
          topicos: ["Criação do GOCNAE (precursor do INPE)"],
          imagens: [],
        },
        brasil: { topicos: ["Renúncia de Jânio Quadros"], imagens: [] },
        mundo: { topicos: ["Yuri Gagarin vai ao espaço"], imagens: [] },
      },
    },
  ]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <header>
        <h1>Linha do Tempo INPE</h1>
        <p>História, Brasil e Mundo desde 1961</p>
      </header>

      <main>
        {timeline.map((item) => (
          <div
            key={item.ano}
            style={{ borderBottom: "2px solid #eee", marginBottom: "30px" }}
          >
            <h2 style={{ color: "#005599" }}>{item.ano}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {/* Coluna INPE */}
              <section>
                <h3 style={{ borderBottom: "1px solid #ddd" }}>INPE</h3>
                <ul>
                  {item.contextos.inpe.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>

              {/* Coluna Brasil */}
              <section>
                <h3 style={{ borderBottom: "1px solid #ddd" }}>Brasil</h3>
                <ul>
                  {item.contextos.brasil.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>

              {/* Coluna Mundo */}
              <section>
                <h3 style={{ borderBottom: "1px solid #ddd" }}>Mundo</h3>
                <ul>
                  {item.contextos.mundo.topicos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;

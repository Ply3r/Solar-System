# Solar System

Réplica 3D e interativa do Sistema Solar que roda direto no navegador, feita com [Three.js](https://threejs.org/). O Sol fica no centro, os oito planetas orbitam em volta dele e a Lua orbita a Terra.

**Demo:** https://ply3r.github.io/Solar-System/

![Solar System](https://i.ibb.co/zSs1zr7/solar-system.png)

## Funcionalidades

- Sol no centro, como fonte de luz, com sombras projetadas pelos planetas e pela Lua.
- Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno (com anel), Urano e Netuno, cada um com textura, velocidade de órbita e rotação próprias.
- Lua orbitando a Terra com a órbita levemente inclinada.
- Rastro colorido atrás de cada planeta e da Lua, que aparece conforme eles andam e some aos poucos.
- Fundo de estrelas em três camadas distantes, com efeito parallax ao girar a câmera.
- Anti-aliasing (FXAA) e ajuste automático ao redimensionar a janela.
- Animações independentes do framerate.

## Controles

| Ação | Resultado |
|---|---|
| Arrastar com o mouse | Gira a câmera em volta do Sol |
| Roda do mouse | Zoom (distância entre 100 e 3000) |
| Um dedo (celular) | Gira a câmera |
| Dois dedos (celular) | Zoom |

O movimento lateral (pan) está desativado de propósito, para a câmera ficar sempre centrada no Sol.

## Como rodar

O projeto não tem build. Basta servir a pasta com qualquer servidor estático. É preciso ter internet, porque o Three.js é carregado por CDN (jsDelivr).

```bash
git clone https://github.com/Ply3r/Solar-System.git
cd Solar-System
npm start
```

Depois abra http://localhost:8080. O `npm start` usa o `http-server` via `npx`, então só precisa do Node instalado. Qualquer outro servidor estático também serve, por exemplo `python3 -m http.server 8080`.

> Abrir o `index.html` direto pelo navegador (`file://`) não funciona, porque os módulos ES exigem HTTP.

## Estrutura

```text
├── index.html        # canvas, importmap do Three.js e carga do index.js
├── index.js          # cena, câmera, órbitas, rastros, estrelas e loop de animação
├── style.css         # canvas em tela cheia
├── components/
│   ├── Sun.js        # Sol e a luz pontual
│   ├── Earth.js      # Terra
│   ├── Moon.js       # Lua (grupos de pivô para a órbita inclinada)
│   └── Planets.js    # fábrica genérica para os demais planetas
└── images/           # texturas dos planetas, do Sol e do anel
```

## Personalizando

Os planetas ficam na lista `planetData` em `index.js`. Cada linha segue este formato:

```js
// [nome, [raio, segmentos, segmentos], distância do Sol, velocidade de órbita (rad/s),
//  rotação (rad/s), cor do rastro, ângulo inicial (rad)]
["earth", [15, 60, 30], 300, 0.12, 0.06, 0x4aa3ff, 4.0],
```

- Para mudar a velocidade, a distância ou onde cada planeta começa, edite os valores da linha.
- Para mudar o tamanho e a duração dos rastros, ajuste `TRAIL_POINTS` e `TRAIL_ANGLE`.
- Para mudar o efeito do fundo, ajuste `count`, `radius` e `follow` em `starLayers`.

As escalas são artísticas: tamanhos, distâncias e velocidades não são proporcionais aos reais.

## Tecnologias

- JavaScript (módulos ES, sem build)
- HTML e CSS
- [Three.js](https://threejs.org/) 0.135.0: renderização WebGL, `OrbitControls` e pós-processamento (`EffectComposer`, FXAA)

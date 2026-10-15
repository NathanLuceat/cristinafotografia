# Cristina Ferreira | Fotografia Afetiva

Landing page institucional para a fotógrafa **Cristina Ferreira**, especializada em fotografia documental e afetiva de famílias, casamentos, 15 anos e ensaios em Boa Esperança - MG.

Projeto desenvolvido com design editorial minimalista e acolhedor, priorizando a valorização das fotografias com alta fidelidade visual, navegação fluida e integração direta para contato e agendamento via WhatsApp.

---

## 🛠️ Tecnologias & Bibliotecas

- **[Vite](https://vitejs.dev/)** — Build tool e servidor de desenvolvimento ultra-rápido.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização moderna através de `@theme` e design tokens dedicados.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática e segurança no código.
- **[PhotoSwipe 5](https://photoswipe.com/)** — Lightbox com aceleração gráfica, gestos em dispositivos móveis e zoom de alta fidelidade em tela cheia.
- **[Swiper 12](https://swiperjs.com/)** — Carrossel responsivo e elegante para visualização fluida das obras do portfólio.
- **[Lucide Icons](https://lucide.dev/)** — Ícones minimalistas para interface limpa.
- **[Sharp](https://sharp.pixelplumbing.com/)** — Pipeline automatizado de otimização e conversão de imagens para o formato WebP.

---

## 📂 Estrutura do Projeto

```text
├── Fotos/                    # Fotografias originais de alta resolução
│   ├── foto-capa.jpg         # Retrato de abertura da fotógrafa
│   ├── estudio.jpg           # Fachada e identificação do estúdio físico
│   ├── frase.jpeg            # Fotografia conceitual
│   └── portfolio/            # Acervo de fotos originais do portfólio
├── public/
│   └── images/               # Fotografias otimizadas em formato WebP
│       ├── cristina-perfil.webp
│       ├── estudio-fachada.webp
│       ├── poesia-chuva.webp
│       └── portfolio/        # Imagens em alta resolução + miniaturas leves
├── scripts/
│   └── optimize-images.js    # Script de processamento automático com Sharp
├── src/
│   ├── data/
│   │   └── photos.ts         # Metadados e dimensões precisas para o PhotoSwipe
│   ├── styles.css            # Estilos globais e tokens de cores da paleta
│   ├── main.ts               # Inicialização de navegação, carrossel e lightbox
│   └── vite-env.d.ts
├── index.html                # Estrutura semântica da landing page
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Como Executar Localmente

### 1. Clonar e Instalar Dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd cristinafotografa
npm install
```

### 2. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse no navegador: `http://localhost:5174`

### 3. Gerar Build de Produção

```bash
npm run build
```

Os arquivos estáticos otimizados serão gerados na pasta `dist/`.

### 4. Pré-visualizar Build de Produção

```bash
npm run preview
```

### 5. Otimização de Imagens

Caso adicione novas fotos na pasta `Fotos/`, execute:

```bash
npm run optimize-images
```

O script atualizará automaticamente os arquivos `.webp` e o arquivo `src/data/photos.ts`.

---

## 🎨 Paleta de Cores Oficial

| Cor | Hex | Aplicação |
|---|---|---|
| **Branco** | `#FFFFFF` | Molduras de fotos (*passe-partout*) e cartões |
| **Creme** | `#F7F5F0` | Fundo principal suave e acolhedor |
| **Grafite** | `#2E2E2E` | Tipografia principal e alto contraste |
| **Cinza Quente** | `#77736D` | Subtítulos, legendas e textos de apoio |
| **Bege Pastel** | `#D8CFC2` | Divisórias e bordas delicadas |
| **Verde Sálvia** | `#C9D3C2` | Destaques sutis e elementos orgânicos |
| **Azul Pastel** | `#CAD3D8` | Acentos de serenidade |
| **Cinza Claro** | `#E8E6E2` | Fundos de apoio neutros |

---

## 📄 Licença

Uso exclusivo e institucional para **Cristina Ferreira Fotografia**. Todos os direitos reservados.

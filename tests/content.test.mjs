import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const publicationsHtml = readFileSync(new URL('../publications.html', import.meta.url), 'utf8');
const activitiesHtml = readFileSync(new URL('../activities.html', import.meta.url), 'utf8');
const papersBib = readFileSync(new URL('../Papers.bib', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const sitePages = [
  { file: 'index.html', html: indexHtml, canonical: 'https://tongji-epic.github.io/' },
  { file: 'publications.html', html: publicationsHtml, canonical: 'https://tongji-epic.github.io/publications.html' },
  { file: 'activities.html', html: activitiesHtml, canonical: 'https://tongji-epic.github.io/activities.html' }
];

test('homepage Chinese copy is localized for key visible text', () => {
  assert.match(indexHtml, /<p class="hero-subtitle">Embodied Perception &amp; Intelligence Computing<\/p>/);
  assert.match(indexHtml, /<p class="hero-subtitle zh-only" data-lang="zh">具身感知与智能计算实验室<\/p>/);
  assert.match(indexHtml, /面向智慧工业与自主系统，推动具身多媒体智能发展。/);
  assert.match(indexHtml, /实验室主页/);
  assert.match(indexHtml, /谷歌学术/);
});

test('homepage students include Xinwei Sun in both languages', () => {
  assert.match(
    indexHtml,
    /刘普俊[\s\S]*孙鑫伟[\s\S]*黄涵/
  );
  assert.match(
    indexHtml,
    /Pujun Liu[\s\S]*Xinwei Sun[\s\S]*Han Huang/
  );
  assert.match(
    indexHtml,
    /孙鑫伟[\s\S]{0,300}<td>2024<\/td>[\s\S]{0,80}<td>Ph\.D\.<\/td>[\s\S]{0,300}>在读<\/span>/
  );
  assert.match(
    indexHtml,
    /Xinwei Sun[\s\S]{0,300}<td>2024<\/td>[\s\S]{0,80}<td>Ph\.D\.<\/td>[\s\S]{0,300}>Active<\/span>/
  );
});

test('publications page contains the requested papers', () => {
  const expectedTitles = [
    'Networking systems for video anomaly detection: A tutorial and survey',
    'Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-wise Contrastive Learning',
    'Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM',
    'Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection',
    'Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection'
  ];

  expectedTitles.forEach(title => {
    assert.match(publicationsHtml, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  assert.doesNotMatch(
    publicationsHtml,
    /Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection[\s\S]{0,300}CCF B/
  );
  assert.match(
    publicationsHtml,
    /Networking systems for video anomaly detection: A tutorial and survey[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=28[\s\S]{0,120}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-wise Contrastive Learning[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=7.2[\s\S]{0,120}共一作者/
  );
  assert.match(
    publicationsHtml,
    /Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=8.6[\s\S]{0,120}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=7.6[\s\S]{0,120}通讯作者/
  );
  assert.doesNotMatch(
    publicationsHtml,
    /Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection[\s\S]{0,300}CCF B/
  );
});

test('publications page uses verified formal publication details', () => {
  const expectedDetails = [
    /CRCL: Causal Representation Consistency Learning for Anomaly Detection in Surveillance Videos\[J\]\. IEEE Transactions on Image Processing, 2025, 34: 2351-2366\./,
    /Privacy-Preserving Video Anomaly Detection: A Survey\[J\]\. IEEE Transactions on Neural Networks and Learning Systems, 2026, 37\(1\): 2-21\./,
    /Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM\[J\]\. IEEE Transactions on Geoscience and Remote Sensing, 2026, 64: 1-16\./,
    /MedAide: Information Fusion and Anatomy of Medical Intents via LLM-based Agent Collaboration\[J\]\. Information Fusion, 2026, 127: 103743\./,
    /STNMamba: Mamba-based Spatial-Temporal Normality Learning for Video Anomaly Detection\[J\]\. IEEE Transactions on Multimedia, 2026: 1-12\./,
    /AMP-Net: Appearance-Motion Prototype Network Assisted Automatic Video Anomaly Detection System\[J\]\. IEEE Transactions on Industrial Informatics, 2024, 20\(2\): 2843-2855\./
  ];

  expectedDetails.forEach(detail => {
    assert.match(publicationsHtml, detail);
  });

  [
    /CReC: Causal Representation Consistency Network/,
    /IEEE Transactions on Neural Networks and Learning Systems, 2025: 1-22/,
    /Towards Comprehensive Interactive Change Understanding/,
    /IEEE Transactions on Geoscience &amp; Remote Sensing, 2025/,
    /Information Fusion, 2025\./,
    /IEEE Transactions on Multimedia, 2025\./,
    /IEEE Transactions on Industrial Informatics, 2023\./
  ].forEach(outdatedDetail => {
    assert.doesNotMatch(publicationsHtml, outdatedDetail);
  });
});

test('Papers.bib uses verified formal publication details', () => {
  const expectedDetails = [
    /title=\{CRCL: Causal Representation Consistency Learning for Anomaly Detection in Surveillance Videos\}/,
    /title=\{Privacy-Preserving Video Anomaly Detection: A Survey\}[\s\S]*?volume=\{37\}[\s\S]*?number=\{1\}[\s\S]*?pages=\{2--21\}[\s\S]*?year=\{2026\}/,
    /title=\{Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM\}[\s\S]*?journal=\{IEEE Transactions on Geoscience and Remote Sensing\}[\s\S]*?volume=\{64\}[\s\S]*?pages=\{1--16\}[\s\S]*?year=\{2026\}/,
    /title=\{MedAide: Information Fusion and Anatomy of Medical Intents via LLM-based Agent Collaboration\}[\s\S]*?journal=\{Information Fusion\}[\s\S]*?volume=\{127\}[\s\S]*?pages=\{103743\}[\s\S]*?year=\{2026\}/,
    /title=\{STNMamba: Mamba-based Spatial-Temporal Normality Learning for Video Anomaly Detection\}[\s\S]*?journal=\{IEEE Transactions on Multimedia\}[\s\S]*?pages=\{1--12\}[\s\S]*?year=\{2026\}/,
    /title=\{AMP-Net: Appearance-Motion Prototype Network Assisted Automatic Video Anomaly Detection System\}[\s\S]*?journal=\{IEEE Transactions on Industrial Informatics\}[\s\S]*?volume=\{20\}[\s\S]*?number=\{2\}[\s\S]*?pages=\{2843--2855\}[\s\S]*?year=\{2024\}/
  ];

  expectedDetails.forEach(detail => {
    assert.match(papersBib, detail);
  });

  [
    /CReC: Causal Representation Consistency Network/,
    /Towards Comprehensive Interactive Change Understanding/,
    /IEEE Transactions on Geoscience \\& Remote Sensing/,
    /@article\{liu2025privacy/,
    /@article\{liu2023ampnet/
  ].forEach(outdatedDetail => {
    assert.doesNotMatch(papersBib, outdatedDetail);
  });
});

test('publication badges include English alternatives for Chinese labels', () => {
  const expectedTranslations = [
    ['中科院一区TOP', 'CAS Q1 Top'],
    ['通讯作者', 'Corresponding Author'],
    ['共一作者', 'Co-first Author'],
    ['ESI高被引', 'ESI Highly Cited'],
    ['口头展示', 'Oral Presentation']
  ];

  expectedTranslations.forEach(([zh, en]) => {
    const pattern = new RegExp(
      `<span data-lang="zh">${zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span><span data-lang="en" class="hidden">${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span>`
    );
    assert.match(publicationsHtml, pattern);
  });

  assert.doesNotMatch(
    publicationsHtml,
    /<span class="pub-tag[^"]*">(中科院一区TOP|通讯作者|共一作者|ESI高被引|口头展示)<\/span>/,
    'Chinese publication badges should not be static text'
  );
});

test('publication badges are not duplicated inside one publication', () => {
  const publicationItems = [...publicationsHtml.matchAll(/<div class="pub-item"[\s\S]*?<\/div>\s*<\/div>/g)];
  publicationItems.forEach(item => {
    const labels = [...item[0].matchAll(/<span class="pub-tag[^"]*">([\s\S]*?)<\/span>/g)]
      .map(match => match[1].replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);
    assert.equal(new Set(labels).size, labels.length, `publication should not repeat badges: ${labels.join(', ')}`);
  });
});

test('publication filters are localized in Chinese and English', () => {
  const expectedFilters = [
    ['全部', 'All'],
    ['期刊', 'Journal'],
    ['会议', 'Conference'],
    ['综述', 'Survey']
  ];

  expectedFilters.forEach(([zh, en]) => {
    assert.match(
      publicationsHtml,
      new RegExp(`<span data-lang="zh">${zh}</span><span data-lang="en" class="hidden">${en}</span>`)
    );
  });

  assert.doesNotMatch(publicationsHtml, /<button[^>]*class="filter-btn"[^>]*>Journal<\/button>/);
  assert.doesNotMatch(publicationsHtml, /<button[^>]*class="filter-btn"[^>]*>Conference<\/button>/);
  assert.doesNotMatch(publicationsHtml, /<button[^>]*class="filter-btn"[^>]*>Survey<\/button>/);
});

test('publication display text does not contain duplicated sentence periods', () => {
  const publicationTexts = [...publicationsHtml.matchAll(/<div class="pub-text">([\s\S]*?)<\/div>/g)]
    .map(match => match[1].replace(/<[^>]+>/g, ''));

  assert.ok(publicationTexts.length > 0, 'expected publications page to contain display entries');
  publicationTexts.forEach(text => {
    assert.doesNotMatch(text, /\.\./, `publication entry should not contain duplicated periods: ${text}`);
  });
});

test('all BibTeX publication titles are represented on the publications page', () => {
  const titles = [...papersBib.matchAll(/^\s*title=\{([^{}]+)\},?$/gm)].map(match => match[1]);
  assert.ok(titles.length > 0, 'expected Papers.bib to contain titles');

  titles.forEach(title => {
    assert.match(publicationsHtml, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

test('site pages include canonical, favicon, and social preview metadata', () => {
  sitePages.forEach(({ file, html, canonical }) => {
    assert.match(html, /<link rel="icon" href="favicon\.svg" type="image\/svg\+xml">/, `${file} should link the favicon`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), `${file} should set canonical URL`);
    assert.match(html, /<meta property="og:type" content="website">/, `${file} should set Open Graph type`);
    assert.match(html, /<meta property="og:title" content="[^"]+">/, `${file} should set Open Graph title`);
    assert.match(html, /<meta property="og:description" content="[^"]+">/, `${file} should set Open Graph description`);
    assert.match(html, /<meta name="twitter:card" content="summary">/, `${file} should set Twitter card metadata`);
  });
});

test('interactive controls and table headers include explicit accessibility attributes', () => {
  sitePages.forEach(({ file, html }) => {
    assert.doesNotMatch(html, /\sstyle="/, `${file} should not use inline style attributes`);

    [...html.matchAll(/<button\b[^>]*>/g)].forEach(match => {
      assert.match(match[0], /\stype="button"/, `${file} button should declare type="button": ${match[0]}`);
    });
  });

  [...indexHtml.matchAll(/<th\b[^>]*>/g)].forEach(match => {
    assert.match(match[0], /\sscope="col"/, `student table header should declare column scope: ${match[0]}`);
  });

  sitePages.forEach(({ file, html }) => {
    const menuButton = html.match(/<button\b[^>]*id="mobileMenuBtn"[^>]*>/)?.[0];
    assert.ok(menuButton, `${file} should include the mobile menu button`);
    assert.match(menuButton, /\saria-controls="navbarLinks"/, `${file} mobile menu button should reference controlled links`);
    assert.match(menuButton, /\saria-expanded="false"/, `${file} mobile menu button should expose closed state`);
  });
});

test('GitHub Pages support files and excludes are present', () => {
  const repoRoot = new URL('..', import.meta.url);
  ['_config.yml', '404.html', 'robots.txt', 'sitemap.xml', 'favicon.svg', '.github/workflows/site-checks.yml'].forEach(file => {
    assert.ok(existsSync(new URL(file, repoRoot)), `${file} should exist`);
  });

  const config = readFileSync(new URL('../_config.yml', import.meta.url), 'utf8');
  ['package.json', 'package-lock.json', 'tests/', 'Papers.bib'].forEach(entry => {
    assert.match(config, new RegExp(`- ${entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `_config.yml should exclude ${entry}`);
  });
});

test('npm scripts and dependencies support deterministic site checks', () => {
  assert.equal(packageJson.scripts.dev, packageJson.scripts.serve);
  assert.equal(packageJson.scripts.validate, 'html-validate index.html publications.html activities.html 404.html');
  assert.ok(packageJson.devDependencies['html-validate'], 'html-validate should be pinned as a dev dependency');
  assert.equal(packageJson.devDependencies['live-server'], undefined, 'live-server should not be needed for this static site');
});

test('GitHub Actions runs the same checks as local development', () => {
  const workflow = readFileSync(new URL('../.github/workflows/site-checks.yml', import.meta.url), 'utf8');
  ['npm ci', 'npm test', 'npm run validate', 'npm audit --audit-level=moderate'].forEach(command => {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `workflow should run ${command}`);
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const publicationsHtml = readFileSync(new URL('../publications.html', import.meta.url), 'utf8');
const activitiesHtml = readFileSync(new URL('../activities.html', import.meta.url), 'utf8');
const papersBib = readFileSync(new URL('../Papers.bib', import.meta.url), 'utf8');
const styleCss = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const mainJs = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const sitePages = [
  { file: 'index.html', html: indexHtml, canonical: 'https://tongji-epic.github.io/' },
  { file: 'publications.html', html: publicationsHtml, canonical: 'https://tongji-epic.github.io/publications.html' },
  { file: 'activities.html', html: activitiesHtml, canonical: 'https://tongji-epic.github.io/activities.html' }
];

test('homepage Chinese copy is localized for key visible text', () => {
  assert.match(indexHtml, /<p class="hero-subtitle">Embodied Perception &amp; Intelligence Computing<\/p>/);
  assert.match(indexHtml, /<p class="hero-subtitle zh-only" data-lang="zh">具身感知与智能计算实验室<\/p>/);
  assert.match(indexHtml, /面向智慧工业与自主系统，推动具身多媒体智能发展/);
  assert.match(indexHtml, /个人主页/);
  assert.match(indexHtml, /谷歌学术/);
  assert.match(indexHtml, /孙鹏 助理教授/);
  assert.match(indexHtml, /Prof\. Peng Sun/);
});

test('homepage collaborator links with personal homepages show a web icon', () => {
  assert.match(
    indexHtml,
    /<a href="https:\/\/faculty\.dukekunshan\.edu\.cn\/faculty_profiles\/peng-sun" target="_blank" rel="noopener">孙鹏 助理教授 🌐<\/a>/
  );
  assert.match(
    indexHtml,
    /<a href="https:\/\/weizhou-geek\.github\.io\/" target="_blank" rel="noopener">周玮 助理教授 🌐<\/a>/
  );
  assert.match(
    indexHtml,
    /<a href="https:\/\/faculty\.dukekunshan\.edu\.cn\/faculty_profiles\/peng-sun" target="_blank" rel="noopener">Prof\. Peng Sun 🌐<\/a>/
  );
  assert.match(
    indexHtml,
    /<a href="https:\/\/weizhou-geek\.github\.io\/" target="_blank" rel="noopener">Prof\. Wei Zhou 🌐<\/a>/
  );
});

test('homepage students are ordered by degree priority, then year, school priority, and surname in both languages', () => {
  assert.match(
    indexHtml,
    /郭俊岑[\s\S]*武靖一[\s\S]*杨浩[\s\S]*刘普俊[\s\S]*孙鑫伟[\s\S]*左为[\s\S]*黄涵[\s\S]*卞佳乐[\s\S]*冯文欣[\s\S]*文杰[\s\S]*涂妍静[\s\S]*寇筱然[\s\S]*余政希[\s\S]*周晋煊/
  );
  assert.match(
    indexHtml,
    /Juncen Guo[\s\S]*Jingyi Wu[\s\S]*Hao Yang[\s\S]*Pujun Liu[\s\S]*Xinwei Sun[\s\S]*Wei Zuo[\s\S]*Han Huang[\s\S]*Jiale Bian[\s\S]*Wenxin Feng[\s\S]*Jie Wen[\s\S]*Yanjing Tu[\s\S]*Xiaoran Kou[\s\S]*Zhengxi Yu[\s\S]*Jinxuan Zhou/
  );
  assert.match(
    indexHtml,
    /冯文欣[\s\S]{0,300}<td[^>]*>2026<\/td>[\s\S]{0,200}<span data-lang="zh">硕士<\/span>[\s\S]{0,500}<span data-lang="zh">同济大学<\/span>[\s\S]{0,300}>即将入学<\/span>/
  );
  assert.match(
    indexHtml,
    /左为[\s\S]{0,300}<td[^>]*>2025<\/td>[\s\S]{0,200}<span data-lang="zh">博士<\/span>[\s\S]{0,500}<span data-lang="zh">复旦大学<\/span>[\s\S]{0,300}>在读<\/span>/
  );
  assert.match(
    indexHtml,
    /Wenxin Feng[\s\S]{0,300}<td[^>]*>2026<\/td>[\s\S]{0,200}<span data-lang="en" class="hidden">M\.S\.<\/span>[\s\S]{0,500}<span data-lang="en" class="hidden">Tongji University<\/span>[\s\S]{0,300}>Upcoming<\/span>/
  );
  assert.match(
    indexHtml,
    /Yanjing Tu[\s\S]{0,300}<td[^>]*>2023<\/td>[\s\S]{0,200}<span data-lang="en" class="hidden">Undergraduate<\/span>[\s\S]{0,500}<span data-lang="en" class="hidden">Duke Kunshan University<\/span>[\s\S]{0,300}>Active<\/span>/
  );
});

test('homepage students table includes a school column in both languages', () => {
  assert.match(indexHtml, /<th scope="col">学校<\/th>/);
  assert.match(indexHtml, /<th scope="col">School<\/th>/);
  assert.match(
    indexHtml,
    /孙鑫伟[\s\S]{0,500}<td data-label-zh="学校" data-label-en="School">[\s\S]*?<span data-lang="zh">同济大学<\/span>[\s\S]*?<span data-lang="en" class="hidden">Tongji University<\/span>/
  );
  assert.match(
    indexHtml,
    /武靖一[\s\S]{0,500}<td data-label-zh="学校" data-label-en="School">[\s\S]*?<span data-lang="zh">复旦大学<\/span>[\s\S]*?<span data-lang="en" class="hidden">Fudan University<\/span>/
  );
});

test('homepage student names can optionally link to personal homepages', () => {
  assert.match(
    indexHtml,
    /<a class="student-name-link" href="https:\/\/jiale-bian\.github\.io\/" target="_blank" rel="noopener">[\s\S]*?<span data-lang="zh">卞佳乐<\/span>[\s\S]*?<span data-lang="en" class="hidden">Jiale Bian<\/span>[\s\S]*?<\/a>/
  );
  assert.match(
    styleCss,
    /\.student-name-link\s*\{[\s\S]*?color:\s*var\(--primary-blue\);/,
    'linked student names should use the standard link blue color'
  );
  assert.match(
    styleCss,
    /\.student-name-link::after\s*\{[\s\S]*?content:\s*"🌐";/,
    'linked student names should automatically show the web icon after the name'
  );
});

test('activities special session cards can link to external detail pages', () => {
  assert.match(
    activitiesHtml,
    /<a class="activity-item activity-item-link" href="https:\/\/2026\.ieeeicme\.org\/special-sessions\/#1764943625433-84e65b83-77a3" target="_blank" rel="noopener">[\s\S]*?<div class="activity-title">IEEE ICME 2026<\/div>[\s\S]*?Embodied Perception for Interactive Multimedia Systems[\s\S]*?<\/a>/
  );
  assert.match(
    activitiesHtml,
    /<a class="activity-item activity-item-link" href="https:\/\/2026\.ieeeicassp\.org\/special-sessions\/" target="_blank" rel="noopener">[\s\S]*?<div class="activity-title">IEEE ICASSP 2026<\/div>[\s\S]*?Anomaly Signal Identification with Foundation Models[\s\S]*?<\/a>/
  );
  assert.match(
    activitiesHtml,
    /<a class="activity-item activity-item-link" href="https:\/\/attend\.ieee\.org\/mmsp-2026\/special-sessions\/" target="_blank" rel="noopener">[\s\S]*?<div class="activity-title">IEEE MMSP 2026<\/div>[\s\S]*?Embodied Multimedia Signal Processing for Interactive Physical Intelligence[\s\S]*?<\/a>/
  );
  assert.match(
    styleCss,
    /\.activity-item-link(?:,|\s*\{)[\s\S]*?text-decoration:\s*none;/,
    'linked activity cards should suppress default anchor underlines'
  );
});

test('activities workshop cards keep the first two entries and make them clickable', () => {
  assert.match(
    activitiesHtml,
    /<a class="activity-item activity-item-link" href="https:\/\/embodied-multimedia\.github\.io\/" target="_blank" rel="noopener">[\s\S]*?<div class="activity-title">IEEE ICME 2026<\/div>[\s\S]*?Workshop：?"?具身多媒体"?研讨会[\s\S]*?<\/a>/
  );
  assert.match(
    activitiesHtml,
    /<a class="activity-item activity-item-link" href="http:\/\/2025\.prcv\.cn\/Tutorial4\/index\.asp" target="_blank" rel="noopener">[\s\S]*?<div class="activity-title">PRCV 2025<\/div>[\s\S]*?讲习论坛[\s\S]*?<\/a>/
  );
  [
    /OEL-IIoT @ WF-IoT'24/,
    /OEL-DSP @ DSP'25/,
    /OEL-IP @ ICIP'25/,
    /S-IoT @ WF-IoT'25/
  ].forEach(removedWorkshop => {
    assert.doesNotMatch(activitiesHtml, removedWorkshop);
  });
});

test('activities special issues show key submission information', () => {
  assert.match(
    activitiesHtml,
    /Paper Submission Deadline[\s\S]*?June 30, 2026[\s\S]*?First Decision Deadline[\s\S]*?September 30, 2026[\s\S]*?Revision Deadline[\s\S]*?November 1, 2026[\s\S]*?Final Decision Deadline[\s\S]*?November 30, 2026/
  );
  assert.match(
    activitiesHtml,
    /Open for submissions[\s\S]*?Submission deadline[\s\S]*?Ongoing[\s\S]*?Journal Impact Factor[\s\S]*?3\.0 \(2024\)[\s\S]*?Submission to first decision \(median\)[\s\S]*?2 days/
  );
});

test('publications page contains the requested papers', () => {
  const expectedTitles = [
    'Networking Systems for Video Anomaly Detection: A Tutorial and Survey',
    'Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-Wise Contrastive Learning',
    'Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM',
    'Distributional and Spatial-Temporal Robust Representation Learning for Transportation Activity Recognition',
    'Cross-Modal Attention Fusion of RGB and Skeleton for Multimodal-Driven Video Anomaly Detection'
  ];

  expectedTitles.forEach(title => {
    assert.match(publicationsHtml, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  assert.doesNotMatch(
    publicationsHtml,
    /Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection/
  );
  assert.match(
    publicationsHtml,
    /Distributional and Spatial-Temporal Robust Representation Learning for Transportation Activity Recognition[\s\S]{0,300}Pattern Recognition, 2023, 140: 109568\./
  );
  assert.match(
    publicationsHtml,
    /Distributional and Spatial-Temporal Robust Representation Learning for Transportation Activity Recognition[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=7.6/
  );
  assert.match(
    publicationsHtml,
    /Networking Systems for Video Anomaly Detection: A Tutorial and Survey[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=28[\s\S]{0,120}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-Wise Contrastive Learning[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=7.2[\s\S]{0,120}共一作者/
  );
  assert.match(
    publicationsHtml,
    /Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=8.6[\s\S]{0,120}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Cross-Modal Attention Fusion of RGB and Skeleton for Multimodal-Driven Video Anomaly Detection[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=7.6[\s\S]{0,120}通讯作者/
  );
  assert.doesNotMatch(
    publicationsHtml,
    /Cross-Modal Attention Fusion of RGB and Skeleton for Multimodal-Driven Video Anomaly Detection[\s\S]{0,300}CCF B/
  );
});

test('publications page uses verified formal publication details', () => {
  const expectedDetails = [
    /CRCL: Causal Representation Consistency Learning for Anomaly Detection in Surveillance Videos\[J\]\. IEEE Transactions on Image Processing, 2025, 34: 2351-2366\./,
    /Privacy-Preserving Video Anomaly Detection: A Survey\[J\]\. IEEE Transactions on Neural Networks and Learning Systems, 2026, 37\(1\): 2-21\./,
    /Distributional and Spatial-Temporal Robust Representation Learning for Transportation Activity Recognition\[J\]\. Pattern Recognition, 2023, 140: 109568\./,
    /Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM\[J\]\. IEEE Transactions on Geoscience and Remote Sensing, 2026, 64: 1-16\./,
    /MedAide: Information Fusion and Anatomy of Medical Intents via LLM-Based Agent Collaboration\[J\]\. Information Fusion, 2026, 127: 103743\./,
    /STNMamba: Mamba-Based Spatial-Temporal Normality Learning for Video Anomaly Detection\[J\]\. IEEE Transactions on Multimedia, 2026: 1-12\./,
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
    /IEEE Transactions on Industrial Informatics, 2023\./,
    /Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection/,
    /Edge-cloud collaborative computing on distributed intelligence and model optimization: A survey/,
    /Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection/,
    /Networking systems for video anomaly detection: A tutorial and survey/,
    /Pixel-wise Contrastive Learning/,
    /Memory-enhanced Spatial-Temporal Encoding Framework/,
    /Distributional and spatial-temporal robust representation learning for transportation activity recognition/,
    /Causality-inspired Representation Consistency/,
    /LLM-based Agent Collaboration/,
    /Mamba-based Spatial-Temporal/
  ].forEach(outdatedDetail => {
    assert.doesNotMatch(publicationsHtml, outdatedDetail);
  });
});

test('Papers.bib uses verified formal publication details', () => {
  const expectedDetails = [
    /title=\{CRCL: Causal Representation Consistency Learning for Anomaly Detection in Surveillance Videos\}/,
    /title=\{Privacy-Preserving Video Anomaly Detection: A Survey\}[\s\S]*?volume=\{37\}[\s\S]*?number=\{1\}[\s\S]*?pages=\{2--21\}[\s\S]*?year=\{2026\}/,
    /title=\{Distributional and Spatial-Temporal Robust Representation Learning for Transportation Activity Recognition\}[\s\S]*?author=\{Liu, Jing and Liu, Yang and Zhu, Wei and Zhu, Xiaoguang and Song, Liang\}[\s\S]*?journal=\{Pattern Recognition\}[\s\S]*?volume=\{140\}[\s\S]*?pages=\{109568\}[\s\S]*?year=\{2023\}/,
    /title=\{Toward Comprehensive Interactive Change Understanding in Remote Sensing: A Large-Scale Dataset and Dual-Granularity Enhanced VLM\}[\s\S]*?journal=\{IEEE Transactions on Geoscience and Remote Sensing\}[\s\S]*?volume=\{64\}[\s\S]*?pages=\{1--16\}[\s\S]*?year=\{2026\}/,
    /title=\{MedAide: Information Fusion and Anatomy of Medical Intents via LLM-Based Agent Collaboration\}[\s\S]*?journal=\{Information Fusion\}[\s\S]*?volume=\{127\}[\s\S]*?pages=\{103743\}[\s\S]*?year=\{2026\}/,
    /title=\{STNMamba: Mamba-Based Spatial-Temporal Normality Learning for Video Anomaly Detection\}[\s\S]*?journal=\{IEEE Transactions on Multimedia\}[\s\S]*?pages=\{1--12\}[\s\S]*?year=\{2026\}/,
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
    /@article\{liu2023ampnet/,
    /Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection/,
    /Edge-cloud collaborative computing on distributed intelligence and model optimization: A survey/,
    /Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection/,
    /Networking systems for video anomaly detection: A tutorial and survey/,
    /Pixel-wise Contrastive Learning/,
    /Memory-enhanced Spatial-Temporal Encoding Framework/,
    /Distributional and spatial-temporal robust representation learning for transportation activity recognition/,
    /Causality-inspired Representation Consistency/,
    /LLM-based Agent Collaboration/,
    /Mamba-based Spatial-Temporal/
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

test('mobile navigation has a no-JS fallback and JS enhancement hook', () => {
  sitePages.forEach(({ file, html }) => {
    assert.match(html, /<html lang="zh" class="no-js">/, `${file} should default to no-js mode before scripts run`);
  });

  assert.match(mainJs, /classList\.remove\('no-js'\)/, 'main.js should remove the no-js marker');
  assert.match(mainJs, /classList\.add\('js'\)/, 'main.js should add the js marker');
  assert.match(mainJs, /function getStoredLanguage\(\) \{[\s\S]*?try \{[\s\S]*?localStorage\.getItem\('epic-lang'\)[\s\S]*?catch/, 'language preference reads should not break navigation initialization');
  assert.match(mainJs, /function storeLanguage\(lang\) \{[\s\S]*?try \{[\s\S]*?localStorage\.setItem\('epic-lang', lang\)[\s\S]*?catch/, 'language preference writes should not break navigation initialization');
  assert.match(styleCss, /\.js\s+\.navbar-links\s*\{[\s\S]*?display: none;/, 'mobile nav should collapse only after JS enhancement');
  assert.match(styleCss, /\.no-js\s+\.mobile-menu-btn\s*\{[\s\S]*?display: none;/, 'no-JS mode should not show an inert mobile menu button');
  assert.match(styleCss, /\.no-js\s+\.main-content\s*\{[\s\S]*?padding-top: calc\(var\(--nav-height\) \+ 44px\);/, 'no-JS fixed navigation should not cover top-level content');
  assert.match(styleCss, /\.no-js\s+\.hero\s*\{[\s\S]*?padding-top: 128px;/, 'no-JS fixed navigation should not cover the homepage hero');
});

test('mobile layout supports long text and student card labels', () => {
  assert.match(styleCss, /\.pub-text,[\s\S]*?overflow-wrap: anywhere;/, 'publication text should wrap long tokens on mobile');
  assert.match(styleCss, /\.students-table td::before\s*\{[\s\S]*?content: attr\(data-label-zh\);/, 'student cards should show Chinese field labels');
  assert.match(styleCss, /\[lang="en"\]\s+\.students-table td::before\s*\{[\s\S]*?content: attr\(data-label-en\);/, 'student cards should show English field labels');

  const studentCells = [...indexHtml.matchAll(/<tbody>[\s\S]*?<\/tbody>/g)]
    .flatMap(match => [...match[0].matchAll(/<td\b[^>]*>/g)].map(cell => cell[0]));
  assert.ok(studentCells.length > 0, 'expected student table cells');
  studentCells.forEach(cell => {
    assert.match(cell, /\sdata-label-zh="/, `student cell should include a Chinese mobile label: ${cell}`);
    assert.match(cell, /\sdata-label-en="/, `student cell should include an English mobile label: ${cell}`);
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

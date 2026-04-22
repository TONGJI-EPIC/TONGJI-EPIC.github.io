import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const publicationsHtml = readFileSync(new URL('../publications.html', import.meta.url), 'utf8');

test('homepage Chinese copy is localized for key visible text', () => {
  assert.match(indexHtml, /<p class="hero-subtitle">Embodied Perception &amp; Intelligence Center<\/p>/);
  assert.match(indexHtml, /<p class="hero-subtitle zh-only" data-lang="zh">具身感知与智能实验室<\/p>/);
  assert.match(indexHtml, /面向智慧工业与自主系统，推动具身多媒体智能发展。/);
  assert.match(indexHtml, /实验室主页/);
  assert.match(indexHtml, /谷歌学术/);
});

test('publications page contains the requested papers', () => {
  const expectedTitles = [
    'Networking systems for video anomaly detection: A tutorial and survey',
    'Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-wise Contrastive Learning',
    'Towards Comprehensive Interactive Change Understanding in Remote Sensing: A Large-scale Dataset and Dual-granularity Enhanced VLM',
    'Motion Semantics Guided Normalizing Flow for Privacy-Preserving Video Anomaly Detection',
    'Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection'
  ];

  expectedTitles.forEach(title => {
    assert.match(publicationsHtml, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  assert.match(
    publicationsHtml,
    /Networking systems for video anomaly detection: A tutorial and survey[\s\S]{0,300}中科院一区TOP[\s\S]{0,120}IF=28[\s\S]{0,120}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Improving Robotic Grasp Detection Under Sparse Annotations via Grasp Transformer with Pixel-wise Contrastive Learning[\s\S]{0,300}共一作者/
  );
  assert.match(
    publicationsHtml,
    /Towards Comprehensive Interactive Change Understanding in Remote Sensing: A Large-scale Dataset and Dual-granularity Enhanced VLM[\s\S]{0,300}通讯作者/
  );
  assert.match(
    publicationsHtml,
    /Cross-modal attention fusion of RGB and skeleton for multimodal-driven video anomaly detection[\s\S]{0,300}通讯作者/
  );
});

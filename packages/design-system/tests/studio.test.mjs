import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('Creative Studio — specification', () => {
  it('generates project.json spec from brief', async () => {
    const { generateSpecification, serializeSpecification, parseSpecification } = await import('../src/studio/index.ts');
    const spec = generateSpecification({
      name: 'Bloom Room',
      brief: 'Audio reactive installation with MIDI',
    });
    assert.ok(spec.engines.includes('engine.sound'));
    assert.ok(spec.engines.includes('engine.visual'));
    const round = parseSpecification(serializeSpecification(spec));
    assert.equal(round.id, spec.id);
  });
});

describe('Creative Studio — pipeline', () => {
  it('runs pipeline through generation', async () => {
    const { generateSpecification, runPipeline, PIPELINE_STAGES } = await import('../src/studio/index.ts');
    const spec = generateSpecification({ name: 'Test', category: 'generative-art' });
    const result = runPipeline(spec, 'generation');
    assert.ok(result.completedStages.includes('generation'));
    assert.ok(result.artifacts.some((a) => a.path === 'project.json'));
    assert.equal(PIPELINE_STAGES.length, 10);
  });
});

describe('Creative Studio — orchestrator', () => {
  it('orchestrates project from concept', async () => {
    const { createProjectFromConcept } = await import('../src/studio/index.ts');
    const result = createProjectFromConcept({
      name: 'Flower Study',
      brief: 'Generative art study',
    });
    assert.ok(result.files.some((f) => f.path === 'project.json'));
    assert.ok(result.files.some((f) => f.path === 'platform.json'));
    assert.equal(result.spec.id, 'flower-study');
  });
});

describe('Creative Studio — asset intelligence', () => {
  it('classifies and tags assets', async () => {
    const { classifyAsset, analyzeAsset } = await import('../src/studio/index.ts');
    assert.equal(classifyAsset('assets://textures/noise.png'), 'image');
    const a = analyzeAsset('assets://audio/ambient-loop.wav');
    assert.equal(a.kind, 'audio');
    assert.ok(a.tags.includes('ambient'));
  });
});

describe('Creative Studio — knowledge', () => {
  it('records decisions and searches', async () => {
    const { recordDecision, knowledgeRepository } = await import('../src/studio/index.ts');
    recordDecision({ id: 'test.decision', title: 'Test', body: 'Demo decision', projectId: 'demo' });
    assert.ok(knowledgeRepository.search('Demo').length >= 1);
  });
});

describe('Creative Studio — workspace', () => {
  it('loads multi-project workspace', async () => {
    const { loadWorkspace, generateSpecification, validateWorkspace } = await import('../src/studio/index.ts');
    const ws = loadWorkspace('main', 'Main Studio', [
      generateSpecification({ name: 'A', category: 'generative-art' }),
      generateSpecification({ name: 'B', category: 'music-instrument', brief: 'music instrument' }),
    ]);
    assert.equal(ws.projects.length, 2);
    const report = validateWorkspace(ws);
    assert.equal(report.workspace, 'main');
  });
});

describe('Creative Studio — automation', () => {
  it('runs create-prototype automation', async () => {
    const { runAutomation, getAutomations } = await import('../src/studio/index.ts');
    assert.ok(getAutomations().length >= 8);
    const result = runAutomation('automation.create-prototype', {
      name: 'Pad Lab',
      brief: 'Music instrument prototype',
    });
    assert.equal(result.ok, true);
  });
});

describe('Creative Studio — refactoring', () => {
  it('plans dependency upgrade', async () => {
    const { generateSpecification, planDependencyUpgrade } = await import('../src/studio/index.ts');
    const spec = generateSpecification({ name: 'X' });
    const plan = planDependencyUpgrade(spec, 'plantasonic-design-system', '1.5.0');
    assert.equal(plan.kind, 'dependency-upgrade');
    assert.ok(plan.steps.length >= 2);
  });
});

describe('Creative Studio — portfolio', () => {
  it('generates portfolio report', async () => {
    const { generatePortfolioReport, loadWorkspace, generateSpecification } = await import('../src/studio/index.ts');
    const ws = loadWorkspace('portfolio', 'Portfolio', [generateSpecification({ name: 'One' })]);
    const report = generatePortfolioReport(ws);
    assert.equal(report.activeProjects, 1);
  });
});

describe('Creative Studio — package export', () => {
  it('exports ./studio', async () => {
    const { readFileSync } = await import('node:fs');
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url).pathname, 'utf8'));
    assert.ok(pkg.exports['./studio']);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('creative input layer — normalized subscriptions', () => {
  it('delivers emitted events to subscribers and supports unsubscribe', async () => {
    const { createInputManager } = await import('../src/instrument/input.ts');
    const input = createInputManager();
    const received = [];
    const off = input.on('pointer', (e) => received.push(e));
    input.emit('pointer', { type: 'pointer', phase: 'down', x: 1, y: 2 });
    assert.equal(received.length, 1);
    assert.equal(received[0].x, 1);
    off();
    input.emit('pointer', { type: 'pointer', phase: 'move', x: 9, y: 9 });
    assert.equal(received.length, 1);
  });

  it('attach is a safe no-op for invalid targets', async () => {
    const { createInputManager } = await import('../src/instrument/input.ts');
    const input = createInputManager();
    assert.doesNotThrow(() => input.attach(null));
    assert.doesNotThrow(() => input.attach({}));
  });

  it('registers device adapters on the same API (MIDI/gamepad/pen)', async () => {
    const { createInputManager } = await import('../src/instrument/input.ts');
    const input = createInputManager();
    const keys = [];
    input.on('key', (e) => keys.push(e.key));

    let captured = null;
    let detached = false;
    const detach = input.registerAdapter({
      name: 'fake-midi',
      attach(emit) {
        captured = emit;
        return () => {
          detached = true;
        };
      },
    });

    assert.equal(typeof captured, 'function');
    captured('key', { type: 'key', phase: 'down', key: 'C4' });
    assert.deepEqual(keys, ['C4']);

    detach();
    assert.equal(detached, true);
  });

  it('destroy clears handlers and adapters', async () => {
    const { createInputManager } = await import('../src/instrument/input.ts');
    const input = createInputManager();
    const seen = [];
    input.on('wheel', (e) => seen.push(e));
    input.destroy();
    input.emit('wheel', { type: 'wheel', dx: 0, dy: 1, x: 0, y: 0 });
    assert.equal(seen.length, 0);
  });
});

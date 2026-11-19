/**
 * 点播指令的播放计划：一次播完还是循环，循环多久收脚。
 *
 * 契约：`loop` 之后的点播一律不进菜单语义（不走 tryMove、不按用户点击判睡觉），
 * `loopMs` 缺省表示一直循环。非循环指令与引入循环之前完全一致。
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { animCuePlan } from './cue-effects.ts';

describe('animCuePlan —— 循环点播的播放计划', () => {
  test('普通点播：播一次，不收脚', () => {
    assert.deepEqual(animCuePlan({ name: '东张西望' }), { once: true, stopAfterMs: null });
  });

  test('url 形态只插播一段，即使带了 loop 也不循环', () => {
    assert.deepEqual(animCuePlan({ url: 'https://x/y.webm', loop: true, loopMs: 900 }), {
      once: true,
      stopAfterMs: null,
    });
  });

  test('loop 且没给 loopMs：一直循环', () => {
    assert.deepEqual(animCuePlan({ name: '东张西望', loop: true }), { once: false, stopAfterMs: null });
  });

  test('loop + loopMs：到点收脚', () => {
    assert.deepEqual(animCuePlan({ name: '东张西望', loop: true, loopMs: 1200 }), {
      once: false,
      stopAfterMs: 1200,
    });
  });

  test('loopMs=0 是一个合法的「立刻收脚」，不是缺省', () => {
    assert.deepEqual(animCuePlan({ name: '东张西望', loop: true, loopMs: 0 }), { once: false, stopAfterMs: 0 });
  });

  test('没有指令（还没收到叶子）按普通点播处理', () => {
    assert.deepEqual(animCuePlan(undefined), { once: true, stopAfterMs: null });
  });
});

import { describe, it, expect } from 'vitest';
import {
  FLOORING_SYSTEMS,
  FLOORING_SYSTEM_LIST,
  DEFAULT_FLOORING_SYSTEM_ID,
  getFlooringSystem,
  type FlooringSystemId,
} from '../flooring-systems';

const ALL_IDS: FlooringSystemId[] = [
  'sport-outdoor',
  'sport-indoor',
  'locuri-joaca',
  'pardoseli-piatra',
  'gazon-sintetic',
];

describe('flooring systems', () => {
  it('FLOORING_SYSTEM_LIST covers all 5 ids', () => {
    expect(FLOORING_SYSTEM_LIST).toHaveLength(5);
    const ids = FLOORING_SYSTEM_LIST.map((s) => s.id);
    for (const id of ALL_IDS) {
      expect(ids).toContain(id);
    }
  });

  it('every system has a non-empty layers array', () => {
    for (const sys of FLOORING_SYSTEM_LIST) {
      expect(sys.layers.length).toBeGreaterThan(0);
    }
  });

  it('getFlooringSystem resolves every FlooringSystemId in the union', () => {
    for (const id of ALL_IDS) {
      expect(() => getFlooringSystem(id)).not.toThrow();
      expect(getFlooringSystem(id)).toBeDefined();
    }
  });

  it('getFlooringSystem(id).id === id for all 5 systems', () => {
    for (const id of ALL_IDS) {
      expect(getFlooringSystem(id).id).toBe(id);
    }
  });

  it('all layer thicknessMm values are positive', () => {
    for (const sys of FLOORING_SYSTEM_LIST) {
      for (const layer of sys.layers) {
        expect(layer.thicknessMm).toBeGreaterThan(0);
      }
    }
  });

  it('layer labels are unique within each system', () => {
    for (const sys of FLOORING_SYSTEM_LIST) {
      const labels = sys.layers.map((l) => l.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it('DEFAULT_FLOORING_SYSTEM_ID is a valid id resolvable via getFlooringSystem', () => {
    expect(ALL_IDS).toContain(DEFAULT_FLOORING_SYSTEM_ID);
    expect(getFlooringSystem(DEFAULT_FLOORING_SYSTEM_ID).id).toBe(DEFAULT_FLOORING_SYSTEM_ID);
  });

  it('FLOORING_SYSTEMS record matches FLOORING_SYSTEM_LIST entries', () => {
    for (const id of ALL_IDS) {
      expect(FLOORING_SYSTEMS[id]).toBe(getFlooringSystem(id));
    }
  });

  it('every layer has a non-empty label and texture string', () => {
    for (const sys of FLOORING_SYSTEM_LIST) {
      for (const layer of sys.layers) {
        expect(typeof layer.label).toBe('string');
        expect(layer.label.trim().length).toBeGreaterThan(0);
        expect(typeof layer.texture).toBe('string');
        expect(layer.texture.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('every system has a non-empty title', () => {
    for (const sys of FLOORING_SYSTEM_LIST) {
      expect(typeof sys.title).toBe('string');
      expect(sys.title.trim().length).toBeGreaterThan(0);
    }
  });
});

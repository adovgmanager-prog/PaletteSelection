/* Run from anywhere: node standalone-palette-demo/test.cjs */
'use strict';
const assert = require('node:assert/strict');
const p = require('./palette-state.js');
const state = p.createState();
assert.equal(state.colors.length, 2);
assert.equal(state.activeColor, 'blue');
assert.equal(p.readySets(state).length, 0);
p.toggleGroup(state, 'example-1');
assert.equal(p.findAssignment(state, 'example-1').id, 'blue');
assert.equal(p.readySets(state).length, 0);
p.toggleGroup(state, 'example-1');
assert.equal(p.findAssignment(state, 'example-1'), undefined);
p.toggleGroup(state, 'example-1');
p.selectColor(state, 'purple');
p.toggleGroup(state, 'example-1');
assert.deepEqual(state.assignments.blue, []);
assert.deepEqual(state.assignments.purple, ['example-1']);
p.toggleGroup(state, 'example-2');
assert.equal(p.readySets(state).length, 1);
const copiedSet = p.readySets(state)[0];
copiedSet.groupIds.push('not-in-state');
assert.equal(state.assignments.purple.length, 2);
assert.equal(p.selectColor(state, 'unknown'), false);
assert.equal(p.removeColor(state, 'blue'), false);
assert.equal(p.removeColor(state, 'unknown'), false);
while (p.addColor(state)) {}
assert.equal(state.colors.length, 5);
assert.equal(p.addColor(state), false);
p.toggleGroup(state, 'example-3');
assert.equal(p.removeColor(state, 'pink'), false);
p.clearSelections(state);
assert.equal(p.readySets(state).length, 0);
assert.equal(state.colors.length, 5);
assert.equal(p.removeColor(state, 'pink'), true);
assert.equal(state.activeColor, 'blue');
assert.equal(p.addColor(state), true);
assert.equal(state.colors.length, 5);
for (const color of state.colors) {
  p.selectColor(state, color.id);
  p.toggleGroup(state, 'unique-group');
  const memberships = Object.values(state.assignments).flat().filter((id) => id === 'unique-group');
  assert.equal(memberships.length, 1);
}
const independent = p.createState();
independent.colors[0].label = 'Independent copy';
assert.equal(p.createState().colors[0].label, 'Blue');
console.log('Palette state tests passed: defaults, selection, deselection, moving, unique membership, limits, removal, clearing and independent state.');

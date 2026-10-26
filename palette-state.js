/* Independent example, with no imports from the extension project.
 * Browser: window.PaletteSelection. Node tests: require('./palette-state.js').
 */
(function (root) {
  'use strict';
  const LIMIT = 5;
  const COLORS = [
    { id: 'blue', label: 'Blue', hex: '#2563eb' },
    { id: 'purple', label: 'Purple', hex: '#7c3aed' },
    { id: 'teal', label: 'Teal', hex: '#0f766e' },
    { id: 'orange', label: 'Orange', hex: '#c2410c' },
    { id: 'pink', label: 'Pink', hex: '#be185d' }
  ];

  function createState() {
    return { activeColor: COLORS[0].id, colors: COLORS.slice(0, 2).map((color) => ({ ...color })), assignments: { blue: [], purple: [] } };
  }

  function selectColor(state, colorId) {
    if (!state.colors.some((color) => color.id === colorId)) return false;
    state.activeColor = colorId;
    return true;
  }

  function findAssignment(state, groupId) {
    return state.colors.find((color) => state.assignments[color.id].includes(groupId));
  }

  function toggleGroup(state, groupId) {
    if (typeof groupId !== 'string' || !groupId) return false;
    const previous = findAssignment(state, groupId);
    // Remove from every set first: each group belongs to at most one color.
    for (const color of state.colors) {
      state.assignments[color.id] = state.assignments[color.id].filter((id) => id !== groupId);
    }
    // Same color = deselect; another color or no previous color = assign.
    if (!previous || previous.id !== state.activeColor) state.assignments[state.activeColor].push(groupId);
    return true;
  }

  function addColor(state) {
    if (state.colors.length >= LIMIT) return false;
    const next = COLORS.find((color) => !state.colors.some((used) => used.id === color.id));
    state.colors.push({ ...next });
    state.assignments[next.id] = [];
    state.activeColor = next.id;
    return true;
  }

  function removeColor(state, colorId) {
    const index = state.colors.findIndex((color) => color.id === colorId);
    // The first two colors remain. Extra colors can be removed only when empty.
    if (index < 2 || state.assignments[colorId].length > 0) return false;
    state.colors.splice(index, 1);
    delete state.assignments[colorId];
    if (state.activeColor === colorId) state.activeColor = state.colors[0].id;
    return true;
  }

  function clearSelections(state) {
    for (const color of state.colors) state.assignments[color.id] = [];
  }

  function readySets(state) {
    return state.colors.filter((color) => state.assignments[color.id].length >= 2)
      .map((color) => ({ color: { ...color }, groupIds: [...state.assignments[color.id]] }));
  }

  const api = Object.freeze({ LIMIT, createState, selectColor, findAssignment, toggleGroup, addColor, removeColor, clearSelections, readySets });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PaletteSelection = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

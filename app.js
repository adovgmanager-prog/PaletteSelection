/* DOM rendering and event handlers only. Business rules live in palette-state.js. */
(function () {
  'use strict';
  const palette = window.PaletteSelection;
  const groups = window.paletteDemoGroups;
  let state = palette.createState();
  const byId = (id) => document.getElementById(id);
  const paletteHost = byId('palette');
  const groupHost = byId('groups');
  const resultsHost = byId('results');
  const runButton = byId('run');

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function update(action) {
    action();
    resultsHost.replaceChildren();
    resultsHost.hidden = true;
    render();
  }

  function render() {
    paletteHost.replaceChildren();
    state.colors.forEach((color, index) => {
      const count = state.assignments[color.id].length;
      const control = make('div', 'color-control');
      const button = make('button', 'swatch');
      button.type = 'button';
      button.style.setProperty('--set-color', color.hex);
      button.setAttribute('aria-pressed', String(state.activeColor === color.id));
      button.setAttribute('aria-label', `${color.label} set, ${count} groups`);
      button.append(make('span', 'swatch-dot'), make('span', '', color.label), make('span', 'count', String(count)));
      button.addEventListener('click', () => update(() => palette.selectColor(state, color.id)));
      control.append(button);
      if (index >= 2) {
        const remove = make('button', 'remove-color', '×');
        remove.type = 'button'; remove.disabled = count > 0;
        remove.setAttribute('aria-label', `Remove empty ${color.label} set`);
        remove.title = count ? 'Remove the groups from this set first' : 'Remove this empty set';
        remove.addEventListener('click', () => update(() => palette.removeColor(state, color.id)));
        control.append(remove);
      }
      paletteHost.append(control);
    });
    const add = make('button', 'add-color', '+ Add color');
    add.type = 'button'; add.disabled = state.colors.length >= palette.LIMIT;
    add.title = add.disabled ? 'Maximum of five sets reached' : 'Add another selection set';
    add.addEventListener('click', () => update(() => palette.addColor(state)));
    paletteHost.append(add);
    const active = state.colors.find((color) => color.id === state.activeColor);
    byId('active-set').textContent = `Active set: ${active.label} · ${state.colors.length} of ${palette.LIMIT} colors available`;

    groupHost.replaceChildren();
    groups.forEach((group) => {
      const assigned = palette.findAssignment(state, group.id);
      const card = make('button', 'group-card');
      card.type = 'button';
      card.setAttribute('aria-pressed', String(Boolean(assigned)));
      card.setAttribute('aria-label', `${group.name}, ${assigned ? `${assigned.label} set` : 'not selected'}`);
      if (assigned) card.style.setProperty('--set-color', assigned.hex);
      card.append(make('strong', '', group.name), make('span', 'group-category', group.category), make('span', 'assignment', assigned ? `${assigned.label} set` : 'Not selected'));
      card.addEventListener('click', () => update(() => palette.toggleGroup(state, group.id)));
      groupHost.append(card);
    });
    const ready = palette.readySets(state);
    const incomplete = state.colors.filter((color) => state.assignments[color.id].length === 1).length;
    runButton.disabled = ready.length === 0;
    byId('status').textContent = ready.length
      ? `${ready.length} set(s) ready.${incomplete ? ` ${incomplete} set(s) need one more group and will be skipped.` : ''}`
      : 'Select two or more groups in one color to continue.';
    byId('state').textContent = JSON.stringify(state, null, 2);
  }

  runButton.addEventListener('click', () => {
    resultsHost.replaceChildren(make('h3', '', 'Selection summaries — no values compared'));
    palette.readySets(state).forEach((set) => {
      const result = make('article', 'set-summary');
      result.style.setProperty('--set-color', set.color.hex);
      result.append(make('h4', '', `${set.color.label} · ${set.groupIds.length} groups`));
      const list = make('ul');
      set.groupIds.forEach((id) => list.append(make('li', '', groups.find((group) => group.id === id).name)));
      result.append(list); resultsHost.append(result);
    });
    resultsHost.hidden = false;
    byId('status').textContent = 'Summaries generated locally. Selection changes clear these summaries.';
  });
  byId('clear').addEventListener('click', () => update(() => palette.clearSelections(state)));
  byId('reset').addEventListener('click', () => update(() => { state = palette.createState(); }));
  render();
})();

(() => {
  const lang = document.body.dataset.lang === 'en' ? 'en' : 'zh';
  const history = typeof pluginStarHistory === 'object' ? pluginStarHistory : null;
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const states = [];
  if (history?.baseline?.stars) {
    let state = {...history.baseline.stars};
    states.push({date: history.baseline.date, stars: {...state}});
    for (const snapshot of history.snapshots || []) {
      state = {...state, ...(snapshot.changes || {})};
      states.push({date: snapshot.date, stars: {...state}});
    }
  }
  const latest = states.at(-1) || {date:'—',stars:typeof pluginStars==='object'?pluginStars:{}};
  const previous = states.at(-2) || latest;
  const byId = new Map(plugins.map(plugin => [plugin.id, plugin]));
  const rows = Object.entries(latest.stars).map(([id, stars]) => ({plugin:byId.get(id), stars:Number(stars||0), growth:Number(stars||0)-Number(previous.stars[id]||0)})).filter(row => row.plugin && row.growth > 0).sort((a,b)=>b.growth-a.growth||b.stars-a.stars).slice(0,30);
  document.querySelector('#trend-period').textContent = previous.date === latest.date ? latest.date : `${previous.date} → ${latest.date}`;
  document.querySelector('#trend-count').textContent = String(Object.entries(latest.stars).filter(([id,stars])=>Number(stars||0)>Number(previous.stars[id]||0)).length);
  const grid = document.querySelector('#trending-grid');
  if (!rows.length) {
    grid.innerHTML = `<p>${lang==='zh'?'星标历史刚开始记录；下一次周一或周四同步后将显示增长排行。':'Star history has just started; growth rankings will appear after the next Monday or Thursday refresh.'}</p>`;
    return;
  }
  grid.innerHTML = rows.map(({plugin,stars,growth}) => {
    const name = lang==='zh'?(plugin.displayNameZh||plugin.name):(plugin.displayNameEn||plugin.name);
    const summary = lang==='zh'?(plugin.summaryZh||plugin.description):(plugin.summaryEn||plugin.descriptionEn||plugin.name);
    const href = `${lang==='en'?'/en':''}/plugin/${encodeURIComponent(plugin.owner)}/${encodeURIComponent(plugin.name)}/`;
    return `<a class="trend-card" href="${href}"><small>${escapeHtml(plugin.owner)}/${escapeHtml(plugin.name)} · ★ ${stars.toLocaleString()}</small><h2>${escapeHtml(name)}</h2><p>${escapeHtml(summary)}</p><span class="growth">+${growth.toLocaleString()} ${lang==='zh'?'星':'stars'}</span></a>`;
  }).join('');
})();

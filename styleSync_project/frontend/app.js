/* ====================================================
   StyleSync — Frontend App
   Connects to Express backend at http://localhost:3000
==================================================== */

const API = 'http://localhost:3000/api';

// ─── TOAST ───────────────────────────────────────────
function showToast(msg, type = 'default') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 3200);
}

// ─── NAVIGATION ──────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    navigate(page);
  });
});

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  pageLoaders[page]?.();
}

const pageLoaders = {
  dashboard:   loadDashboard,
  clothes:     loadClothes,
  accessories: loadAccessories,
  outfits:     loadOutfits,
  laundry:     loadLaundry,
  weather:     loadWeather,
  analytics:   loadAnalytics,
  generate:    () => {},
  users:       () => {},
};

// ─── MODALS ──────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('open');
    // Populate selects if needed
    if (id === 'modal-add-outfit')   populateOutfitSelects();
    if (id === 'modal-add-laundry')  populateLaundrySelect();
  }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('open');
    el.querySelector('form')?.reset();
  }
}
// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ─── HELPERS ─────────────────────────────────────────
function weatherEmoji(cond) {
  return { sunny:'☀️', rainy:'🌧️', cloudy:'☁️', cold:'🥶', hot:'🥵' }[cond] || '🌤️';
}
function categoryIcon(cat) {
  return { top:'👕', bottom:'👖', dress:'👗', suit:'🤵', outerwear:'🧥', activewear:'🩳' }[cat] || '👔';
}
function accessoryIcon(type) {
  return { jewelry:'💍', bag:'👜', shoes:'👟', hat:'🎩', belt:'👔' }[type] || '✨';
}
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
function timeSince(d) {
  if (!d) return 'Never worn';
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days/30)}mo ago`;
  return `${Math.floor(days/365)}y ago`;
}

// ─── DASHBOARD ───────────────────────────────────────
async function loadDashboard() {
  try {
    const [clothesRes, accRes, outfitsRes, analyticsRes] = await Promise.all([
      fetch(`${API}/clothes`),
      fetch(`${API}/accessories`),
      fetch(`${API}/outfits`),
      fetch(`${API}/outfits/analytics`),
    ]);
    const clothes    = clothesRes.ok    ? await clothesRes.json()    : [];
    const accs       = accRes.ok        ? await accRes.json()        : [];
    const outfits    = outfitsRes.ok    ? await outfitsRes.json()    : [];
    const analytics  = analyticsRes.ok  ? await analyticsRes.json()  : null;

    document.getElementById('stat-clothes').textContent     = clothes.length;
    document.getElementById('stat-accessories').textContent = accs.length;
    document.getElementById('stat-outfits').textContent     = outfits.length;
    document.getElementById('stat-donations').textContent   = analytics?.summary?.donationSuggestionsCount ?? '—';

    // Recent outfits
    const recentEl = document.getElementById('recentOutfits');
    const recent = [...outfits].reverse().slice(0,5);
    recentEl.innerHTML = recent.length
      ? recent.map(o => `
          <div class="outfit-mini-item">
            <span class="outfit-mini-name">${o.name || 'Unnamed Outfit'}</span>
            <span class="outfit-mini-meta">${o.weatherCondition || ''} · ${timeSince(o.createdAt)}</span>
          </div>`).join('')
      : '<p class="empty-state" style="padding:20px 0">No outfits yet.</p>';

    // Insights
    const insightsEl = document.getElementById('dashInsights');
    const insights = [];
    if (analytics?.mostUsed?.length)      insights.push({ dot:'dot-success', text:`${analytics.mostUsed.length} frequently worn item(s) (worn 7+ times)` });
    if (analytics?.leastUsed?.length)     insights.push({ dot:'dot-warning', text:`${analytics.leastUsed.length} item(s) suggested for donation` });
    const activeClothes = clothes.filter(c => c.status === 'active').length;
    insights.push({ dot:'dot-accent', text:`${activeClothes} active clothing item(s) in your wardrobe` });

    insightsEl.innerHTML = insights.map(i => `
      <div class="insight-item">
        <div class="insight-dot ${i.dot}"></div>
        <span>${i.text}</span>
      </div>`).join('');

  } catch(e) {
    showToast('Could not load dashboard data', 'error');
  }
}

// ─── CLOTHES ─────────────────────────────────────────
async function loadClothes() {
  const list = document.getElementById('clothesList');
  list.innerHTML = '<div class="empty-state">Loading…</div>';
  try {
    const res = await fetch(`${API}/clothes`);
    const items = await res.json();
    if (!items.length) { list.innerHTML = '<div class="empty-state">No clothing items yet.</div>'; return; }
    list.innerHTML = items.map(item => `
      <div class="item-card">
        <div class="item-card-img">
          ${item.images?.[0]?.url
            ? `<img src="${item.images[0].url}" alt="${item.name}" />`
            : categoryIcon(item.category)}
        </div>
        <div class="item-card-body">
          <div class="item-card-name">${item.name}</div>
          <div class="item-card-meta">
            ${item.category || '—'} · ${item.color}<br>
            ${item.season?.join(', ') || '—'} · ${item.occasion?.join(', ') || '—'}
          </div>
        </div>
        <div class="item-card-footer">
          <span class="badge badge-${item.status}">${item.status}</span>
          <span class="wear-count">Worn <strong>${item.wearCount}</strong>× · ${timeSince(item.lastWorn)}</span>
        </div>
      </div>`).join('');
  } catch(e) {
    list.innerHTML = '<div class="empty-state">Failed to load clothes.</div>';
  }
}

document.getElementById('form-add-clothes').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData();
  fd.append('name',     form.name.value);
  fd.append('category', form.category.value);
  fd.append('color',    form.color.value);
  fd.append('status',   form.status.value);
  fd.append('wearCount', form.wearCount.value);
  if (form.lastWorn.value) fd.append('lastWorn', form.lastWorn.value);
  form.querySelectorAll('[name="season"]:checked').forEach(cb => fd.append('season', cb.value));
  form.querySelectorAll('[name="occasion"]:checked').forEach(cb => fd.append('occasion', cb.value));
  [...(form.images?.files || [])].forEach(f => fd.append('images', f));
  try {
    const res = await fetch(`${API}/clothes`, { method:'POST', body: fd });
    if (!res.ok) throw new Error();
    showToast('Clothing item added!', 'success');
    closeModal('modal-add-clothes');
    loadClothes();
  } catch { showToast('Failed to add clothing item', 'error'); }
});

// ─── ACCESSORIES ─────────────────────────────────────
async function loadAccessories() {
  const list = document.getElementById('accessoriesList');
  list.innerHTML = '<div class="empty-state">Loading…</div>';
  try {
    const res = await fetch(`${API}/accessories`);
    const items = await res.json();
    if (!items.length) { list.innerHTML = '<div class="empty-state">No accessories yet.</div>'; return; }
    list.innerHTML = items.map(item => `
      <div class="item-card">
        <div class="item-card-img">
          ${item.image?.url
            ? `<img src="${item.image.url}" alt="${item.name}" />`
            : accessoryIcon(item.type)}
        </div>
        <div class="item-card-body">
          <div class="item-card-name">${item.name}</div>
          <div class="item-card-meta">
            ${item.type || '—'} · ${item.color}<br>
            Compatible: ${item.compatibleWith?.join(', ') || '—'}
          </div>
        </div>
        <div class="item-card-footer">
          <span class="badge badge-${item.status}">${item.status}</span>
          <span class="wear-count">Worn <strong>${item.wearCount}</strong>×</span>
        </div>
      </div>`).join('');
  } catch(e) {
    list.innerHTML = '<div class="empty-state">Failed to load accessories.</div>';
  }
}

document.getElementById('form-add-accessory').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData();
  fd.append('name',   form.name.value);
  fd.append('type',   form.type.value);
  fd.append('color',  form.color.value);
  fd.append('status', form.status.value);
  form.querySelectorAll('[name="compatibleWith"]:checked').forEach(cb => fd.append('compatibleWith', cb.value));
  if (form.image?.files[0]) fd.append('image', form.image.files[0]);
  try {
    const res = await fetch(`${API}/accessories`, { method:'POST', body: fd });
    if (!res.ok) throw new Error();
    showToast('Accessory added!', 'success');
    closeModal('modal-add-accessory');
    loadAccessories();
  } catch { showToast('Failed to add accessory', 'error'); }
});

// ─── OUTFITS ─────────────────────────────────────────
async function loadOutfits() {
  const list = document.getElementById('outfitsList');
  list.innerHTML = '<div class="empty-state">Loading…</div>';
  try {
    const res = await fetch(`${API}/outfits`);
    const items = await res.json();
    if (!items.length) { list.innerHTML = '<div class="empty-state">No outfits saved yet.</div>'; return; }
    list.innerHTML = items.map(item => `
      <div class="item-card" onclick="showOutfitDetail('${item._id}')">
        <div class="item-card-img">
          ${item.outfitImages?.url
            ? `<img src="${item.outfitImages.url}" alt="${item.name || 'Outfit'}" />`
            : '◉'}
        </div>
        <div class="item-card-body">
          <div class="item-card-name">${item.name || 'Unnamed Outfit'}</div>
          <div class="item-card-meta">
            ${item.clothingItems?.length || 0} clothing items · ${item.accessories?.length || 0} accessories<br>
            ${item.weatherCondition ? `<span class="badge badge-${item.weatherCondition}">${weatherEmoji(item.weatherCondition)} ${item.weatherCondition}</span>` : ''}
          </div>
        </div>
        <div class="item-card-footer">
          <span class="wear-count">Worn <strong>${item.wearCount}</strong>×</span>
          <span style="font-size:0.75rem;color:var(--ink-light)">${formatDate(item.createdAt)}</span>
        </div>
      </div>`).join('');
  } catch(e) {
    list.innerHTML = '<div class="empty-state">Failed to load outfits.</div>';
  }
}

async function showOutfitDetail(id) {
  try {
    const res = await fetch(`${API}/outfits/${id}`);
    const outfit = await res.json();
    document.getElementById('detail-outfit-name').textContent = outfit.name || 'Outfit Details';
    const body = document.getElementById('outfit-detail-body');
    const clothes = outfit.clothingItems?.map(c => `
      <div class="outfit-item-chip">
        <span class="chip-name">${categoryIcon(c.category)} ${c.name}</span>
        <span class="chip-meta">${c.color} · ${c.category || '—'}</span>
      </div>`).join('') || '<em>None</em>';
    const accs = outfit.accessories?.map(a => `
      <div class="outfit-item-chip">
        <span class="chip-name">${accessoryIcon(a.type)} ${a.name}</span>
        <span class="chip-meta">${a.color} · ${a.type || '—'}</span>
      </div>`).join('') || '<em>None</em>';
    body.innerHTML = `
      <div class="outfit-detail-meta" style="margin-bottom:16px">
        <strong>Weather:</strong> ${outfit.weatherCondition ? `${weatherEmoji(outfit.weatherCondition)} ${outfit.weatherCondition}` : '—'}<br>
        <strong>Worn:</strong> ${outfit.wearCount}× &nbsp; <strong>Created:</strong> ${formatDate(outfit.createdAt)}
      </div>
      ${outfit.outfitImages?.url ? `<img src="${outfit.outfitImages.url}" style="width:100%;border-radius:6px;margin-bottom:16px;max-height:200px;object-fit:cover" />` : ''}
      <div class="outfit-section-title">Clothing Items</div>
      <div class="outfit-items-row">${clothes}</div>
      <div class="outfit-section-title">Accessories</div>
      <div class="outfit-items-row">${accs}</div>`;
    openModal('modal-outfit-detail');
  } catch { showToast('Failed to load outfit details', 'error'); }
}

async function populateOutfitSelects() {
  try {
    const [cr, ar] = await Promise.all([fetch(`${API}/clothes`), fetch(`${API}/accessories`)]);
    const clothes = cr.ok ? await cr.json() : [];
    const accs    = ar.ok ? await ar.json() : [];
    document.getElementById('outfit-clothes-select').innerHTML =
      clothes.map(c => `<option value="${c._id}">${categoryIcon(c.category)} ${c.name} (${c.color})</option>`).join('');
    document.getElementById('outfit-accessories-select').innerHTML =
      accs.map(a => `<option value="${a._id}">${accessoryIcon(a.type)} ${a.name} (${a.color})</option>`).join('');
  } catch {}
}

document.getElementById('form-add-outfit').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData();
  fd.append('name', form.name.value);
  fd.append('weatherCondition', form.weatherCondition.value);
  [...form.querySelectorAll('[name="clothingItems"] option:checked')].forEach(o => fd.append('clothingItems', o.value));
  [...form.querySelectorAll('[name="accessories"] option:checked')].forEach(o => fd.append('accessories', o.value));
  if (form.outfitImages?.files[0]) fd.append('outfitImages', form.outfitImages.files[0]);
  try {
    const res = await fetch(`${API}/outfits`, { method:'POST', body: fd });
    if (!res.ok) throw new Error();
    showToast('Outfit saved!', 'success');
    closeModal('modal-add-outfit');
    loadOutfits();
  } catch { showToast('Failed to save outfit', 'error'); }
});

// ─── GENERATE OUTFIT ─────────────────────────────────
document.getElementById('generateForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('generateBtn');
  const result = document.getElementById('generateResult');
  const location = document.getElementById('gen-location').value.trim();
  const occasion = document.getElementById('gen-occasion').value;
  const name     = document.getElementById('gen-name').value.trim();

  btn.innerHTML = '<span class="spinner"></span> Generating…';
  btn.disabled = true;
  result.innerHTML = '<div class="generate-placeholder"><div class="placeholder-icon" style="animation:spin 1.5s linear infinite">✧</div><p>Finding the perfect outfit…</p></div>';

  try {
    const fd = new FormData();
    fd.append('location', location);
    if (occasion) fd.append('occasion', occasion);
    if (name)     fd.append('name', name);

    const res = await fetch(`${API}/outfits/generate`, { method:'POST', body: fd });
    const data = await res.json();

    if (!res.ok) {
      result.innerHTML = `<div class="generate-placeholder"><div class="placeholder-icon">✕</div><p>${data.message || 'Generation failed'}</p></div>`;
      showToast(data.message || 'Generation failed', 'error');
      return;
    }

    const outfit = data.outfit;
    const clothesList = outfit.clothingItems?.map(c => `
      <div class="outfit-item-chip">
        <span class="chip-name">${categoryIcon(c.category)} ${c.name}</span>
        <span class="chip-meta">${c.color} · ${c.season?.join(', ')}</span>
      </div>`).join('') || '<em>None found</em>';
    const accList = outfit.accessories?.map(a => `
      <div class="outfit-item-chip">
        <span class="chip-name">${accessoryIcon(a.type)} ${a.name}</span>
        <span class="chip-meta">${a.color} · ${a.type}</span>
      </div>`).join('') || '<em>None found</em>';

    result.innerHTML = `
      ${outfit.outfitImages?.url ? `<img src="${outfit.outfitImages.url}" style="width:100%;border-radius:8px;margin-bottom:16px;max-height:220px;object-fit:cover" />` : ''}
      <div class="generated-outfit-header">${outfit.name}</div>
      <div class="generated-weather">${weatherEmoji(data.weatherCondition)} ${data.weatherCondition} weather in <strong>${location}</strong></div>
      <div class="outfit-section-title">Clothing Items</div>
      <div class="outfit-items-row">${clothesList}</div>
      <div class="outfit-section-title">Accessories</div>
      <div class="outfit-items-row">${accList}</div>
      <div style="margin-top:20px">
        <button class="btn-primary" onclick="navigate('outfits')">View All Outfits →</button>
      </div>`;
    showToast('Outfit generated successfully!', 'success');
  } catch(e) {
    result.innerHTML = `<div class="generate-placeholder"><div class="placeholder-icon">✕</div><p>Server error. Is the backend running?</p></div>`;
    showToast('Server error', 'error');
  } finally {
    btn.innerHTML = '<span>✧ Generate Outfit</span>';
    btn.disabled = false;
  }
});

// ─── LAUNDRY ─────────────────────────────────────────
let laundryData = [];
async function loadLaundry() {
  const statuses = ['pending','washing','drying','done'];
  statuses.forEach(s => document.querySelector(`#lane-${s} .lane-items`).innerHTML = '');
  try {
    const res = await fetch(`${API}/laundry`);
    // The backend might not have a GET /laundry — render from cache
    if (res.ok) {
      const items = await res.json();
      laundryData = items;
      renderLaundryBoard(items);
    }
  } catch {
    // GET not implemented — show empty board
  }
}

function renderLaundryBoard(items) {
  const statuses = ['pending','washing','drying','done'];
  statuses.forEach(s => {
    const lane = document.querySelector(`#lane-${s} .lane-items`);
    const filtered = items.filter(i => i.status === s);
    lane.innerHTML = filtered.length
      ? filtered.map(item => `
          <div class="laundry-card">
            <div><strong>${item.items?.length || 0}</strong> item(s)</div>
            <div class="laundry-card-date">${item.scheduledDate ? '📅 ' + formatDate(item.scheduledDate) : 'No date set'}</div>
            <div class="laundry-card-actions">
              <button class="btn-success btn-sm" onclick="openUpdateLaundry('${item._id}','${item.status}')">Update Status</button>
            </div>
          </div>`).join('')
      : '<div style="padding:8px;font-size:0.78rem;color:var(--ink-light)">Empty</div>';
  });
}

function openUpdateLaundry(id, currentStatus) {
  document.getElementById('update-laundry-id').value = id;
  document.getElementById('update-laundry-status').value = currentStatus;
  openModal('modal-update-laundry');
}

document.getElementById('form-update-laundry').addEventListener('submit', async e => {
  e.preventDefault();
  const id     = document.getElementById('update-laundry-id').value;
  const status = document.getElementById('update-laundry-status').value;
  try {
    const res = await fetch(`${API}/laundry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error();
    showToast('Laundry status updated!', 'success');
    closeModal('modal-update-laundry');
    loadLaundry();
  } catch { showToast('Failed to update laundry', 'error'); }
});

async function populateLaundrySelect() {
  try {
    const res = await fetch(`${API}/clothes`);
    const clothes = res.ok ? await res.json() : [];
    document.getElementById('laundry-clothes-select').innerHTML =
      clothes.map(c => `<option value="${c._id}">${categoryIcon(c.category)} ${c.name}</option>`).join('');
  } catch {}
}

document.getElementById('form-add-laundry').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const items = [...form.querySelectorAll('[name="items"] option:checked')].map(o => o.value);
  const status = form.status.value;
  const scheduledDate = form.scheduledDate.value;
  try {
    const res = await fetch(`${API}/laundry`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ items, status, scheduledDate: scheduledDate || undefined }),
    });
    if (!res.ok) throw new Error();
    const newRecord = await res.json();
    laundryData.push(newRecord);
    showToast('Added to laundry!', 'success');
    closeModal('modal-add-laundry');
    renderLaundryBoard(laundryData);
  } catch { showToast('Failed to add laundry record', 'error'); }
});

// ─── WEATHER ─────────────────────────────────────────
let weatherCache = [];
async function loadWeather() {
  const list = document.getElementById('weatherList');
  if (weatherCache.length) { renderWeather(weatherCache); return; }
  list.innerHTML = '<div class="empty-state">Log weather conditions to see them here.</div>';
}
function renderWeather(items) {
  const list = document.getElementById('weatherList');
  if (!items.length) { list.innerHTML = '<div class="empty-state">No weather data logged yet.</div>'; return; }
  list.innerHTML = items.map(w => `
    <div class="weather-card">
      <div class="weather-emoji">${weatherEmoji(w.conditions)}</div>
      <div class="weather-location">${w.location}</div>
      <div class="weather-condition"><span class="badge badge-${w.conditions}">${w.conditions}</span></div>
      <div class="weather-date">${formatDate(w.date || w.createdAt)}</div>
    </div>`).join('');
}

document.getElementById('form-add-weather').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const body = {
    location: form.location.value,
    conditions: form.conditions.value,
    date: form.date.value || new Date().toISOString(),
  };
  try {
    const res = await fetch(`${API}/weather`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
    const newWeather = await res.json();
    weatherCache.push(newWeather);
    showToast('Weather logged!', 'success');
    closeModal('modal-add-weather');
    renderWeather(weatherCache);
  } catch { showToast('Failed to log weather', 'error'); }
});

// ─── ANALYTICS ───────────────────────────────────────
async function loadAnalytics() {
  const content = document.getElementById('analyticsContent');
  content.innerHTML = '<div class="empty-state">Loading analytics…</div>';
  try {
    const res = await fetch(`${API}/outfits/analytics`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const { summary, mostUsed, leastUsed } = data;

    content.innerHTML = `
      <div class="analytics-summary">
        <div class="stat-card">
          <div class="stat-icon">◫</div>
          <div class="stat-num">${summary.totalClothes}</div>
          <div class="stat-label">Total Clothes</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:var(--success)">◈</div>
          <div class="stat-num" style="color:var(--success)">${summary.mostUsedCount}</div>
          <div class="stat-label">Frequently Worn</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color:var(--accent)">◌</div>
          <div class="stat-num" style="color:var(--accent)">${summary.donationSuggestionsCount}</div>
          <div class="stat-label">Donation Picks</div>
        </div>
      </div>

      <div class="analytics-section">
        <div class="analytics-section-title">
          ✦ Most Worn Items
          <span class="analytics-badge">${mostUsed.length} items</span>
        </div>
        ${mostUsed.length
          ? mostUsed.map(item => `
              <div class="most-used-card">
                <div>
                  <div class="donation-name">${categoryIcon(item.category)} ${item.name}</div>
                  <div class="donation-reason">${item.color} · ${item.category || '—'} · Last worn ${timeSince(item.lastWorn)}</div>
                </div>
                <span class="wear-count">Worn <strong>${item.wearCount}</strong>×</span>
              </div>`).join('')
          : '<div class="empty-state" style="padding:20px 0">No items worn 7+ times yet.</div>'}
      </div>

      <div class="analytics-section">
        <div class="analytics-section-title">
          ◌ Donation Suggestions
          <span class="analytics-badge">${leastUsed.length} items</span>
        </div>
        ${leastUsed.length
          ? leastUsed.map(item => `
              <div class="donation-card">
                <div>
                  <div class="donation-name">${categoryIcon(item.category)} ${item.name}</div>
                  <div class="donation-reason">${item.reason}</div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span class="wear-count">Worn <strong>${item.wearCount}</strong>×</span>
                  <span class="badge badge-donated">Suggest Donation</span>
                </div>
              </div>`).join('')
          : '<div class="empty-state" style="padding:20px 0">No donation suggestions. Great wardrobe usage!</div>'}
      </div>`;
  } catch(e) {
    content.innerHTML = '<div class="empty-state">Failed to load analytics. Make sure the backend is running.</div>';
    showToast('Analytics load failed', 'error');
  }
}

// ─── USERS ───────────────────────────────────────────
let usersCache = [];
document.getElementById('form-add-user').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData();
  fd.append('name',     form.name.value);
  fd.append('location', form.location.value);
  form.querySelectorAll('[name="stylePreferences"]:checked').forEach(cb => fd.append('stylePreferences', cb.value));
  if (form.profilePicture?.files[0]) fd.append('profilePicture', form.profilePicture.files[0]);
  try {
    const res = await fetch(`${API}/users`, { method:'POST', body: fd });
    if (!res.ok) throw new Error();
    const user = await res.json();
    usersCache.push(user);
    showToast('User created!', 'success');
    closeModal('modal-add-user');
    renderUsers(usersCache);
  } catch { showToast('Failed to create user', 'error'); }
});

function renderUsers(users) {
  const list = document.getElementById('usersList');
  if (!users.length) { list.innerHTML = '<div class="empty-state">No users yet. Create a profile!</div>'; return; }
  list.innerHTML = users.map(u => `
    <div class="user-card">
      <div class="user-avatar">
        ${u.profilePicture?.url ? `<img src="${u.profilePicture.url}" alt="${u.name}" />` : u.name.charAt(0).toUpperCase()}
      </div>
      <div class="user-card-body">
        <div class="user-name">${u.name}</div>
        <div class="user-location">📍 ${u.location}</div>
        <div class="user-prefs">
          ${(u.stylePreferences || []).map(p => `<span class="pref-tag">${p}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

// ─── INIT ─────────────────────────────────────────────
loadDashboard();

const Facilities = {
  async getAll() {
    const { data, error } = await supabaseClient
      .from('facilities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('[Facilities] Load failed:', error);
      return [];
    }

    console.log('[Facilities] Loaded:', data);
    return data;
  },

  async populateSelect(selectId, options = {}) {
    const select = document.getElementById(selectId);

    if (!select) {
      console.warn(`[Facilities] Select not found: ${selectId}`);
      return;
    }

    const facilities = await this.getAll();

    const placeholder = options.placeholder || 'Select facility';

    select.innerHTML = `
      <option value="">${placeholder}</option>
      ${facilities.map(facility => `
        <option value="${facility.id}">
          ${facility.name} (${facility.facility_type})
        </option>
      `).join('')}
    `;

    console.log(`[Facilities] Populated ${selectId}`);
  }
};

window.Facilities = Facilities;
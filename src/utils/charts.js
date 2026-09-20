// Interactive SVG chart generators for Health Trends

export function renderTrendChart(type, timeframe, lang = 'en') {
  const dataMap = {
    heartRate: {
      '7D': [74, 72, 70, 75, 73, 71, 72],
      '30D': [76, 75, 74, 72, 73, 70, 71, 74, 72, 73, 72, 70, 71, 72, 74, 73, 72],
      '3M': [78, 76, 75, 73, 72, 72, 71, 72, 73, 72, 72, 71],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      unit: 'BPM',
      color: '#006194',
      gradientId: 'hr-grad',
      min: 60,
      max: 90
    },
    weight: {
      '7D': [69.0, 68.8, 68.6, 68.5, 68.4, 68.3, 68.2],
      '30D': [70.2, 69.8, 69.5, 69.1, 68.8, 68.5, 68.2],
      '3M': [71.5, 70.8, 70.0, 69.2, 68.7, 68.2],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      unit: 'kg',
      color: '#006a61',
      gradientId: 'wt-grad',
      min: 65,
      max: 72
    },
    adherence: {
      '7D': [100, 75, 100, 100, 100, 75, 88],
      '30D': [90, 85, 92, 88, 95, 88, 90, 92, 88],
      '3M': [82, 85, 88, 86, 90, 88],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      unit: '%',
      color: '#00855b',
      gradientId: 'adh-grad',
      min: 50,
      max: 100
    }
  };

  const chart = dataMap[type] || dataMap.heartRate;
  const values = chart[timeframe] || chart['7D'];
  const width = 340;
  const height = 150;
  const padding = 20;

  const minVal = chart.min;
  const maxVal = chart.max;
  const range = maxVal - minVal;

  const points = values.map((val, idx) => {
    const x = padding + (idx / (values.length - 1)) * (width - 2 * padding);
    const normalizedY = (val - minVal) / range;
    const y = height - padding - normalizedY * (height - 2 * padding);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-36 overflow-visible">
      <defs>
        <linearGradient id="${chart.gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${chart.color}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${chart.color}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Background Grid lines -->
      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#dae2fd" stroke-dasharray="3 3" stroke-width="1" />
      <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="#dae2fd" stroke-dasharray="3 3" stroke-width="1" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#dae2fd" stroke-width="1" />

      <!-- Filled Area -->
      <path d="${areaD}" fill="url(#${chart.gradientId})" />

      <!-- Spline Line -->
      <path d="${pathD}" fill="none" stroke="${chart.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-all duration-700 ease-out" />

      <!-- Points -->
      ${points.map((pt, i) => `
        <g class="group cursor-pointer">
          <circle cx="${pt.x}" cy="${pt.y}" r="${i === points.length - 1 ? 5 : 3.5}" fill="#ffffff" stroke="${chart.color}" stroke-width="2.5" class="transition-transform group-hover:scale-150" />
          ${i === points.length - 1 ? `
            <rect x="${pt.x - 22}" y="${pt.y - 28}" width="44" height="20" rx="6" fill="${chart.color}" />
            <text x="${pt.x}" y="${pt.y - 14}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">${pt.val}${chart.unit === '%' ? '%' : ''}</text>
          ` : ''}
        </g>
      `).join('')}
    </svg>
  `;
}

// Feedback Toast Notification System for MediSathi AI

let toastTimeout = null;

export function showToast(message, type = 'success', duration = 3000) {
  const existing = document.getElementById('medisathi-toast');
  if (existing) existing.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const colors = {
    success: 'bg-tertiary text-on-tertiary border-tertiary-container',
    info: 'bg-primary text-on-primary border-primary-container',
    warning: 'bg-amber-600 text-white border-amber-500',
    error: 'bg-error text-on-error border-red-700'
  };

  const icons = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  const toast = document.createElement('div');
  toast.id = 'medisathi-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl border text-[13px] font-semibold transition-all duration-300 transform -translate-y-2 opacity-0 pointer-events-auto max-w-[90%] ${colors[type] || colors.info}`;
  
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">${icons[type] || 'info'}</span>
    <span class="truncate">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('-translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

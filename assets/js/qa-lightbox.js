/* Native dialog supplies modal semantics, focus containment and Escape. */
(() => {
  const links = [...document.querySelectorAll('.proof-image-link')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'qa-lightbox';
  dialog.setAttribute('aria-label', 'Preuve visuelle agrandie');
  dialog.innerHTML = '<div class="qa-lightbox-bar"><button type="button" class="qa-lightbox-close" aria-label="Fermer la visionneuse">✕ Fermer</button></div><img class="qa-lightbox-image" alt="">';
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const close = dialog.querySelector('button');
  let trigger = null;
  let previousOverflow = null;
  const open = (link) => {
    if (dialog.open) return;
    trigger = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    previousOverflow = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    close.focus({preventScroll: true});
  };
  links.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(link);
    });
    link.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
        open(link);
      }
    });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      close.focus();
    }
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (previousOverflow) {
      document.documentElement.style.overflow = previousOverflow[0];
      document.body.style.overflow = previousOverflow[1];
    }
    image.removeAttribute('src');
    trigger?.focus({preventScroll: true});
  });
})();

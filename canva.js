(function () {
  // Cari semua iframe di halaman
  const iframes = document.querySelectorAll('iframe');
  
  if (iframes.length === 0) {
    console.warn('⚠️ Tidak ada iframe ditemukan.');
    return;
  }

  let canvaLinks = [];

  iframes.forEach((iframe, idx) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const links = iframeDoc.querySelectorAll('a[href]');
      
      links.forEach(el => {
        if (el.href.includes('canva.com')) {
          canvaLinks.push({
            label: el.innerText.trim() || '(no text)',
            url: el.href,
            iframe: idx
          });
        }
      });

    } catch (e) {
      // Coba ambil dari src iframe itu sendiri
      const src = iframe.src || iframe.getAttribute('src') || '';
      if (src.includes('canva.com')) {
        canvaLinks.push({
          label: `iframe #${idx}`,
          url: src,
          iframe: idx
        });
      }
      console.warn(`⚠️ Iframe #${idx} tidak bisa diakses:`, e.message);
    }
  });

  if (canvaLinks.length === 0) {
    console.warn('⚠️ Tidak ada link Canva ditemukan.');
    return;
  }

  // Export CSV
  const csvHeader = 'No,Label,URL,Iframe Index\n';
  const csvRows = canvaLinks.map((item, i) => {
    const label = `"${item.label.replace(/"/g, '""')}"`;
    const url = `"${item.url.replace(/"/g, '""')}"`;
    return `${i + 1},${label},${url},${item.iframe}`;
  }).join('\n');

  const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'canva_links.csv';
  a.click();

  console.log(`✅ ${canvaLinks.length} link Canva berhasil diekspor.`);
})();

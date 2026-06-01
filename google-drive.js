(function () {
  const iframe = document.querySelector('iframe');
  
  if (!iframe) {
    console.warn('⚠️ Tidak ada iframe.');
    return;
  }

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const links = iframeDoc.querySelectorAll('a[href*="drive.google.com"]');

  if (links.length === 0) {
    console.warn('⚠️ Tidak ada link Drive ditemukan.');
    return;
  }

  const csvHeader = 'No,Label,URL\n';
  const csvRows = Array.from(links).map((el, i) => {
    const label = `"${el.innerText.trim().replace(/"/g, '""') || '(no text)'}"`;
    const url = `"${el.href.replace(/"/g, '""')}"`;
    return `${i + 1},${label},${url}`;
  }).join('\n');

  const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'drive_links.csv';
  a.click();

  console.log(`✅ ${links.length} link berhasil diekspor.`);
})();

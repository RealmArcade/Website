(() => {
  const FALLBACK_URL = "https://github.com/RealmArcade/Realm/releases/latest";
  const downloadBtn = document.getElementById("download-button");

  if (!downloadBtn) return;

  fetch("https://api.github.com/repos/RealmArcade/Realm/releases")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then((releases) => {
      if (!Array.isArray(releases) || releases.length === 0) {
        downloadBtn.href = FALLBACK_URL;
        return;
      }

      // Sort by published_at (or created_at) descending to guarantee chronological order
      const sorted = [...releases].sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || 0).getTime();
        const dateB = new Date(b.published_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

      // Find the newest release that contains a .7z asset
      for (const release of sorted) {
        const asset = release.assets?.find(
          (a) => a.name && a.name.endsWith(".7z")
        );
        if (asset?.browser_download_url) {
          downloadBtn.href = asset.browser_download_url;
          return;
        }
      }

      downloadBtn.href = FALLBACK_URL;
    })
    .catch(() => {
      downloadBtn.href = FALLBACK_URL;
    });
})();

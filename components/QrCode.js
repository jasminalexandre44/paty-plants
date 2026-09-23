"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCode({ url, name }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      width: 320,
      margin: 1,
      color: { dark: "#1F3529", light: "#FBFAF5" },
    }).then((generated) => {
      if (active) setDataUrl(generated);
    });
    return () => {
      active = false;
    };
  }, [url]);

  return (
    <div className="specimen-card flex flex-col items-center gap-4 rounded-soft p-6 text-center">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt={`QR code ${name}`} className="h-40 w-40" />
      ) : (
        <div className="flex h-40 w-40 items-center justify-center text-sm text-sage">
          Membuat QR...
        </div>
      )}
      <div>
        <p className="text-sm text-bark/60">
          Pindai untuk membuka halaman ini
        </p>
        <p className="mt-1 break-all text-xs text-bark/40">{url}</p>
      </div>
      {dataUrl && (
        <a
          href={dataUrl}
          download={`qr-${name}.png`}
          className="rounded-full border border-canopy/30 px-4 py-2 text-sm text-canopy transition hover:bg-canopy hover:text-parchment"
        >
          Unduh QR code
        </a>
      )}
    </div>
  );
}

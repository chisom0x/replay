import QRCode from 'qrcode';

export default async function genQr(url) {
  const qrCode = await QRCode.toBuffer(url);
  return qrCode;
}



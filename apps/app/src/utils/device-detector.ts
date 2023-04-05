import DeviceDetector from "device-detector-js";

export default function deviceDetector(userAgent: string | undefined) {
  if (!userAgent) return;
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(userAgent);
  return { type: device?.client?.type, name: device?.client?.name };
}

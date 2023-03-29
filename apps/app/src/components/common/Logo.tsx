import LogoImageSrc from "@/assets/logo-sm.png";
import Image from "next/image";
import Link from "next/link";

export const LogoSrc = LogoImageSrc;

export default function Logo() {
  return (
    <Link href="/">
      <Image src={LogoSrc} width={50} alt="Linkify logo" />
    </Link>
  );
}

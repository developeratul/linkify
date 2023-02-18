import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.png" width={100} height={15} alt="LinkVault logo" />
    </Link>
  );
}

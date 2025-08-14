import Image from "next/image";
import desktopBg from "./bg-images/desktop image.png";
import mobileTabletBg from "./bg-images/mobile and tablet image.png";

interface HomepageBackgroundProps {
  className?: string;
}

// Background that covers the viewport using next/image for reliable loading & sizing
export default function HomepageBackground({ className = "" }: HomepageBackgroundProps) {
  return (
    <div aria-hidden className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      {/* Mobile & Tablet */}
      <Image
        src={mobileTabletBg}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center lg:hidden"
      />

      {/* Desktop and up */}
      <Image
        src={desktopBg}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center hidden lg:block"
      />
    </div>
  );
}
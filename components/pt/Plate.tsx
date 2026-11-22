"use client";
import Image from "next/image";

export default function Plate({
  src,
  position = "50% 30%",
  line,
}: {
  src: string;
  position?: string;
  line?: string;
}) {
  return (
    <div className="pt-plate">
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={86}
        style={{ objectPosition: position }}
      />
      {line && (
        <div className="line">
          <div className="inner">
            <p>{line}</p>
          </div>
        </div>
      )}
    </div>
  );
}

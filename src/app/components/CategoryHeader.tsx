import Image from "next/image";

export default function CategoryHeader({ category }: { category: string }) {
  return (
    <div className="flex items-center relative h-[15vh] w-full overflow-hidden rounded-t-3xl select-none group">
      <Image
        src={`/headers/${category}.jpg`}
        fill
        alt={`${category} header image`}
        className="object-cover brightness-90 transition-all duration-300 group-hover:brightness-100"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-800/0 to-stone-50"></div> */}
      <h2 className="px-8 text-3xl md:text-5xl font-semibold text-(--background) drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)]">
        {category}
      </h2>
    </div>
  );
}

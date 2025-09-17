import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Texto */}
        <p className="text-sm text-gray-600 text-center md:text-left">
          App desenvolvido para processo seletivo
        </p>

        {/* Logo */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <Image
            src="/images/GG-PRETOHORIZONTAL.png"
            alt="Logo da empresa"
            width={160}
            height={40}
            className="h-auto w-auto max-h-10 object-contain"
          />
        </div>
      </div>
    </footer>
  );
}

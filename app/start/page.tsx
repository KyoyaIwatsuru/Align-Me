import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="py-32">
      <Image src="/AlignMe.png" alt="logo" width={300} height={300} />
      <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">対話で職業・バイトを探す</h1>
        <Link href="/home" className="mt-3">
          <button className="btn btn-primary w-[100%]">診断を始める</button>
        </Link>
      </div>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='flex w-[100%]'>
      <Link href='/home'>
        <Image src="/AlignMe.png" alt="logo" width={100} height={100} />
      </Link>
    </header>
  );
}
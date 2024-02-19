import { Metadata } from 'next';
import Map from '@/app/ui/atlas/map';
 
export const metadata: Metadata = {
  title: 'Atlas',
};

export default function Page() {
    return (
      <main>
        <Map />
      </main>
    );
}
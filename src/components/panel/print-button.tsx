'use client';

import { IconPrinter } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export default function PrintButton() {
  return <Button className="no-print" onClick={() => window.print()}><IconPrinter /> Yazdır</Button>;
}

import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function TenantLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}

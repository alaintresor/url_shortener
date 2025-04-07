'use client';

import { Provider } from 'react-redux';
import { persistor, store } from '@/store/store';
import { useRef } from 'react';
import { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

export default function ClientReduxProvider({
  children
}: {
  children: ReactNode
}) {
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>;
}
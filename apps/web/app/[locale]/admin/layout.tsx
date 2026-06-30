export const metadata = {
  title: { default: 'Admin', template: '%s · Admin — Cabral & Souza' },
  robots: { index: false, follow: false },
}

/** Layout raiz do admin — sem auth. Login e callback ficam aqui; rotas protegidas usam (protected)/layout.tsx */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}

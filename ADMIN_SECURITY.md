# Sécurité du Dashboard Admin

## 🔒 Protection actuelle

Le dashboard admin est **déjà protégé** avec plusieurs couches de sécurité :

### 1. Protection au niveau Layout (`/src/app/[lang]/admin/layout.tsx`)

```typescript
export default async function AdminLayout() {
  const session = await auth();
  const resolvedParams = await params;

  // Vérification 1: L'utilisateur est-il connecté ?
  if (!session?.user?.email) {
    redirect(`/${resolvedParams.lang}`);
  }

  // Vérification 2: L'utilisateur est-il dans la liste des admins ?
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(session.user.email)) {
    redirect(`/${resolvedParams.lang}`);
  }

  return (/* Dashboard admin */);
}
```

### 2. Protection des API Routes

Toutes les routes API admin (`/src/app/api/admin/*`) sont protégées :

```typescript
export async function GET() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
  }

  // Code de l'API...
}
```

## 🔐 Configuration requise

### Variable d'environnement `.env.local`

```env
ADMIN_EMAILS=votre.email@example.com,autre.admin@example.com
```

**Important :** 
- Séparez les emails par des virgules
- Pas d'espaces autour des virgules
- Emails en minuscules recommandé

## ✅ Vérifications de sécurité

### Test 1 : Utilisateur non connecté
```
1. Déconnectez-vous
2. Essayez d'accéder à /fr/admin
3. Résultat attendu : Redirection vers /fr
```

### Test 2 : Utilisateur connecté mais non admin
```
1. Connectez-vous avec un compte utilisateur normal
2. Essayez d'accéder à /fr/admin
3. Résultat attendu : Redirection vers /fr
```

### Test 3 : Admin autorisé
```
1. Connectez-vous avec un email dans ADMIN_EMAILS
2. Accédez à /fr/admin
3. Résultat attendu : Accès au dashboard
```

## 🚨 Améliorations supplémentaires recommandées

### 1. Ajouter un rôle "admin" en base de données

**Créer une migration Supabase :**

```sql
-- Ajouter une colonne role à la table users
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- Index pour performance
CREATE INDEX idx_users_role ON users(role);

-- Mettre à jour vos admins
UPDATE users SET role = 'admin' WHERE email = 'votre.email@example.com';
```

**Modifier la vérification :**

```typescript
// Dans layout.tsx et les API routes
const { data: user } = await supabase
  .from('users')
  .select('role')
  .eq('email', session.user.email)
  .single();

if (user?.role !== 'admin') {
  redirect(`/${resolvedParams.lang}`);
}
```

### 2. Middleware Next.js (optionnel mais recommandé)

**Créer `/src/middleware.ts` :**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérifier si c'est une route admin
  if (pathname.includes('/admin')) {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:lang/admin/:path*', '/api/admin/:path*'],
};
```

### 3. Logger les tentatives d'accès

**Créer une table de logs :**

```sql
CREATE TABLE admin_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  action TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Ajouter le logging :**

```typescript
async function logAdminAccess(email: string, success: boolean, request: Request) {
  await supabase.from('admin_access_logs').insert({
    user_email: email,
    action: 'admin_access_attempt',
    ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    user_agent: request.headers.get('user-agent') || 'unknown',
    success,
  });
}
```

### 4. Rate Limiting (limite de tentatives)

Utiliser un package comme `@upstash/ratelimit` ou `express-rate-limit`.

### 5. Authentification à deux facteurs (2FA)

Implémenter avec `@supabase/auth-helpers` ou un service comme Twilio/Auth0.

## 📋 Checklist de sécurité

- [x] Vérification de session côté serveur
- [x] Liste d'emails autorisés dans .env
- [x] Protection du layout admin
- [x] Protection des API routes admin
- [ ] Rôle admin en base de données
- [ ] Middleware Next.js
- [ ] Logging des accès
- [ ] Rate limiting
- [ ] 2FA (optionnel)

## 🔍 Debug

Pour vérifier si votre email est bien admin :

```typescript
// Temporairement dans layout.tsx
console.log('Session email:', session.user.email);
console.log('Admin emails:', process.env.ADMIN_EMAILS?.split(','));
console.log('Is admin:', adminEmails.includes(session.user.email));
```

## 🎯 État actuel

✅ **Votre dashboard admin est DÉJÀ SÉCURISÉ** avec :
- Protection au niveau layout (redirection automatique)
- Protection des API routes (401/403)
- Liste blanche d'emails via variable d'environnement

**Aucun utilisateur ne peut accéder au dashboard sans être dans la liste ADMIN_EMAILS.**

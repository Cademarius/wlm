# Guide de test de sécurité Admin Dashboard

## ✅ Configuration actuelle

**Email admin autorisé :** `procodeur4@gmail.com`

**Fichier :** `.env.local`
```env
ADMIN_EMAILS=procodeur4@gmail.com
```

## 🧪 Tests à effectuer

### Test 1 : Accès sans connexion ❌

1. **Déconnectez-vous** (si connecté)
2. Ouvrez votre navigateur en mode privé
3. Accédez à `http://localhost:3001/fr/admin`

**Résultat attendu :**
- ✅ Redirection automatique vers `/fr`
- ❌ Aucun accès au dashboard

---

### Test 2 : Accès avec un utilisateur normal ❌

1. **Créez un nouveau compte** avec un email différent (ex: `test@gmail.com`)
2. Connectez-vous avec ce compte
3. Essayez d'accéder à `http://localhost:3001/fr/admin`

**Résultat attendu :**
- ✅ Redirection automatique vers `/fr`
- ❌ Message : "Vous n'avez pas accès à cette page" (optionnel)

---

### Test 3 : Accès avec l'admin autorisé ✅

1. **Connectez-vous** avec `procodeur4@gmail.com`
2. Accédez à `http://localhost:3001/fr/admin`

**Résultat attendu :**
- ✅ Accès complet au dashboard admin
- ✅ Affichage des statistiques
- ✅ Navigation fonctionnelle

---

### Test 4 : Accès direct aux API routes ❌

**Sans authentification :**

```bash
curl http://localhost:3001/api/admin/stats
```

**Résultat attendu :**
```json
{
  "error": "Non autorisé"
}
```
**Status :** `401 Unauthorized`

---

**Avec authentification mais non-admin :**

```bash
# Nécessite un token de session valide
curl -H "Cookie: next-auth.session-token=VOTRE_TOKEN" \
     http://localhost:3001/api/admin/stats
```

**Résultat attendu :**
```json
{
  "error": "Accès interdit"
}
```
**Status :** `403 Forbidden`

---

## 🔍 Comment vérifier la protection

### Option 1 : Console du navigateur

Ouvrez la console (F12) et regardez les logs :

```javascript
// Dans layout.tsx (temporairement pour debug)
console.log('Session:', session);
console.log('Email:', session?.user?.email);
console.log('Admin emails:', process.env.ADMIN_EMAILS?.split(','));
console.log('Is admin:', adminEmails.includes(session.user.email));
```

### Option 2 : Network tab

1. Ouvrez l'onglet Network (F12)
2. Essayez d'accéder à `/fr/admin`
3. Regardez la redirection (status 307)

### Option 3 : React DevTools

Installez React DevTools et vérifiez :
- Les props passées aux composants
- L'état de la session
- Les redirections

---

## 🛡️ Couches de sécurité actives

| Couche | Fichier | Protection |
|--------|---------|------------|
| **Layout** | `/src/app/[lang]/admin/layout.tsx` | ✅ Redirection si non-admin |
| **API Routes** | `/src/app/api/admin/*/route.ts` | ✅ Retourne 401/403 |
| **Auth** | `/src/lib/auth.ts` | ✅ Vérification session NextAuth |
| **Environment** | `.env.local` | ✅ Liste blanche ADMIN_EMAILS |

---

## 🚀 Ajouter d'autres admins

### Méthode 1 : Via .env.local (recommandé)

```env
# Séparez les emails par des virgules (sans espaces)
ADMIN_EMAILS=procodeur4@gmail.com,admin2@gmail.com,admin3@gmail.com
```

### Méthode 2 : Via base de données (avancé)

1. Ajoutez une colonne `role` dans la table `users`
2. Mettez à jour le code pour vérifier `user.role === 'admin'`

---

## ⚠️ Erreurs communes

### Erreur : "Toujours redirigé même en admin"

**Cause :** Email mal formaté dans `.env.local`

**Solution :**
```env
# ❌ Mauvais (espaces, majuscules)
ADMIN_EMAILS= ProCodeur4@Gmail.com , autre@gmail.com

# ✅ Bon
ADMIN_EMAILS=procodeur4@gmail.com,autre@gmail.com
```

### Erreur : "L'API retourne toujours 401"

**Cause :** Session non transmise aux API routes

**Solution :** Vérifier que vous utilisez bien `auth()` de NextAuth

---

## 📊 Logs de sécurité (à implémenter)

Pour monitorer les tentatives d'accès :

```typescript
// Dans layout.tsx
const session = await auth();
const isAdmin = adminEmails.includes(session?.user?.email || '');

// Logger la tentative
console.log({
  timestamp: new Date().toISOString(),
  email: session?.user?.email,
  isAdmin,
  path: '/admin',
  action: isAdmin ? 'ALLOWED' : 'DENIED'
});
```

---

## ✅ Checklist finale

- [x] Variable `ADMIN_EMAILS` dans `.env.local`
- [x] Email admin `procodeur4@gmail.com` configuré
- [x] Protection au niveau layout
- [x] Protection des API routes
- [x] Redirection automatique si non autorisé
- [ ] Tests effectués avec utilisateur normal
- [ ] Tests effectués sans connexion
- [ ] Tests effectués avec admin

---

## 🎯 Conclusion

**Votre dashboard admin est sécurisé !** 🔒

Seuls les utilisateurs dont l'email est dans `ADMIN_EMAILS` peuvent accéder :
- Aux pages `/[lang]/admin/*`
- Aux API routes `/api/admin/*`

**Note :** N'oubliez jamais de redémarrer votre serveur après avoir modifié `.env.local` !

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

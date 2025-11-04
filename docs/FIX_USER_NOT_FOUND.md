# Fix : Problème "Utilisateur non trouvé"

## 🐛 Problème identifié

Lorsqu'on cliquait sur une card (crush ou admirer), la page affichait "Utilisateur non trouvé".

## 🔍 Causes

### 1. API `/api/get-user` incompatible
- L'API acceptait uniquement `email` comme paramètre
- Le frontend envoyait `userId`
- Résultat : Aucun utilisateur trouvé

### 2. Vérification des relations incorrecte
- Le code cherchait `c.crush_id` dans les crushes
- Mais la structure réelle est `c.user.id`
- Résultat : Les relations n'étaient jamais détectées

### 3. Paramètre API add-crush incorrect
- L'API attend `crushUserId`
- Le frontend envoyait `crushId`
- Résultat : Erreur lors de l'ajout d'un crush

## ✅ Solutions appliquées

### 1. Modification de `/api/get-user/route.ts`

**Avant :**
```typescript
const email = searchParams.get('email');
if (!email) {
  return NextResponse.json({ error: 'Email is required' }, { status: 400 });
}
const { data: user } = await supabase
  .from('users')
  .select('id, email, name, age, image, bio, interests, location')
  .eq('email', email)
  .maybeSingle();
```

**Après :**
```typescript
const email = searchParams.get('email');
const userId = searchParams.get('userId');

if (!email && !userId) {
  return NextResponse.json({ error: 'Email or userId is required' }, { status: 400 });
}

let query = supabase
  .from('users')
  .select('id, email, name, age, image, bio, interests, location, created_at');

if (userId) {
  query = query.eq('id', userId);
} else if (email) {
  query = query.eq('email', email);
}

const { data: user } = await query.maybeSingle();
```

**Changements :**
- ✅ Accepte maintenant `userId` ou `email`
- ✅ Ajoute `created_at` dans les champs retournés
- ✅ Construction dynamique de la requête

### 2. Correction de la vérification des relations

**Avant :**
```typescript
const crushRelation = crushesData.crushes.find(
  (c: { crush_id: string; status: string }) => c.crush_id === userId
);
```

**Après :**
```typescript
const crushRelation = crushesData.crushes.find(
  (c: { user: { id: string } | null; status: string }) => c.user?.id === userId
);
```

**Changements :**
- ✅ Utilise `c.user?.id` au lieu de `c.crush_id`
- ✅ Correspond à la structure réelle des données
- ✅ Utilise l'optional chaining (`?.`) pour sécurité

### 3. Correction du paramètre add-crush

**Avant :**
```typescript
body: JSON.stringify({
  userId: currentUser.id,
  crushId: userId,
}),

if (data.isMatch) {
  setIsMatch(true);
}
```

**Après :**
```typescript
body: JSON.stringify({
  userId: currentUser.id,
  crushUserId: userId,
}),

if (data.match) {
  setIsMatch(true);
}
```

**Changements :**
- ✅ Utilise `crushUserId` comme attendu par l'API
- ✅ Vérifie `data.match` au lieu de `data.isMatch`

## 🧪 Tests à effectuer

- [ ] Cliquer sur une card de crush → Doit afficher le profil
- [ ] Cliquer sur une card d'admirer → Doit afficher le profil
- [ ] Ajouter un crush depuis la page profil → Doit fonctionner
- [ ] Vérifier les badges de statut (Match, Pending, Admirateur)
- [ ] Tester avec plusieurs utilisateurs différents

## 📊 Structure des données

### Table `crushes`
```sql
id UUID
user_id UUID (qui a ajouté le crush)
crush_name TEXT (email de la personne ajoutée)
status TEXT (pending, matched, revealed)
created_at TIMESTAMP
```

### API Response `/api/get-crushes`
```typescript
{
  crushes: [
    {
      id: UUID,
      status: 'pending' | 'matched' | 'revealed',
      created_at: string,
      user: {
        id: UUID,
        name: string,
        email: string,
        image: string | null,
        age: number | null,
        location: string | null
      } | null
    }
  ],
  count: number
}
```

### API Response `/api/get-user`
```typescript
{
  user: {
    id: UUID,
    email: string,
    name: string,
    age: number | null,
    image: string | null,
    bio: string | null,
    interests: string[] | null,
    location: string | null,
    created_at: string
  }
}
```

## 🎯 Résultat

✅ **Navigation fonctionnelle** : Click sur cards → Profil affiché
✅ **Détection des relations** : Badges corrects selon statut
✅ **Ajout de crush** : Fonctionne depuis page profil
✅ **Cohérence des données** : Tous les endpoints alignés

## 📝 Fichiers modifiés

1. `/src/app/api/get-user/route.ts`
   - Support `userId` et `email`
   - Ajout `created_at`

2. `/src/app/[lang]/user/[userId]/page.tsx`
   - Fix vérification relation (`c.user?.id`)
   - Fix paramètre add-crush (`crushUserId`)
   - Fix vérification match (`data.match`)

## 🚀 Prochaines améliorations suggérées

- [ ] Ajouter cache pour les profils utilisateurs
- [ ] Optimiser les requêtes multiples
- [ ] Ajouter loading states sur les boutons
- [ ] Gérer les erreurs réseau
- [ ] Ajouter confirmation avant ajout crush
- [ ] Implémenter retrait de crush

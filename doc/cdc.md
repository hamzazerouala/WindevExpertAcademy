CAHIER DES CHARGES : PLATEFORME LMS "WINDEV ELITE"
Version : 1.3
Date : 27 Novembre 2025
Cible de Développement : Agents IA Autonomes (100% No-Human-Intervention)
Niveau de Qualité : World-Class / Tier-1 (Performance, Sécurité, UX/UI)
1. VISION ET OBJECTIFS
1.1. Concept
Création d'une plateforme d'apprentissage en ligne (LMS) haut de gamme, type "Udemy", mais dédiée exclusivement à un instructeur unique. Le contenu se focalise sur l'écosystème PC SOFT (WinDev, WebDev, WinDev Mobile, HFSQL).
1.2. Objectifs Clés
Excellence UX/UI : Interface fluide, animations subtiles (framer-motion), support total du mode sombre/clair, et accessibilité WCAG 2.1 AA.
Sécurité Maximale : Protection inviolable des actifs vidéo (DRM/HLS Encrypted).
Scalabilité : Architecture capable de supporter une charge mondiale.
Internationalisation : Support natif du Français (Défaut), Anglais, et Arabe (RTL complet).
2. ARCHITECTURE TECHNIQUE (STACK IMPÉRATIVE)
Les agents IA doivent strictement respecter cette stack pour garantir la maintenabilité et la performance sur Coolify.
2.1. Frontend (Apprenant & Admin)
Framework : Next.js 14+ (App Router).
Langage : TypeScript (Mode Strict).
Styling : Tailwind CSS + shadcn/ui (pour des composants premium et cohérents).
State Management : Zustand ou React Query (TanStack Query) pour la gestion serveur/client.
Internationalisation : next-intl (Gestion stricte du routing et du switch LTR/RTL pour l'Arabe).
Lecteur Vidéo : Video.js ou Plyr personnalisé avec support HLS/DASH.
2.2. Backend (API)
Framework : NestJS (Architecture modulaire).
Langage : TypeScript.
API Type : RESTful (Documentation Swagger/OpenAPI obligatoire).
Validation : DTOs avec class-validator.
Authentification : JWT (Access Token + Refresh Token) avec rotation sécurisée via Cookies HttpOnly.
2.3. Base de Données & Stockage
Primaire : PostgreSQL (v16+).
ORM : Prisma (pour la sécurité des types).
Cache : Redis (Gestion des sessions, cache des requêtes fréquentes).
Stockage Fichiers (Images/PDF) : Compatible S3 (MinIO hébergé sur Coolify ou AWS S3).
2.4. Infrastructure & Déploiement (Coolify)
Conteneurisation : Docker (Multi-stage builds pour optimiser la taille des images).
Orchestration : Docker Compose.
Proxy Inverse : Traefik (géré par Coolify).
3. FONCTIONNALITÉS SPÉCIFIQUES & CRITIQUES
3.1. Système de Protection Vidéo (DRM & Anti-Téléchargement)
C'est le module le plus critique. L'IA doit implémenter un flux sécurisé.
Format : Streaming adaptatif HLS (m3u8).
Chiffrement : AES-128 Standard ou Clearkey DRM.
Workflow :
Upload de la vidéo MP4 par l'admin.
Transcodage automatique (via FFmpeg dans un worker queue type BullMQ) en segments .ts et manifeste .m3u8 avec différentes qualités (1080p, 720p, 480p).
Chiffrement des segments.
Distribution : Les URLs des segments ne sont accessibles que via des Signed Cookies ou des Tokens temporaires validés par le backend.
Détection des extensions navigateurs de téléchargement (Watermarking dynamique affichant l'ID/IP de l'utilisateur sur la vidéo de manière aléatoire).
3.2. Internationalisation (i18n) & RTL
Le système doit détecter la locale du navigateur.
Arabe (AR) : Bascule automatique de toute l'interface en dir="rtl".
Le contenu des cours (titres, descriptions) doit pouvoir être traduit dans les 3 langues dans le Backoffice (champs JSONB dans la DB pour le multilingue).
3.3. Module de Tchat Contextuel (Q&A)
Contrairement à un simple commentaire, le tchat est lié au contexte du cours.
L'étudiant pose une question sous une vidéo.
Option "Lier au timecode" : La question porte sur la minute 04:21.
Notification temps réel (WebSockets via socket.io ou Gateway NestJS) pour l'admin.
L'admin répond, l'étudiant est notifié.
Historique des questions/réponses visible par tous les étudiants (base de connaissance).
3.4. Classification des Formations & Monétisation
Le système gère trois typologies de formations distinctes, chacune avec ses règles d'accès.
Type 1 : Formation Gratuite (Free)
Accès : Immédiat pour tout membre inscrit (création de compte obligatoire).
CTA : "S'inscrire gratuitement".
Logique : Ajout automatique à "Mes Cours" au clic.
Type 2 : Formation sous Abonnement (Subscription)
Accès : Réservé aux membres ayant un abonnement actif ("Plan Pro" ou "Plan Mensuel/Annuel").
Logique Abonnement :
L'utilisateur achète du "Temps d'abonnement" (ex: 1 mois, 1 an).
Tant que subscriptionExpiresAt > now(), l'utilisateur a accès à tous les cours marqués "Abonnement".
À l'expiration : Accès verrouillé.
Type 3 : Formation Ciblée / Premium (Lifetime)
Accès : Achat unitaire obligatoire (Pay-per-course).
Particularité : Ces cours ne sont PAS inclus dans l'abonnement. Ce sont des "Masterclasses" ou produits spécifiques à haute valeur.
Durée : Accès à vie après achat.
3.5. Module de Paiement Géolocalisé (Algérie vs Monde)
Le système doit détecter automatiquement le pays de l'utilisateur (via IP) et adapter l'affichage des prix et les méthodes de paiement.
A. Détection Géographique & Devises
Middleware Frontend : Détection de l'IP (header x-forwarded-for ou API tierce).
Si Algérie (DZ) :
Affichage des prix en DZD (Dinar Algérien).
Taux de change fixe ou dynamique défini dans le Backoffice.
Si Reste du Monde :
Affichage des prix en EUR (€).
B. Méthodes de Paiement par Zone
Zone Algérie (DZ) - Paiement Hybride
Option 1 : Paiement en ligne (CIB / Edahabia)
Intégration de l'API Chargily.
Compatible pour : Achat unitaire ET Achat de période d'abonnement.
Option 2 : Paiement Hors-ligne (CCP / BaridiMob)
Affichage des coordonnées CCP.
Upload de preuve.
Validation Admin.
Zone Internationale - Paiement Full Digital
Passerelle : Stripe.
Abonnement : Gestion du "Recurring Billing" Stripe (Prélèvement automatique).
Achat unique : Paiement One-off.
C. Fonctionnalités Communes
Coupons : Applicables sur les achats unitaires et la première période d'abonnement.
Facturation : Génération automatique de PDF.
4. DESIGN UI/UX (WORLD CLASS STANDARDS)
4.1. Charte Graphique
Ambiance : Professionnelle, Tech, "Clean".
Palette : Inspirée des IDE modernes (VS Code, JetBrains) mais épurée. Accents de couleurs distincts pour différencier les technologies (ex: Jaune pour WinDev, Bleu pour WebDev).
Typography : Inter ou Geist Sans (Google Fonts).
4.2. Parcours Utilisateur
Landing Page : Hero section immersive. Section "Formations Gratuites" pour l'acquisition, "Premium" pour la conversion.
Page Cours :
Badges : "GRATUIT", "INCLUS ABONNEMENT", ou "PREMIUM".
Logique d'achat :
Si Abonnement : Bouton "S'abonner pour accéder" (si pas abonné).
Si Premium : Bouton "Acheter ce cours (Accès à vie)".
Tunnel de Commande (Checkout) :
Étape 1 : Récapitulatif.
Étape 2 (Si DZ) : Choix "Carte CIB/Edahabia" OU "Versement CCP".
Étape 2 (Si Monde) : Formulaire Stripe Elements.
5. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES
5.1. Backoffice Admin (Single Instructor)
Dashboard : Revenus (graphiques Recharts), État des abonnements actifs, Questions.
Course Builder : * Sélecteur de Type : Gratuit / Abonnement / Premium.
Si Premium : Définition du prix.
Gestion Abonnements :
Définition des plans (Mensuel / Annuel).
Prix EUR et Prix DZD.
Validation des Paiements (CCP) :
Validation manuelle des achats de cours ET des renouvellements d'abonnement.
5.2. Front Office Étudiant
Catalogue : Filtres par Type (Gratuit, Abo, Premium).
Zone Membre :
Mon Abonnement : État (Actif/Inactif), Date d'expiration, Bouton "Renouveler" (surtout pour CCP).
Mes Cours : Mélange les cours achetés, gratuits, et ceux de l'abonnement (tant qu'il est actif).
6. MODÈLE DE DONNÉES (SCHEMA PRISMA INDICATIF)
// Enumérations pour gérer la complexité des états
enum Role {
  STUDENT
  ADMIN
}

enum PaymentStatus {
  PENDING_PAYMENT // En attente d'action utilisateur
  PENDING_REVIEW  // (CCP) Reçu envoyé, en attente validation admin
  COMPLETED       // Payé et accès donné
  FAILED          // Échec paiement en ligne
  REJECTED        // (CCP) Preuve refusée par admin
  REFUNDED
}

enum PaymentProvider {
  STRIPE
  CHARGILY
  CCP_OFFLINE
}

enum Currency {
  EUR
  DZD
}

// NOUVEAU : Type d'accès au cours
enum CourseAccessType {
  FREE          // Gratuit pour inscrits
  SUBSCRIPTION  // Inclus dans l'abonnement
  PREMIUM       // Achat unique obligatoire (Lifetime)
}

// NOUVEAU : Type de produit acheté
enum ProductType {
  COURSE_LIFETIME
  SUBSCRIPTION_PERIOD // ex: 1 mois d'accès
}

model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  country           String?  // Code ISO (ex: DZ, FR)
  role              Role     @default(STUDENT)
  
  // Gestion Abonnement
  subscriptionEndsAt DateTime? // Si date > now(), l'utilisateur a l'accès "SUBSCRIPTION"
  
  purchases         Purchase[]
  progress          Progress[]
  messages          Message[]
}

model Course {
  id          String   @id @default(uuid())
  title       Json     // {fr: "", en: "", ar: ""}
  description Json
  
  // Configuration Accès
  accessType  CourseAccessType @default(PREMIUM)
  
  priceEur    Decimal?  // Requis si PREMIUM
  priceDzd    Decimal?  // Requis si PREMIUM
  
  thumbnail   String
  published   Boolean  @default(false)
  
  sections    Section[]
  purchases   Purchase[] // Achats "Lifetime" de ce cours
  coupons     Coupon[]
}

// Modèle pour définir les plans d'abonnement (ex: Mensuel, Annuel)
model SubscriptionPlan {
  id          String   @id @default(uuid())
  name        Json     // "Mensuel", "Annuel"
  durationDays Int     // 30, 365
  priceEur    Decimal
  priceDzd    Decimal
  isActive    Boolean  @default(true)
}

// ... (Section et Lesson restent inchangés) ...
model Section {
  id       String    @id @default(uuid())
  title    Json
  courseId String
  course   Course    @relation(fields: [courseId], references: [id])
  lessons  Lesson[]
  order    Int
}

model Lesson {
  id        String   @id @default(uuid())
  title     Json
  type      LessonType 
  videoUrl  String?
  duration  Int
  isFree    Boolean  @default(false) // Preview gratuite possible même sur cours payant
  sectionId String
  section   Section  @relation(fields: [sectionId], references: [id])
  messages  Message[]
}

model Coupon {
  id        String   @id @default(uuid())
  code      String   @unique
  discount  Decimal
  type      CouponType 
  expiresAt DateTime?
  maxUses   Int?
  usedCount Int      @default(0)
  
  // Peut s'appliquer à un cours spécifique OU à un plan d'abonnement
  courseId  String?
  course    Course?  @relation(fields: [courseId], references: [id])
}

model Purchase {
  id             String          @id @default(uuid())
  userId         String
  user           User            @relation(fields: [userId], references: [id])
  
  // Polymorphisme de l'achat : Soit un cours, soit un temps d'abonnement
  productType    ProductType
  
  courseId       String?         // Rempli si ProductType == COURSE_LIFETIME
  course         Course?         @relation(fields: [courseId], references: [id])
  
  subscriptionDurationDays Int?  // Rempli si ProductType == SUBSCRIPTION_PERIOD
  
  amount         Decimal         
  currency       Currency        @default(EUR)
  
  provider       PaymentProvider 
  status         PaymentStatus   @default(PENDING_PAYMENT)
  
  transactionId  String?         
  receiptUrl     String?         
  rejectionReason String?        
  
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model Message {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  parentId  String?
  timecode  Int?
}


7. DIRECTIVES DE DÉPLOIEMENT (COOLIFY)
Pour que l'IA génère les fichiers de déploiement corrects :
Dockerfile (Frontend) : Utiliser node:alpine en multi-stage. Générer les assets statiques avec next build. Standalone output recommandé.
Dockerfile (Backend) : node:alpine. Build nestjs.
docker-compose.yml :
Service db (Postgres).
Service redis (Redis).
Service backend (NestJS).
Service frontend (NextJS).
Service worker (Pour le transcodage vidéo FFmpeg).
Volumes persistants pour DB et uploads locaux (si pas S3).
8. INSTRUCTIONS SPÉCIALES POUR LES AGENTS IA
Règle 1 : Ne jamais utiliser de texte en dur (Hardcoded). Tout texte doit passer par les clés de traduction (i18n).
Règle 2 : Pour le code WinDev/WLangage affiché dans les cours ou les descriptions, utiliser un highlighter de syntaxe personnalisé ou compatible (prismjs/highlight.js configuré pour WLangage).
Règle 3 : La gestion des erreurs doit être silencieuse pour l'utilisateur (Toasts élégants) mais loggée en détail côté serveur.
Règle 4 : Performance First. Le score Lighthouse doit être > 90/100 sur toutes les pages. Utiliser next/image impérativement.
Règle 5 (Paiement) : Sécuriser rigoureusement les webhooks (Stripe et Chargily) en vérifiant les signatures cryptographiques pour éviter les fausses validations de commande.
FIN DU CAHIER DES CHARGES

SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES : MODULE "SECURE VIDEO PIPELINE"
Projet : LMS WinDev Elite
Module : Protection & Streaming Vidéo
Version : 1.0
Destinataire : Agents IA de Développement (Backend & DevOps)
1. OBJECTIF TECHNIQUE
Empêcher le téléchargement direct (IDM, wget), le partage de liens et dissuader l'enregistrement d'écran (Screen Recording) via une architecture de streaming adaptatif chiffrée et une authentification forte.
2. ARCHITECTURE DU PIPELINE VIDÉO
Le flux se divise en deux phases : Ingestion (Upload/Process) et Distribution (Playback).
2.1. Diagramme de Séquence (Logique)
Admin Upload -> API (Multipart) -> Stockage Temporaire.
Job Queue -> Worker FFmpeg récupère le fichier brut.
Transcoding -> Génération des segments HLS (.ts) + Fichiers de clés (.key).
Encryption -> Chiffrement AES-128 de chaque segment.
Storage -> Déplacement vers Stockage Privé (S3/MinIO) - Aucun accès public.
Playback Request -> Client demande lecture -> API vérifie droits.
Delivery -> API génère un Signed Cookie/Token -> Nginx/Traefik sert les segments.
3. SPÉCIFICATIONS D'IMPLÉMENTATION (BACKEND - NESTJS)
3.1. Moteur de Transcodage (FFmpeg Worker)
Le worker doit utiliser fluent-ffmpeg ou appeler le binaire ffmpeg directement.
Commande FFmpeg Standard (à adapter par l'IA) :
L'IA doit générer une commande qui produit :
Un fichier Master Playlist (master.m3u8) référençant les variantes.
Des playlists variantes (1080p, 720p, 480p).
Des segments chiffrés.
Paramètres Critiques de Chiffrement :
Algorithme : AES-128.
Key Rotation : Une clé unique par leçon (simplifie la gestion) OU une clé par rotation de segments (plus sécurisé mais complexe). Choix retenu : Une clé unique par vidéo (suffisant).
Fichier key_info : FFmpeg nécessite un fichier formaté ainsi :
[https://api.monsite.com/videos/key/](https://api.monsite.com/videos/key/){videoId}  <-- URL que le player appellera
/path/to/local/enc.key                        <-- Chemin local de la clé binaire
optional_iv                                   <-- Vecteur d'initialisation (Hex)


3.2. Gestion des Clés de Chiffrement (Key Management Service - KMS)
Génération : À chaque upload, le backend génère une clé binaire aléatoire de 16 octets (openssl rand 16).
Stockage : La clé binaire est stockée dans le stockage S3 privé (ou en base de données encodée en base64), associée à l'ID de la leçon.
Endpoint de Délivrance (GET /videos/key/:videoId) :
Ce endpoint est le plus sécurisé du système.
Il vérifie le JWT de l'utilisateur.
Il vérifie si l'utilisateur a acheté le cours (via Prisma).
Il retourne la clé binaire avec le header Content-Type: application/octet-stream.
Si pas de droit : Retourne 403 Forbidden.
3.3. Protection des Segments (.ts) et Manifestes (.m3u8)
Les fichiers stockés sur S3/MinIO ne doivent pas être publics.
Utiliser des Presigned URLs à courte durée de vie (ex: 1 heure) générées par le backend lors de l'initialisation du lecteur.
Alternative (Coolify/Self-hosted) : Configurer un endpoint Proxy dans NestJS ou Nginx qui vérifie le cookie de session avant de servir le fichier statique depuis le volume disque/S3.
4. SPÉCIFICATIONS D'IMPLÉMENTATION (FRONTEND - NEXT.JS)
4.1. Lecteur Vidéo Sécurisé
Utilisation de video.js ou plyr configuré pour HLS.
Override XHR : Le lecteur doit être configuré pour inclure le header Authorization: Bearer <token> ou envoyer les cookies withCredentials: true lors de la requête de la clé de déchiffrement (le fichier .key).
Désactivation du clic droit : Sur le wrapper vidéo (onContextMenu={(e) => e.preventDefault()}).
4.2. Watermarking Dynamique (Anti-Screen Recording)
Pour dissuader la capture via OBS ou QuickTime.
Technique : Superposition d'un élément DOM (div) transparent.
Contenu : Affiche l'ID de l'utilisateur, son IP ou son Email.
Comportement ("Bouncing DVD Logo") :
Position absolue qui change aléatoirement toutes les 5 à 10 secondes.
Opacité faible (0.3) pour ne pas gêner, mais visible à l'enregistrement.
pointer-events: none (pour permettre de cliquer sur la vidéo au travers).
4.3. Protection contre la modification du DOM (Tamper Proofing)
Si un utilisateur "malin" ouvre la console DevTools pour supprimer le div du watermark :
Utiliser MutationObserver en JavaScript.
Surveiller le nœud parent du lecteur vidéo.
Règle : Si le nœud du watermark est supprimé ou si son style (opacité/display) est modifié -> Arrêt immédiat de la lecture vidéo (call player.pause() et suppression de la source) + Envoi d'une alerte "Suspicious Activity" au backend.
5. FLUX DE SÉCURITÉ RÉSUMÉ (WORKFLOW)
L'utilisateur arrive sur la page cours/windev-101/lecon-2.
Next.js (Server Component) : Vérifie l'abonnement/achat. Si OK, génère un token temporaire signé (JWT court spécifique vidéo).
Front : Initialise le Player avec l'URL du master playlist : src="/api/stream/{videoId}/master.m3u8?token=xyz".
Player : Télécharge le .m3u8. Il lit que le contenu est chiffré et voit l'URI de la clé : /api/stream/key/{videoId}.
Player : Appelle l'URL de la clé avec le token.
Backend : Valide le token -> Envoie la clé binaire.
Player : Utilise la clé pour déchiffrer les segments .ts à la volée et afficher l'image.
Overlay : Le script client affiche l'email de l'utilisateur en filigrane mouvant.
6. CONTRAINTES DE PERFORMANCE
Les segments vidéo .ts doivent être servis via un cache ou un CDN pour éviter de saturer le serveur Node.js backend.
Le transcodage doit se faire en arrière-plan (Queue BullMQ) pour ne pas bloquer l'upload.
FIN DES SPÉCIFICATIONS VIDÉO

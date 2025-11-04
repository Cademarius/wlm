#!/bin/bash

# Script d'optimisation de l'image background
# Crée plusieurs versions optimisées pour différents appareils

BACKGROUND_PATH="public/images/ui/background.webp"
OUTPUT_DIR="public/images/ui"

echo "🎨 Optimisation de l'image background..."

# Vérifier si ImageMagick ou sharp-cli est installé
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick trouvé"
    
    # Mobile (640px de large)
    echo "📱 Génération version mobile..."
    convert "$BACKGROUND_PATH" -resize 640x -quality 75 "$OUTPUT_DIR/background-mobile.webp"
    
    # Tablet (1024px de large)
    echo "📱 Génération version tablet..."
    convert "$BACKGROUND_PATH" -resize 1024x -quality 80 "$OUTPUT_DIR/background-tablet.webp"
    
    # Desktop (1920px de large)
    echo "🖥️  Génération version desktop..."
    convert "$BACKGROUND_PATH" -resize 1920x -quality 85 "$OUTPUT_DIR/background-desktop.webp"
    
    # Version optimisée par défaut
    echo "🔧 Optimisation version par défaut..."
    convert "$BACKGROUND_PATH" -resize 1920x -quality 80 "$OUTPUT_DIR/background-optimized.webp"
    
    echo "✅ Optimisation terminée!"
    echo ""
    echo "📊 Tailles des fichiers:"
    ls -lh "$OUTPUT_DIR"/background*.webp
    
elif command -v npm &> /dev/null; then
    echo "⚠️  ImageMagick non trouvé. Installation de sharp-cli..."
    npm install -g sharp-cli
    
    echo "📱 Utilisation de sharp pour l'optimisation..."
    
    # Mobile
    sharp -i "$BACKGROUND_PATH" -o "$OUTPUT_DIR/background-mobile.webp" resize 640 -q 75
    
    # Tablet
    sharp -i "$BACKGROUND_PATH" -o "$OUTPUT_DIR/background-tablet.webp" resize 1024 -q 80
    
    # Desktop
    sharp -i "$BACKGROUND_PATH" -o "$OUTPUT_DIR/background-desktop.webp" resize 1920 -q 85
    
    echo "✅ Optimisation terminée avec sharp!"
    
else
    echo "❌ Aucun outil d'optimisation trouvé."
    echo "Installez ImageMagick : sudo apt install imagemagick"
    echo "Ou sharp-cli : npm install -g sharp-cli"
    exit 1
fi

echo ""
echo "🎯 Pour utiliser les images optimisées, mettez à jour next.config.ts"
echo "   avec le support des images responsive."

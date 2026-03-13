#!/bin/bash

# BMAD Claude Skills Installer
# This script creates symlinks from the root project to this submodule:
# 1. .claude/skills/bmad-*/ -> submodule/.claude/skills/bmad-*/ (개별 디렉토리 심링크)
#    Only symlinks are managed; user-created regular directories matching bmad-* are preserved
#    (user-created symlinks matching bmad-* will be removed during cleanup)
# 2. _bmad -> submodule/_bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (argument or parent of submodule)
if [ -n "$1" ]; then
  ROOT_PROJECT="$(cd "$1" && pwd)"
else
  ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

# Get the submodule directory name (for relative paths)
SUBMODULE_NAME="$(basename "$SCRIPT_DIR")"

# === 1. .claude/skills/bmad-* symlinks ===
TARGET_SKILLS_DIR="$ROOT_PROJECT/.claude/skills"
mkdir -p "$TARGET_SKILLS_DIR"

shopt -s nullglob

# --- Validate source bmad-* directories exist ---
SOURCE_BMAD_DIRS=("$SCRIPT_DIR"/.claude/skills/bmad-*)
if [ ${#SOURCE_BMAD_DIRS[@]} -eq 0 ]; then
    echo "Error: No bmad-* skill directories found in $SCRIPT_DIR/.claude/skills/"
    exit 1
fi

# --- Clean up existing bmad-* symlinks only ---
REMOVED_COUNT=0
for item in "$TARGET_SKILLS_DIR"/bmad-*; do
    if [ -L "$item" ]; then
        rm "$item"
        REMOVED_COUNT=$((REMOVED_COUNT + 1))
    fi
done
if [ "$REMOVED_COUNT" -gt 0 ]; then
    echo "Removed $REMOVED_COUNT existing bmad-* symlinks"
fi

# --- Create individual bmad-* symlinks ---
LINK_COUNT=0
for item in "${SOURCE_BMAD_DIRS[@]}"; do
    name="$(basename "$item")"
    ln -s "../../$SUBMODULE_NAME/.claude/skills/$name" "$TARGET_SKILLS_DIR/$name"
    LINK_COUNT=$((LINK_COUNT + 1))
done

shopt -u nullglob

echo "Created $LINK_COUNT symlinks in $TARGET_SKILLS_DIR"

# === 2. _bmad symlink ===
SOURCE_BMAD="$SCRIPT_DIR/_bmad"
RELATIVE_SOURCE_BMAD="$SUBMODULE_NAME/_bmad"
TARGET_BMAD="$ROOT_PROJECT/_bmad"

if [ ! -d "$SOURCE_BMAD" ]; then
    echo "Error: Source directory not found: $SOURCE_BMAD"
    exit 1
fi

if [ -e "$TARGET_BMAD" ] || [ -L "$TARGET_BMAD" ]; then
    echo "Removing existing: $TARGET_BMAD"
    rm -rf "$TARGET_BMAD"
fi

ln -s "$RELATIVE_SOURCE_BMAD" "$TARGET_BMAD"
echo "Created symlink: $TARGET_BMAD -> $RELATIVE_SOURCE_BMAD"

echo ""
echo "BMAD installation complete!"

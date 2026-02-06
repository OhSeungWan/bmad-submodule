#!/bin/bash

# BMAD Claude Commands Installer
# This script creates symlinks from the root project to this submodule:
# 1. .claude/commands/bmad-* -> submodule/.claude/commands/bmad-* (개별 파일 심링크)
#    .claude/commands/bmad   -> submodule/.claude/commands/bmad   (서브디렉토리 심링크)
#    Only symlinks are managed; user-created regular files matching bmad-* are preserved
#    (user-created symlinks matching bmad-* will be removed during cleanup)
# 2. _bmad -> submodule/_bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (parent of submodule)
ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get the submodule directory name (for relative paths)
SUBMODULE_NAME="$(basename "$SCRIPT_DIR")"

# === 1. .claude/commands/bmad-* and bmad/ symlinks ===
TARGET_COMMANDS_DIR="$ROOT_PROJECT/.claude/commands"
mkdir -p "$TARGET_COMMANDS_DIR"

shopt -s nullglob

# --- Validate source bmad-* files exist ---
SOURCE_BMAD_FILES=("$SCRIPT_DIR"/.claude/commands/bmad-*)
if [ ${#SOURCE_BMAD_FILES[@]} -eq 0 ]; then
    echo "Error: No bmad-* command files found in $SCRIPT_DIR/.claude/commands/"
    exit 1
fi

# --- Backward compatibility: clean up old directory symlink ---
if [ -L "$TARGET_COMMANDS_DIR/bmad" ]; then
    echo "Removing legacy symlink: $TARGET_COMMANDS_DIR/bmad"
    rm "$TARGET_COMMANDS_DIR/bmad"
elif [ -d "$TARGET_COMMANDS_DIR/bmad" ]; then
    echo "Warning: $TARGET_COMMANDS_DIR/bmad is a real directory (not a symlink). Skipping."
fi

# --- Clean up existing bmad-* symlinks only ---
REMOVED_COUNT=0
for item in "$TARGET_COMMANDS_DIR"/bmad-*; do
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
for item in "${SOURCE_BMAD_FILES[@]}"; do
    name="$(basename "$item")"
    ln -s "../../$SUBMODULE_NAME/.claude/commands/$name" "$TARGET_COMMANDS_DIR/$name"
    LINK_COUNT=$((LINK_COUNT + 1))
done

# --- Create bmad/ subdirectory symlink ---
if [ -d "$SCRIPT_DIR/.claude/commands/bmad" ] && [ ! -e "$TARGET_COMMANDS_DIR/bmad" ]; then
    ln -s "../../$SUBMODULE_NAME/.claude/commands/bmad" "$TARGET_COMMANDS_DIR/bmad"
    LINK_COUNT=$((LINK_COUNT + 1))
    echo "Created symlink: $TARGET_COMMANDS_DIR/bmad -> ../../$SUBMODULE_NAME/.claude/commands/bmad"
elif [ -d "$SCRIPT_DIR/.claude/commands/bmad" ] && [ -d "$TARGET_COMMANDS_DIR/bmad" ]; then
    echo "Skipped bmad/ symlink: target is a real directory"
fi

shopt -u nullglob

echo "Created $LINK_COUNT symlinks in $TARGET_COMMANDS_DIR"

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

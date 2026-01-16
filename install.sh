#!/bin/bash

# BMAD Claude Commands Installer
# This script creates symlinks from the root project to this submodule:
# 1. .claude/commands/bmad -> submodule/.claude/commands/bmad
# 2. _bmad -> submodule/_bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (parent of submodule)
ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"

# === 1. .claude/commands/bmad symlink ===
SOURCE_COMMANDS="$SCRIPT_DIR/.claude/commands/bmad"
TARGET_COMMANDS_DIR="$ROOT_PROJECT/.claude/commands"
TARGET_COMMANDS="$TARGET_COMMANDS_DIR/bmad"

if [ ! -d "$SOURCE_COMMANDS" ]; then
    echo "Error: Source directory not found: $SOURCE_COMMANDS"
    exit 1
fi

mkdir -p "$TARGET_COMMANDS_DIR"

if [ -e "$TARGET_COMMANDS" ] || [ -L "$TARGET_COMMANDS" ]; then
    echo "Removing existing: $TARGET_COMMANDS"
    rm -rf "$TARGET_COMMANDS"
fi

ln -s "$SOURCE_COMMANDS" "$TARGET_COMMANDS"
echo "Created symlink: $TARGET_COMMANDS -> $SOURCE_COMMANDS"

# === 2. _bmad symlink ===
SOURCE_BMAD="$SCRIPT_DIR/_bmad"
TARGET_BMAD="$ROOT_PROJECT/_bmad"

if [ ! -d "$SOURCE_BMAD" ]; then
    echo "Error: Source directory not found: $SOURCE_BMAD"
    exit 1
fi

if [ -e "$TARGET_BMAD" ] || [ -L "$TARGET_BMAD" ]; then
    echo "Removing existing: $TARGET_BMAD"
    rm -rf "$TARGET_BMAD"
fi

ln -s "$SOURCE_BMAD" "$TARGET_BMAD"
echo "Created symlink: $TARGET_BMAD -> $SOURCE_BMAD"

echo ""
echo "BMAD installation complete!"

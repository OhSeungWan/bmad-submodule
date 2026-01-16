#!/bin/bash

# BMAD Claude Commands Installer
# This script creates a symlink from the root project's .claude/commands/bmad
# to this submodule's .claude/commands/bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_PATH="$SCRIPT_DIR/.claude/commands/bmad"

# Get the root project path (parent of submodule)
ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$ROOT_PROJECT/.claude/commands"
TARGET_PATH="$TARGET_DIR/bmad"

# Check if source exists
if [ ! -d "$SOURCE_PATH" ]; then
    echo "Error: Source directory not found: $SOURCE_PATH"
    exit 1
fi

# Create target directory if not exists
mkdir -p "$TARGET_DIR"

# Remove existing bmad folder/symlink
if [ -e "$TARGET_PATH" ] || [ -L "$TARGET_PATH" ]; then
    echo "Removing existing: $TARGET_PATH"
    rm -rf "$TARGET_PATH"
fi

# Create symlink
ln -s "$SOURCE_PATH" "$TARGET_PATH"

echo "Successfully created symlink:"
echo "  $TARGET_PATH -> $SOURCE_PATH"

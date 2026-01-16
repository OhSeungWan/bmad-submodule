#!/bin/bash

# BMAD Claude Commands Uninstaller
# This script removes symlinks from the root project:
# 1. .claude/commands/bmad
# 2. _bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (parent of submodule)
ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Function to remove a symlink or directory
remove_target() {
    local target="$1"
    local name="$2"

    if [ -L "$target" ]; then
        rm "$target"
        echo "Removed symlink: $target"
    elif [ -e "$target" ]; then
        echo "Warning: $target exists but is not a symlink."
        read -p "Remove anyway? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            rm -rf "$target"
            echo "Removed: $target"
        else
            echo "Skipped: $target"
        fi
    else
        echo "Nothing to remove: $target does not exist."
    fi
}

# === 1. Remove .claude/commands/bmad ===
echo "=== Removing .claude/commands/bmad ==="
remove_target "$ROOT_PROJECT/.claude/commands/bmad" "commands/bmad"

# === 2. Remove _bmad ===
echo "=== Removing _bmad ==="
remove_target "$ROOT_PROJECT/_bmad" "_bmad"

echo ""
echo "BMAD uninstallation complete!"

#!/bin/bash

# BMAD Claude Commands Uninstaller
# This script removes the symlink from the root project's .claude/commands/bmad

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (parent of submodule)
ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_PATH="$ROOT_PROJECT/.claude/commands/bmad"

# Check if target exists
if [ -L "$TARGET_PATH" ]; then
    rm "$TARGET_PATH"
    echo "Successfully removed symlink: $TARGET_PATH"
elif [ -e "$TARGET_PATH" ]; then
    echo "Warning: $TARGET_PATH exists but is not a symlink."
    read -p "Remove anyway? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        rm -rf "$TARGET_PATH"
        echo "Removed: $TARGET_PATH"
    else
        echo "Aborted."
        exit 1
    fi
else
    echo "Nothing to remove: $TARGET_PATH does not exist."
fi

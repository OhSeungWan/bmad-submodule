#!/bin/bash

# BMAD Claude Commands Uninstaller
# This script removes symlinks from the root project:
# 1. .claude/commands/bmad (directory symlink)
# 2. .claude/commands/bmad-* (individual file symlinks)
# 3. _bmad
# 4. post-checkout hook BMAD section

set -e

# Get the directory where this script is located (submodule path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the root project path (argument or parent of submodule)
if [ -n "$1" ]; then
  ROOT_PROJECT="$(cd "$1" && pwd)"
else
  ROOT_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

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

# === 2. Remove individual bmad-* symlinks ===
echo "=== Removing .claude/commands/bmad-* symlinks ==="
REMOVED=0
for item in "$ROOT_PROJECT/.claude/commands"/bmad-*; do
    if [ -L "$item" ]; then
        rm "$item"
        REMOVED=$((REMOVED + 1))
    fi
done
echo "Removed $REMOVED bmad-* symlinks"

# === 3. Remove _bmad ===
echo "=== Removing _bmad ==="
remove_target "$ROOT_PROJECT/_bmad" "_bmad"

# === 4. Remove post-checkout hook BMAD section ===
echo "=== Removing post-checkout hook BMAD section ==="
GIT_COMMON_DIR="$(git rev-parse --git-common-dir 2>/dev/null)"
if [ -z "$GIT_COMMON_DIR" ]; then
    echo "Not a git repository or git too old. Skipping hook removal."
else
HOOK_DIR="$GIT_COMMON_DIR/hooks"
HOOK_FILE="$HOOK_DIR/post-checkout"
if [ -f "$HOOK_FILE" ]; then
    sed -i.bak '/# BMAD-POST-CHECKOUT-START/,/# BMAD-POST-CHECKOUT-END/d' "$HOOK_FILE"
    rm -f "$HOOK_FILE.bak"
    # Remove file if empty or only has shebang
    if [ ! -s "$HOOK_FILE" ] || [ "$(grep -cv '^[[:space:]]*$\|^#!' "$HOOK_FILE")" -eq 0 ]; then
        rm "$HOOK_FILE"
        echo "Removed empty post-checkout hook"
    else
        echo "Removed BMAD section from post-checkout hook"
    fi
else
    echo "No post-checkout hook found"
fi
fi

echo ""
echo "BMAD uninstallation complete!"

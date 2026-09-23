#!/usr/bin/env bash
# Install dsh-client-ui-session-pin into the active DSH profile:
#   1. copy the package (package.json + prebuilt lib/) into the profile's
#      healed node_modules fallback ($DSH_HOME/profiles/node_modules)
#   2. append one `insert` row to the profile's cordis.patch.yml (idempotent)
#
# Requires a GUI build that contains the core mount points
# (sidebar.workspaces.sections / sidebar.workspaces.sessionActions slots and
# the pin icons); on a released npm dsh the client bundle fails to load.
#
# Environment:
#   DSH_HOME     profile root (default: ~/.dsh)
#   DSH_PROFILE  profile name (default: web)
set -euo pipefail

DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
DSH_PROFILE="${DSH_PROFILE:-web}"
PKG_NAME='@deepseek-ai/dsh-client-ui-session-pin'
PKG_ID='ui-session-pin'

SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST_DIR="$DSH_HOME/profiles/node_modules/$PKG_NAME"
PATCH_FILE="$DSH_HOME/profiles/$DSH_PROFILE/cordis.patch.yml"

if [ ! -f "$SRC_DIR/lib/client.js" ]; then
  echo "error: $SRC_DIR/lib/client.js not found — run this from a complete checkout" >&2
  exit 1
fi
if [ ! -f "$PATCH_FILE" ]; then
  echo "error: $PATCH_FILE not found — set DSH_HOME/DSH_PROFILE to your profile" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC_DIR/package.json" "$DEST_DIR/"
rm -rf "$DEST_DIR/lib"
cp -r "$SRC_DIR/lib" "$DEST_DIR/lib"
echo "copied $PKG_NAME → $DEST_DIR"

if grep -q "$PKG_NAME" "$PATCH_FILE"; then
  echo "cordis.patch.yml already references $PKG_NAME — left unchanged"
else
  cat >> "$PATCH_FILE" << 'EOF'

# Sidebar: pinned-sessions board and per-row pin toggle
# (dsh-client-ui-session-pin). Remove this row to uninstall.
- insert:
    - id: ui-session-pin
      name: '@deepseek-ai/dsh-client-ui-session-pin'
EOF
  echo "appended the $PKG_ID insert row to $PATCH_FILE"
fi

cat << EOF
done. restart the GUI (or refresh the page) to load the plugin.
note: the running GUI must include the core mount points — see README "Requirements".
EOF

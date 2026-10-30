#!/usr/bin/env bash
# design-nexus installer.
#   ./install.sh claude  [--global | <project-dir>]   -> ~/.claude/skills/design-nexus or <dir>/.claude/skills/design-nexus
#   ./install.sh codex   [--global | <project-dir>]   -> ~/.agents/skills + ~/.codex/AGENTS.md, or <dir>/.agents/skills + <dir>/AGENTS.md
#   ./install.sh cursor  <project-dir>                -> <dir>/.cursor/rules/design-nexus.mdc + <dir>/.cursor/design-nexus/
#   ./install.sh all     <project-dir>                -> all three into one project
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
command -v node >/dev/null || { echo "Node 18+ is required (the skill's checks run on Node)."; exit 1; }
node "$HERE/scripts/build.mjs" >/dev/null
DIST="$HERE/dist"

usage() { sed -n '2,6p' "$0" | sed 's/^# \{0,1\}//'; exit 1; }
[ $# -ge 1 ] || usage
tool="$1"; target="${2:-}"

# Replace the design-nexus block in an AGENTS.md, or append it.
merge_agents() {
  local file="$1" block="$DIST/codex/AGENTS.md"
  mkdir -p "$(dirname "$file")"; touch "$file"
  node -e '
    const fs = require("fs"); const [file, blockFile] = process.argv.slice(1);
    const block = fs.readFileSync(blockFile, "utf8").trim();
    let text = fs.readFileSync(file, "utf8");
    const re = /<!-- design-nexus:start -->[\s\S]*?<!-- design-nexus:end -->/;
    text = re.test(text) ? text.replace(re, block) : (text.trim() ? text.trimEnd() + "\n\n" : "") + block + "\n";
    fs.writeFileSync(file, text);
  ' "$file" "$block"
}

install_claude() {
  local dest
  if [ "$1" = "--global" ]; then dest="$HOME/.claude/skills"; else dest="$1/.claude/skills"; fi
  mkdir -p "$dest"; rm -rf "$dest/design-nexus"; cp -R "$DIST/claude/design-nexus" "$dest/"
  echo "Claude Code: $dest/design-nexus"
}
install_codex() {
  if [ "$1" = "--global" ]; then
    mkdir -p "$HOME/.agents/skills"; rm -rf "$HOME/.agents/skills/design-nexus"
    cp -R "$DIST/codex/.agents/skills/design-nexus" "$HOME/.agents/skills/"
    sed 's#`\.agents/skills/design-nexus#`~/.agents/skills/design-nexus#g; s#node \.agents/skills#node ~/.agents/skills#g' "$DIST/codex/AGENTS.md" > "$DIST/codex/AGENTS.global.md"
    cp "$DIST/codex/AGENTS.global.md" "$DIST/codex/AGENTS.md"
    merge_agents "${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
    echo "Codex: ~/.agents/skills/design-nexus + ${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
  else
    mkdir -p "$1/.agents/skills"; rm -rf "$1/.agents/skills/design-nexus"
    cp -R "$DIST/codex/.agents/skills/design-nexus" "$1/.agents/skills/"
    merge_agents "$1/AGENTS.md"
    echo "Codex: $1/.agents/skills/design-nexus + $1/AGENTS.md"
  fi
}
install_cursor() {
  mkdir -p "$1/.cursor/rules"; rm -rf "$1/.cursor/design-nexus"
  cp "$DIST/cursor/.cursor/rules/design-nexus.mdc" "$1/.cursor/rules/"
  cp -R "$DIST/cursor/.cursor/design-nexus" "$1/.cursor/"
  echo "Cursor: $1/.cursor/rules/design-nexus.mdc + $1/.cursor/design-nexus/"
}

case "$tool" in
  claude) install_claude "${target:---global}" ;;
  codex)  install_codex "${target:---global}" ;;
  cursor) [ -n "$target" ] || usage; install_cursor "$target" ;;
  all)    [ -n "$target" ] && [ "$target" != "--global" ] || usage
          install_claude "$target"; install_codex "$target"; install_cursor "$target" ;;
  *) usage ;;
esac
echo "Add .design-nexus/shots/ to the project's .gitignore if you use the render check."

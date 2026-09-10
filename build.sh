#!/bin/bash
# Regenerates data/tools.js from the tools/*/tool.json manifests.
cd "$(dirname "$0")"
node scripts/build-tools.js

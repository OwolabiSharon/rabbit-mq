#!/bin/bash
set -e
set -x
if [ "$RUN_MIGRATIONS" ]; then
  echo "RUNNING MIGRATIONS";
  yarn run typeorm:migration:run
  #options for seeding
fi
echo "START SERVER";
npm run start:prod
#!/bin/bash
set -e

export RAILWAY_TOKEN=b57cc17e-2643-41e0-925d-d270c310bf7f

echo "🚂 Creating Railway project for ClawCortex backend..."

# Create project via API
PROJECT_RESPONSE=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { projectCreate(input: { name: \"ClawCortex-Backend\" }) { id name } }"
  }')

echo "Response: $PROJECT_RESPONSE"

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -oP '(?<="id":")[^"]+' | head -1)

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Failed to create project"
  exit 1
fi

echo "✅ Project created: $PROJECT_ID"
echo "PROJECT_ID=$PROJECT_ID" > .railway-project-id

# Save to env
echo "RAILWAY_PROJECT_ID=$PROJECT_ID" >> /data/.openclaw/.env

echo "✅ Railway project ready!"
echo "Next: Link GitHub repo and configure environment variables"

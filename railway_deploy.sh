#!/bin/bash
set -e

export RAILWAY_TOKEN=b57cc17e-2643-41e0-925d-d270c310bf7f
PROJECT_ID="4435ddd3-cfbe-4ec7-bff1-10c9b90be843"

echo "🔗 Configuring Railway deployment..."

# Create service in project
SERVICE_RESPONSE=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { serviceCreate(input: { projectId: \\\"$PROJECT_ID\\\", name: \\\"backend\\\" }) { id name } }\"
  }")

echo "Service response: $SERVICE_RESPONSE"

SERVICE_ID=$(echo "$SERVICE_RESPONSE" | grep -oP '(?<="id":")[^"]+' | head -1)

if [ -z "$SERVICE_ID" ]; then
  echo "❌ Failed to create service"
  exit 1
fi

echo "✅ Service created: $SERVICE_ID"
echo "SERVICE_ID=$SERVICE_ID" >> .railway-project-id

echo ""
echo "✅ Railway service ready!"
echo "Project ID: $PROJECT_ID"
echo "Service ID: $SERVICE_ID"
echo ""
echo "Next steps:"
echo "1. Connect GitHub repo in Railway dashboard"
echo "2. Set environment variables (already in Railway UI)"
echo "3. Deploy!"

#!/usr/bin/env bash
# Run on the Hetzner server to check bot status: bash /opt/kenneth-stocks/kenneth-stocks/healthcheck.sh

echo "===== kenneth-stocks status ====="
echo ""

# Docker container
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "kenneth-stocks"; then
    echo "✅ Container:  RUNNING"
    UPTIME=$(docker inspect --format='{{.State.StartedAt}}' kenneth-stocks 2>/dev/null | cut -c1-19 | tr 'T' ' ')
    echo "   Started:   $UPTIME UTC"
else
    echo "❌ Container:  NOT RUNNING"
    echo "   Fix: cd /opt/kenneth-stocks/kenneth-stocks && docker compose up -d --build"
fi
echo ""

# .env check
ENV_FILE="/opt/kenneth-stocks/kenneth-stocks/.env"
if [ -f "$ENV_FILE" ]; then
    echo "✅ .env:       EXISTS"
    for key in ANTHROPIC_API_KEY POSTMARK_API_KEY FRED_API_KEY ALPHA_VANTAGE_KEY REPORT_EMAIL; do
        val=$(grep "^${key}=" "$ENV_FILE" | cut -d= -f2-)
        if [ -z "$val" ] || [[ "$val" == *"FYLL_INN"* ]]; then
            echo "   ⚠️  $key mangler verdi"
        else
            echo "   ✅ $key er satt"
        fi
    done
else
    echo "❌ .env:       MANGLER — boten kan ikke starte uten denne"
    echo "   Fix: nano $ENV_FILE"
fi
echo ""

# Last 10 log lines
echo "--- Siste logglinjer ---"
docker logs kenneth-stocks --tail 10 2>/dev/null || echo "(ingen logger ennå)"
echo ""
echo "================================="

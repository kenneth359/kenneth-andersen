#!/bin/bash
# Kenneth Stocks – VPS setup script
# Run once on a fresh Hetzner CX22 (Ubuntu 24.04)
# Usage: bash setup.sh

set -e

echo "=== Kenneth Stocks VPS Setup ==="

# Docker
echo "[1/4] Installing Docker..."
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Clone repo
echo "[2/4] Cloning repository..."
git clone https://github.com/kenneth359/kenneth-andersen.git /opt/kenneth-stocks
cd /opt/kenneth-stocks/kenneth-stocks

# .env file
echo "[3/4] Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo ">>> EDIT .env now with your API keys:"
    echo "    nano .env"
    echo ""
    echo "Keys needed:"
    echo "  ANTHROPIC_API_KEY  -> https://console.anthropic.com/keys"
    echo "  RESEND_API_KEY     -> Already in your portfolio site .env"
    echo "  FRED_API_KEY       -> https://fred.stlouisfed.org/docs/api/api_key.html"
    echo "  ALPHA_VANTAGE_KEY  -> https://www.alphavantage.co/support/#api-key"
    echo ""
    read -p "Press ENTER when .env is filled in..."
fi

# Start
echo "[4/4] Starting Kenneth Stocks..."
docker compose up -d --build

echo ""
echo "=== Done! Kenneth Stocks is running ==="
echo ""
echo "Useful commands:"
echo "  docker compose logs -f          # See live logs"
echo "  docker compose exec screener python main.py --social   # Test social scan"
echo "  docker compose exec screener python main.py --weekly   # Run weekly report now"
echo "  docker compose exec screener python main.py --panic    # Test panic check"
echo "  docker compose restart          # Restart after config changes"

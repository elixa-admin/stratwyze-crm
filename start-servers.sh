#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/brandondienar/Documents/Codex/Projects/AISP/stratwyze-crm"

echo -e "${YELLOW}🚀 Starting Stratwyze CRM...${NC}"

# Start backend
echo -e "${YELLOW}📦 Starting backend server on http://localhost:8000${NC}"
cd "$PROJECT_DIR/backend"
nohup python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Logs: $PROJECT_DIR/backend/backend.log"

# Start frontend
echo -e "${YELLOW}📱 Starting frontend server on http://localhost:3000${NC}"
cd "$PROJECT_DIR/frontend"
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Logs: $PROJECT_DIR/frontend/frontend.log"

echo ""
echo -e "${GREEN}✅ Stratwyze CRM is starting!${NC}"
echo ""
echo "📍 Access the app at: http://localhost:3000"
echo ""
echo "📊 API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 To stop servers later, run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📋 To view logs:"
echo "   tail -f $PROJECT_DIR/backend/backend.log"
echo "   tail -f $PROJECT_DIR/frontend/frontend.log"

# Keep script alive
wait

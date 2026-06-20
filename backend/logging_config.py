import logging
import sys
from datetime import datetime

# Create logs directory
import os
os.makedirs('logs', exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/app_{datetime.now().strftime("%Y%m%d")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def log_request(method: str, path: str, status_code: int):
    logger.info(f"{method} {path} -> {status_code}")

def log_error(error: str, details: str = ""):
    logger.error(f"ERROR: {error} - {details}")

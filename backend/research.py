import os
import json
import asyncio
from typing import Optional, Dict, Any
from tavily import TavilyClient
from anthropic import Anthropic
from sqlalchemy.orm import Session
from models import Prospect, Lead, Brief
import logging
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# In-memory job tracking (use Redis in production)
research_jobs = {}


async def research_company(db: Session, lead_id: str, prospect_id: str) -> Dict[str, Any]:
    """
    Research a company using Tavily and generate an AI brief
    """
    job_id = str(uuid.uuid4())
    research_jobs[job_id] = {"status": "in_progress", "progress": 0}

    try:
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if not prospect:
            return {"error": "Prospect not found"}

        # Update status
        prospect.research_status = "in_progress"
        db.commit()

        # Step 1: Get company website from email or company name
        company_website = prospect.company_website
        if not company_website and prospect.lead:
            # Try to extract domain from email
            email = prospect.lead.email
            if email:
                domain = email.split('@')[1]
                company_website = f"https://{domain}"

        research_jobs[job_id]["progress"] = 20

        # Step 2: Fetch company data using Tavily
        company_data = await fetch_company_research(company_website or prospect.company_name or "")
        research_jobs[job_id]["progress"] = 50

        # Step 3: Detect tech stack
        tech_stack = detect_tech_stack(company_data)
        research_jobs[job_id]["progress"] = 70

        # Step 4: Generate executive brief
        brief_content = generate_brief(prospect, company_data, tech_stack)
        research_jobs[job_id]["progress"] = 90

        # Step 5: Save to database
        prospect.research_notes = json.dumps(company_data)
        prospect.technology_stack = tech_stack
        prospect.executive_brief = brief_content
        prospect.brief_generated_at = datetime.utcnow()
        prospect.research_status = "complete"
        prospect.last_researched_at = datetime.utcnow()

        # Create Brief record
        brief = Brief(
            id=uuid.uuid4(),
            prospect_id=prospect_id,
            content=brief_content,
            model_version="claude-opus-4-8",
            generated_at=datetime.utcnow()
        )
        db.add(brief)
        db.commit()

        research_jobs[job_id]["status"] = "complete"
        research_jobs[job_id]["progress"] = 100

        logger.info(f"Research completed for prospect {prospect_id}")

        return {
            "job_id": job_id,
            "status": "complete",
            "brief": brief_content,
            "tech_stack": tech_stack,
            "research_notes": company_data
        }

    except Exception as e:
        logger.error(f"Research failed for prospect {prospect_id}: {str(e)}")
        prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
        if prospect:
            prospect.research_status = "failed"
            db.commit()
        research_jobs[job_id]["status"] = "failed"
        research_jobs[job_id]["error"] = str(e)
        return {"error": str(e), "job_id": job_id}


async def fetch_company_research(company_identifier: str) -> Dict[str, Any]:
    """
    Use Tavily to research a company
    """
    try:
        response = tavily_client.search(
            query=f"company {company_identifier} information founded team",
            search_depth="advanced",
            include_answer=True
        )

        return {
            "company_identifier": company_identifier,
            "search_results": response.get("results", []),
            "answer": response.get("answer", ""),
            "fetched_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Tavily search failed: {str(e)}")
        return {
            "company_identifier": company_identifier,
            "error": str(e),
            "fetched_at": datetime.utcnow().isoformat()
        }


def detect_tech_stack(company_data: Dict[str, Any]) -> Dict[str, list]:
    """
    Detect technology stack from company data
    """
    # Extract tech mentions from search results
    tech_stack = {
        "platforms": [],
        "tools": [],
        "languages": [],
        "frameworks": []
    }

    # Common tech keywords to look for
    tech_keywords = {
        "platforms": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Cloud"],
        "tools": ["Slack", "GitHub", "Salesforce", "HubSpot", "Jira", "Confluence"],
        "languages": ["Python", "JavaScript", "Java", "Go", "Rust", "TypeScript"],
        "frameworks": ["React", "Vue", "Angular", "Django", "FastAPI", "Spring"]
    }

    # Search through company data
    full_text = json.dumps(company_data).lower()

    for category, keywords in tech_keywords.items():
        for keyword in keywords:
            if keyword.lower() in full_text:
                if keyword not in tech_stack[category]:
                    tech_stack[category].append(keyword)

    return tech_stack


def generate_brief(prospect: Prospect, company_data: Dict[str, Any], tech_stack: Dict[str, list]) -> str:
    """
    Generate an executive brief using Claude
    """
    company_name = prospect.company_name or "the company"

    prompt = f"""
Based on the following research data about {company_name}, generate a comprehensive executive brief with these sections:

**Company Overview**
- Business model and core offering
- Company size and funding status
- Key leadership/team

**Competitive Landscape**
- Main competitors
- Key differentiation

**Pain Points & Opportunities**
- Current challenges they likely face
- Why they might need Stratwyze CRM

**Recommended Pitch Angles**
- 3-5 specific approaches to position Stratwyze
- Tailored to their specific situation

Research Data:
{json.dumps(company_data, indent=2)}

Technology Stack Detected:
{json.dumps(tech_stack, indent=2)}

Format the brief in markdown with clear sections and bullets. Be specific and actionable.
"""

    try:
        message = anthropic_client.messages.create(
            model="claude-opus-4-8",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return message.content[0].text

    except Exception as e:
        logger.error(f"Claude API failed: {str(e)}")
        # Return a template brief if Claude fails
        return f"""# Executive Brief: {company_name}

## Company Overview
Unable to generate detailed brief at this time.

## Next Steps
1. Manual research required
2. Review Tavily search results
3. Custom brief generation

*Brief generation error: {str(e)}*
"""


def get_job_status(job_id: str) -> Dict[str, Any]:
    """
    Get the status of a research job
    """
    if job_id not in research_jobs:
        return {"error": "Job not found"}

    return research_jobs[job_id]

"""Advanced analytics for sales pipeline."""

from sqlalchemy.orm import Session
from models import Lead, Opportunity, Stage, Organization
from datetime import datetime, timedelta
from collections import defaultdict
import json


def calculate_sales_funnel(db: Session, org_id: str = None):
    """
    Calculate conversion rates through sales funnel:
    Leads → Prospects → Opportunities → Closed Won
    """
    # Get all leads
    leads_query = db.query(Lead)
    if org_id:
        leads_query = leads_query.filter_by(organization_id=org_id)
    total_leads = leads_query.count()

    # Get leads converted to opportunities
    opportunities_query = db.query(Opportunity).distinct(Opportunity.lead_id)
    if org_id:
        opportunities_query = opportunities_query.join(Lead).filter(Lead.organization_id == org_id)
    opportunities_count = opportunities_query.count()

    # Get closed won opportunities
    closed_won_stage = db.query(Stage).filter_by(name="Closed Won").first()
    won_query = db.query(Opportunity).filter_by(stage_id=closed_won_stage.id) if closed_won_stage else db.query(Opportunity).filter(False)
    if org_id:
        won_query = won_query.join(Lead).filter(Lead.organization_id == org_id)
    won_count = won_query.count()

    return {
        "total_leads": total_leads,
        "leads_to_opp_rate": (opportunities_count / total_leads * 100) if total_leads > 0 else 0,
        "opportunities_count": opportunities_count,
        "opp_to_won_rate": (won_count / opportunities_count * 100) if opportunities_count > 0 else 0,
        "total_won": won_count,
        "overall_conversion": (won_count / total_leads * 100) if total_leads > 0 else 0
    }


def calculate_win_loss_by_stage(db: Session):
    """Analyze win/loss rates by pipeline stage."""
    stages = db.query(Stage).order_by(Stage.order_index).all()
    result = {}

    for stage in stages:
        opps = db.query(Opportunity).filter_by(stage_id=stage.id).all()
        if not opps:
            result[stage.name] = {"count": 0, "total_value": 0, "avg_value": 0}
            continue

        total_value = sum(float(o.value) if o.value else 0 for o in opps)
        result[stage.name] = {
            "count": len(opps),
            "total_value": total_value,
            "avg_value": total_value / len(opps) if opps else 0
        }

    return result


def calculate_revenue_forecast(db: Session, months: int = 3):
    """
    Project revenue based on current pipeline.
    Uses probability-weighted opportunity values.
    """
    today = datetime.utcnow()
    forecasts = []

    for month_offset in range(months):
        target_date = today + timedelta(days=30 * month_offset)
        month_str = target_date.strftime("%B %Y")

        # Get opportunities expected to close this month
        month_start = target_date.replace(day=1)
        month_end = (target_date.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        opps = db.query(Opportunity).filter(
            Opportunity.expected_close_date >= month_start,
            Opportunity.expected_close_date <= month_end
        ).all()

        weighted_revenue = sum(
            (float(o.value) * o.probability / 100) if o.value else 0
            for o in opps
        )

        forecasts.append({
            "month": month_str,
            "projected_revenue": weighted_revenue,
            "deal_count": len(opps)
        })

    return forecasts


def calculate_deal_cycle_metrics(db: Session):
    """
    Calculate average deal cycle length and other timing metrics.
    """
    closed_opps = db.query(Opportunity).filter(
        Opportunity.expected_close_date.isnot(None),
        Opportunity.created_at.isnot(None)
    ).all()

    if not closed_opps:
        return {
            "avg_cycle_days": 0,
            "median_cycle_days": 0,
            "fastest_deal_days": 0,
            "slowest_deal_days": 0
        }

    cycle_lengths = []
    for opp in closed_opps:
        if opp.expected_close_date and opp.created_at:
            delta = opp.expected_close_date - opp.created_at.date()
            cycle_lengths.append(delta.days)

    if not cycle_lengths:
        return {
            "avg_cycle_days": 0,
            "median_cycle_days": 0,
            "fastest_deal_days": 0,
            "slowest_deal_days": 0
        }

    cycle_lengths.sort()
    return {
        "avg_cycle_days": sum(cycle_lengths) / len(cycle_lengths),
        "median_cycle_days": cycle_lengths[len(cycle_lengths) // 2],
        "fastest_deal_days": min(cycle_lengths),
        "slowest_deal_days": max(cycle_lengths),
        "deals_analyzed": len(cycle_lengths)
    }


def calculate_monthly_performance(db: Session, months: int = 6):
    """
    Track performance metrics over the last N months.
    """
    performance = []
    today = datetime.utcnow()

    for month_offset in range(months):
        target_date = today - timedelta(days=30 * month_offset)
        month_str = target_date.strftime("%B %Y")

        month_start = target_date.replace(day=1)
        month_end = (target_date.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        # Deals created this month
        created = db.query(Opportunity).filter(
            Opportunity.created_at >= month_start,
            Opportunity.created_at <= month_end
        ).count()

        # Deals closed this month
        closed_won_stage = db.query(Stage).filter_by(name="Closed Won").first()
        closed = db.query(Opportunity).filter(
            Opportunity.stage_id == closed_won_stage.id if closed_won_stage else None,
            Opportunity.updated_at >= month_start,
            Opportunity.updated_at <= month_end
        ).count() if closed_won_stage else 0

        # Revenue generated
        won_opps = db.query(Opportunity).filter(
            Opportunity.stage_id == closed_won_stage.id if closed_won_stage else None,
            Opportunity.created_at >= month_start,
            Opportunity.created_at <= month_end
        ).all() if closed_won_stage else []

        revenue = sum(float(o.value) if o.value else 0 for o in won_opps)

        performance.append({
            "month": month_str,
            "deals_created": created,
            "deals_closed": closed,
            "revenue_generated": revenue,
            "avg_deal_size": revenue / closed if closed > 0 else 0
        })

    return performance


def get_all_analytics(db: Session, org_id: str = None):
    """
    Get comprehensive analytics dashboard.
    """
    return {
        "funnel": calculate_sales_funnel(db, org_id),
        "by_stage": calculate_win_loss_by_stage(db),
        "forecast": calculate_revenue_forecast(db, months=3),
        "cycle_metrics": calculate_deal_cycle_metrics(db),
        "monthly_performance": calculate_monthly_performance(db, months=6)
    }

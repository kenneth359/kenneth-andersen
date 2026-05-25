"""
Pension tracker: monitors Kron EPK + Storebrand OTP and projects retirement balance.
No network calls – reads manually-updated config/pension_config.yaml.
Update the YAML once per month with current balances from Kron/Storebrand apps.
"""

import logging
from datetime import date, datetime
from typing import Optional

import yaml

logger = logging.getLogger(__name__)

CONFIG_PATH = "config/pension_config.yaml"


def _load_config() -> dict:
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def _project_balance(
    current_balance: float,
    monthly_contribution: float,
    years: float,
    annual_real_return: float,
) -> float:
    """
    Future value of current lump sum + monthly contributions (real terms).
    FV = PV*(1+r)^n + PMT * [((1+r)^n - 1) / r]
    r is monthly real return, n is months.
    """
    r_monthly = (1 + annual_real_return) ** (1 / 12) - 1
    n = years * 12
    fv_lump = current_balance * (1 + r_monthly) ** n
    if r_monthly > 0:
        fv_contributions = monthly_contribution * (((1 + r_monthly) ** n - 1) / r_monthly)
    else:
        fv_contributions = monthly_contribution * n
    return fv_lump + fv_contributions


def _monthly_drawdown(total_balance: float, years_in_retirement: float = 25) -> float:
    """Approximate monthly income if balance drawn down over retirement years at 0% real return."""
    return total_balance / (years_in_retirement * 12)


def get_pension_snapshot() -> dict:
    """
    Build pension snapshot for the weekly report.
    Returns dict with current state, projections, and action signals.
    """
    try:
        cfg = _load_config()
    except FileNotFoundError:
        logger.warning(f"pension_config.yaml not found at {CONFIG_PATH}")
        return {}

    proj = cfg["projection"]
    kron = cfg["kron_epk"]
    otp = cfg["storebrand_otp"]

    current_age = proj["current_age"]
    retirement_age = proj["retirement_age"]
    years_to_retirement = retirement_age - current_age
    real_return = proj["expected_real_return_pct"] / 100

    kron_balance = kron["balance_nok"]
    otp_balance = otp.get("balance_nok", 0) or 0
    otp_monthly = otp["monthly_contribution_nok"]
    total_current = kron_balance + otp_balance

    # Project Kron EPK (no new contributions – employer stopped when Kenneth moved it)
    kron_projected = _project_balance(kron_balance, 0, years_to_retirement, real_return)

    # Project Storebrand OTP (employer pays ~15k/month, no lump-sum if balance unknown)
    otp_projected = _project_balance(otp_balance, otp_monthly, years_to_retirement, real_return)

    total_projected = kron_projected + otp_projected
    monthly_pension = _monthly_drawdown(total_projected)

    # Days since last update (freshness check)
    last_updated = kron.get("last_updated", "")
    days_stale = None
    if last_updated:
        try:
            updated_date = datetime.strptime(str(last_updated), "%Y-%m-%d").date()
            days_stale = (date.today() - updated_date).days
        except ValueError:
            pass

    signals = _generate_signals(cfg, total_projected, monthly_pension, days_stale)

    return {
        "generated_at": datetime.now().isoformat(),
        "current": {
            "kron_epk_nok": kron_balance,
            "storebrand_otp_nok": otp_balance,
            "total_nok": total_current,
            "kron_fund": kron["fund_name"],
            "kron_cost_pct": kron["cost_pct"],
            "otp_profile": otp["profile"],
            "otp_monthly_contribution": otp_monthly,
            "last_updated": last_updated,
            "days_stale": days_stale,
        },
        "allocation": kron.get("allocation", {}),
        "projection": {
            "years_to_retirement": years_to_retirement,
            "retirement_age": retirement_age,
            "kron_at_retirement_nok": round(kron_projected),
            "otp_at_retirement_nok": round(otp_projected),
            "total_at_retirement_nok": round(total_projected),
            "monthly_pension_estimate_nok": round(monthly_pension),
            "real_return_assumption_pct": proj["expected_real_return_pct"],
        },
        "signals": signals,
    }


def _generate_signals(cfg: dict, projected_total: float, monthly_pension: float, days_stale: Optional[int]) -> list[dict]:
    signals = []

    otp_profile = cfg["storebrand_otp"].get("profile", "")
    if "offensiv" not in otp_profile.lower():
        signals.append({
            "level": "ACTION",
            "msg": f"Storebrand OTP-profil er '{otp_profile}' – bytt til Offensiv profil i Storebrand-appen. "
                   "Ved 41 år bør 100% stå i aksjer. Gjøres under Storebrand.no → Mine forsikringer → Pensjon.",
        })

    if monthly_pension < 30000:
        signals.append({
            "level": "WATCH",
            "msg": f"Estimert månedlig pensjon {monthly_pension:,.0f} kr ved {cfg['projection']['retirement_age']} år er under 30 000 kr/mnd. "
                   "Vurder å øke frivillig sparing.",
        })

    if days_stale is not None and days_stale > 45:
        signals.append({
            "level": "WATCH",
            "msg": f"Kron-saldo er ikke oppdatert på {days_stale} dager. "
                   "Oppdater balance_nok i config/pension_config.yaml.",
        })

    return signals

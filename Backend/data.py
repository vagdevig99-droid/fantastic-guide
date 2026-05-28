"""Mock banking data for the two demo personas.

This is the source of truth that tools read against. In a real deployment
this would be a database; here it's just a dictionary so the experience
runs locally without any external dependency.
"""

PERSONAS = {
    "priya": {
        "name": "Priya Sharma",
        "profile": "Owner of Sunrise Bakery in Pune. Banking with us for 7 years (1 personal, 6 business). Files GST returns monthly. Has 3 employees on payroll.",
        "city": "Pune",
        "monthly_turnover": 1980000,
        "accounts": [
            {"id": "p-cur-1", "type": "Current · Business", "number_masked": "•• 4421", "ifsc": "OURB0001234", "balance": 842650, "avg_monthly_inflow": 1980000},
            {"id": "p-od-1",  "type": "Overdraft", "number_masked": "OD-9921", "limit": 300000, "used": 118400, "rate_pa": 11.25, "interest_mtd": 942},
            {"id": "p-sav-1", "type": "Savings · Personal", "number_masked": "•• 9082", "ifsc": "OURB0001234", "balance": 215300},
        ],
        "recent_transactions": [
            {"id": "t-p-1", "merchant": "Mehta Flour Mills", "beneficiary_account": "•• 6620", "beneficiary_ifsc": "HDFC0001872", "amount": -480000, "date": "2026-05-14", "status": "held",   "hold_reason": "AML threshold variance — 2.3x of 6-month vendor average"},
            {"id": "t-p-2", "merchant": "ABC Sugar Traders", "amount": -62400,  "date": "2026-05-13", "status": "settled"},
            {"id": "t-p-3", "merchant": "Vodafone Idea",     "amount": -1840,   "date": "2026-05-12", "status": "settled"},
            {"id": "t-p-4", "merchant": "GST output · April","amount": -38200,  "date": "2026-05-11", "status": "settled"},
            {"id": "t-p-5", "merchant": "Sunrise Bakery POS","amount": 42150,   "date": "2026-05-10", "status": "settled"},
            {"id": "t-p-6", "merchant": "Mehta Flour Mills", "amount": -210000, "date": "2026-04-22", "status": "settled"},
        ],
        "gst": {
            "gstin": "27ABCDE1234F1ZX",
            "gstr1_last_filed": "2026-05-11",
            "gstr3b_last_filed": "2026-05-11",
            "itc_available": 14200,
            "next_due": [{"form": "GSTR-1", "due": "2026-07-11"}, {"form": "GSTR-3B", "due": "2026-07-20"}],
        },
        "employees": [
            {"name": "Anita Devi",   "role": "Baker",         "monthly_ctc": 22000},
            {"name": "Kishore Kumar","role": "Counter staff", "monthly_ctc": 18000},
            {"name": "Raju Yadav",   "role": "Delivery",      "monthly_ctc": 15000},
        ],
        "mdr_breakdown_last_month": {
            "total_processed": 1280000,
            "total_mdr_paid": 3470,
            "average_ticket": 620,
            "slices": [
                {"label": "UPI",                 "share_pct": 62, "mdr": 0},
                {"label": "RuPay debit",         "share_pct": 18, "mdr": 0},
                {"label": "Visa/Mastercard credit","share_pct": 12, "mdr": 1420},
                {"label": "Visa/Mastercard debit","share_pct": 8,  "mdr": 2050},
            ],
        },
        "cash_flow_forecast_6mo": [
            {"month": "May", "projected": 842000, "note": ""},
            {"month": "Jun", "projected": 752000, "note": "monsoon onset"},
            {"month": "Jul", "projected": 660000, "note": "deepest dip — ~22% off baseline"},
            {"month": "Aug", "projected": 790000, "note": ""},
            {"month": "Sep", "projected": 920000, "note": "recovery"},
            {"month": "Oct", "projected": 980000, "note": "festive uplift"},
        ],
        "relationship_banker": {"name": "Vikram Iyer", "phone": "+91 98xxxxxx", "open_slots_this_week": 3},
    },
    "arjun": {
        "name": "Arjun Mehta",
        "profile": "Software engineer in Bengaluru, 26 years old. Banking with us for 4 years. Monthly salary credit ₹1,85,000. Has a credit card, a savings account, and a monthly SIP.",
        "city": "Bengaluru",
        "monthly_salary": 185000,
        "accounts": [
            {"id": "a-sav-1", "type": "Savings", "number_masked": "•• 7731", "ifsc": "OURB0008765", "balance": 312480, "last_credit_date": "2026-05-02", "last_credit_amount": 185000},
            {"id": "a-cc-1",  "type": "Credit Card · Visa Signature", "number_masked": "•• 4108", "outstanding": 41220, "limit": 250000, "statement_due": "2026-05-18", "minimum_due": 2062, "cards_on_file": 7},
            {"id": "a-mf-1",  "type": "Mutual Fund SIP", "balance": 218460, "sip_monthly": 15000, "mtd_return_pct": 4.2, "fund_name": "Equity-Hybrid Direct"},
        ],
        "recent_transactions": [
            {"id": "t-a-1", "merchant": "QUICKSTREAM MEDIA", "amount": -3499, "date": "2026-05-12", "time": "23:42 IST", "status": "disputed", "mcc": 4899, "country": "GB", "channel": "card-not-present", "auth": "3DS not used", "flag": "off-pattern outlier"},
            {"id": "t-a-2", "merchant": "Swiggy",       "amount": -742,  "date": "2026-05-11", "status": "settled"},
            {"id": "t-a-3", "merchant": "Amazon India", "amount": -2890, "date": "2026-05-10", "status": "settled"},
            {"id": "t-a-4", "merchant": "Salary credit","amount": 185000,"date": "2026-05-02", "status": "settled"},
            {"id": "t-a-5", "merchant": "SIP · Equity Hybrid", "amount": -15000, "date": "2026-05-01", "status": "settled"},
        ],
        "spend_6mo_breakdown": {
            "Dining":          {"share_pct": 32, "trend_yoy_pct": 18},
            "Online shopping": {"share_pct": 24, "trend_yoy_pct": 4},
            "Travel":          {"share_pct": 18, "trend_yoy_pct": 9},
            "Everything else": {"share_pct": 26, "trend_yoy_pct": 0},
        },
        "subscription_leakage": [
            {"merchant": "QuickStream Media", "amount_pm": 999,  "last_used": "78 days ago"},
            {"merchant": "AppGym Premium",    "amount_pm": 799,  "last_used": "92 days ago"},
            {"merchant": "Audio Plus",        "amount_pm": 602,  "last_used": "61 days ago"},
        ],
        "rewards": {"points": 18400, "redeem_value_inr": 18400, "expiring_soon_points": 2400, "expiry_date": "2026-09-30"},
        "lrs_usage_fy_usd": 4200,
        "lrs_limit_fy_usd": 250000,
        "recent_flight_searches": [{"from": "BLR", "to": "GOI", "date_searched": "2026-05-11"}, {"from": "BLR", "to": "GOI", "date_searched": "2026-05-15"}],
        "pre_approved_cards": [
            {"name": "Platinum Travel Card", "annual_fee": 2500, "fee_waiver_at_spend": 400000, "rewards": "4x travel, 2x dining, 1x rest", "perks": "8 domestic lounge visits, zero forex on intl. swipe", "modelled_net_benefit_yr": 14800},
            {"name": "Dine & Shop Card",     "annual_fee": 999,  "rewards": "5% dining cashback, 3% online, 1% rest", "modelled_net_benefit_yr": 9200},
        ],
        "travel_offers": [
            {"name": "Taj Holiday Village, Goa · 4 nights", "discount_pct": 22, "base_price": 38400, "discounted_price": 29950, "card_cashback_pct": 5, "cashback_value": 1498, "perk": "₹3,000 dining credit, free cancellation till 7 days before check-in"},
            {"name": "IndiGo · BLR → GOI return",           "discount_pct": 0,  "pay_with_points_coverage_pct": 70, "perk": "Points cover 70% of return ticket next month"},
            {"name": "Zero-FX Multi-Currency Forex Card",   "fee": 0, "fee_waiver_at_load": 50000, "saves_pct_overseas": 3.5, "lrs_remaining_usd": 245800, "perk": "Digital issuance 2 min, physical card before travel"},
        ],
    },
}


# Quick lookup helpers
def get_persona(persona_id):
    return PERSONAS.get(persona_id, {})

def get_account(persona_id, account_id=None):
    p = get_persona(persona_id)
    accts = p.get("accounts", [])
    if account_id is None:
        return accts
    return next((a for a in accts if a.get("id") == account_id), None)

def get_transactions(persona_id, days=30, only_status=None, only_outflows=False):
    p = get_persona(persona_id)
    txns = p.get("recent_transactions", [])
    out = []
    for t in txns:
        if only_status and t.get("status") != only_status:
            continue
        if only_outflows and t.get("amount", 0) >= 0:
            continue
        out.append(t)
    return out

def get_held_payments(persona_id):
    return get_transactions(persona_id, only_status="held")

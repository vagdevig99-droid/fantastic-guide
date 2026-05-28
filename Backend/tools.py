"""Tool implementations the specialist agents can call.

Each tool returns a plain dict that gets serialised to JSON for Claude.
The intent is realism over completeness — the tools are small and
deterministic so a pitch demo always behaves the same way.

A tool registry at the bottom maps tool names to (function, schema, agent)
so server.py can wire them into the Anthropic API call.
"""

import random
from data import (
    PERSONAS,
    get_persona,
    get_account,
    get_transactions,
    get_held_payments,
)


# ─────────────────────────── Servicing tools ───────────────────────────

def get_account_balance(persona_id: str, account_id: str | None = None) -> dict:
    accts = get_account(persona_id, account_id)
    if accts is None:
        return {"error": "account not found"}
    if isinstance(accts, list):
        return {"accounts": accts}
    return {"account": accts}


def get_recent_transactions(persona_id: str, days: int = 30, only_outflows: bool = False) -> dict:
    return {"transactions": get_transactions(persona_id, days=days, only_outflows=only_outflows)}


def get_held_payments_tool(persona_id: str) -> dict:
    holds = get_held_payments(persona_id)
    return {"held_payments": holds, "count": len(holds)}


def release_held_payment(persona_id: str, payment_id: str, method: str = "quick-release") -> dict:
    holds = get_held_payments(persona_id)
    pmt = next((h for h in holds if h.get("id") == payment_id), None)
    if not pmt:
        return {"error": "payment not found or not held"}
    return {
        "released": True,
        "payment_id": payment_id,
        "method": method,
        "estimated_completion": "30 minutes",
        "case_id": f"REL-{random.randint(10000, 99999)}",
        "compliance_note": "Released under PMLA self-attest flow. Audit trail logged.",
    }


def raise_dispute_case(persona_id: str, transaction_id: str, reason: str = "unrecognised charge") -> dict:
    return {
        "raised": True,
        "case_id": f"DSP-{random.randint(10000, 99999)}",
        "transaction_id": transaction_id,
        "provisional_credit_amount_inr": next(
            (abs(t.get("amount", 0)) for t in get_transactions(persona_id) if t.get("id") == transaction_id),
            None,
        ),
        "provisional_credit_in_days": 7,
        "policy": "RBI Customer Liability Framework — reported within 3 working days, zero customer liability.",
    }


def block_card(persona_id: str, card_id: str, permanent: bool = False) -> dict:
    return {
        "blocked": True,
        "card_id": card_id,
        "type": "permanent" if permanent else "temporary",
        "replacement_eta_days": 2 if permanent else None,
        "tokenisation_note": "Cards-on-file at tokenised merchants will auto-update via the card-network's tokenisation rails — saved payments at Netflix, Amazon, Swiggy, etc. won't break.",
    }


# ─────────────────────────── Sales & Advisory tools ───────────────────────────

def check_loan_eligibility(persona_id: str, purpose: str, amount_inr: int, tenure_months: int) -> dict:
    p = get_persona(persona_id)
    if not p:
        return {"error": "persona not found"}
    # Indicative offer logic
    is_sme = persona_id == "priya"
    apr = 10.40 if is_sme else 12.50
    proc_fee_pct = 1.0
    monthly_rate = apr / 12 / 100
    emi = round(amount_inr * monthly_rate * (1 + monthly_rate) ** tenure_months /
                ((1 + monthly_rate) ** tenure_months - 1))
    return {
        "pre_qualified": True,
        "purpose": purpose,
        "indicative_limit_inr": min(amount_inr, 800000 if is_sme else 500000),
        "apr_pct": apr,
        "tenure_months": tenure_months,
        "indicative_emi_inr": emi,
        "processing_fee_pct": proc_fee_pct,
        "foreclosure_after_months": 6,
        "cooling_off_days": 3,
        "disclosure": "Per RBI Digital Lending Guidelines, full Key Fact Statement will be issued before sanction. 3-day cooling-off applies post-disbursal.",
    }


def draft_key_fact_statement(persona_id: str, loan_type: str, amount_inr: int, tenure_months: int) -> dict:
    elig = check_loan_eligibility(persona_id, loan_type, amount_inr, tenure_months)
    if "error" in elig:
        return elig
    return {
        "kfs": {
            "loan_type": loan_type,
            "principal_inr": amount_inr,
            "apr_pct": elig["apr_pct"],
            "tenure_months": tenure_months,
            "indicative_emi_inr": elig["indicative_emi_inr"],
            "processing_fee_pct": elig["processing_fee_pct"],
            "processing_fee_inr": round(amount_inr * elig["processing_fee_pct"] / 100),
            "foreclosure_charges": "Nil after 6 months",
            "cooling_off_days": elig["cooling_off_days"],
            "total_repayment_inr": elig["indicative_emi_inr"] * tenure_months,
        },
        "regulatory_note": "Drafted per RBI Digital Lending Guidelines (DLG). KFS is finalised before sanction with all charges and APR fully disclosed.",
    }


def compare_credit_cards(persona_id: str, optimise_for: str = "best yield") -> dict:
    p = get_persona(persona_id)
    if persona_id != "arjun":
        return {"error": "credit card comparison currently configured for retail customers"}
    return {
        "spend_pattern_6mo": p.get("spend_6mo_breakdown", {}),
        "pre_approved_options": p.get("pre_approved_cards", []),
        "mitc_note": "Full Most Important Terms & Conditions (MITC) will be presented before acceptance — finance charge, late fee, fuel surcharge waiver, surcharge cap details all per RBI norms.",
    }


def get_spend_breakdown(persona_id: str, months: int = 6) -> dict:
    p = get_persona(persona_id)
    breakdown = p.get("spend_6mo_breakdown")
    if not breakdown:
        return {"error": "no spend data available for this persona"}
    return {"months": months, "categories": breakdown, "subscription_leakage": p.get("subscription_leakage", [])}


# ─────────────────────────── Growth & Marketplace tools ───────────────────────────

def get_mdr_analysis(persona_id: str) -> dict:
    p = get_persona(persona_id)
    mdr = p.get("mdr_breakdown_last_month")
    if not mdr:
        return {"error": "MDR analysis only available for merchant customers"}
    return mdr


def list_partner_offers(persona_id: str, intent: str) -> dict:
    p = get_persona(persona_id)
    intent_l = (intent or "").lower()
    if any(k in intent_l for k in ["pos", "terminal", "mdr", "card acceptance"]):
        return {"offers": [
            {"name": "Pine Labs SmartPOS Mini", "device_fee_months_free": 6, "blended_mdr_pct": 0.42, "annual_saving_inr": 18600, "bonus": "3% statement cashback on first ₹2L"},
            {"name": "Mswipe QR-First",         "monthly_fee_inr": 0, "bonus": "₹1,500 statement credit after ₹50k processed"},
        ], "regulatory_note": "Both partners hold RBI Payment Aggregator authorisation. Settlement uses NPCI rails."}
    if any(k in intent_l for k in ["travel", "trip", "goa", "vacation", "holiday"]):
        return {"offers": p.get("travel_offers", []), "regulatory_note": "All travel partners integrated under RBI's Payment Aggregator framework. Forex card reload covered by FEMA Liberalised Remittance Scheme (LRS)."}
    return {"offers": [], "note": "No matching marketplace category for that intent."}


def get_loyalty_balance(persona_id: str) -> dict:
    p = get_persona(persona_id)
    return p.get("rewards") or {"error": "no loyalty programme for this persona"}


# ─────────────────────────── Front-door (always available) ───────────────────────────

def get_persona_context(persona_id: str) -> dict:
    p = get_persona(persona_id)
    if not p:
        return {"error": "persona not found"}
    return {
        "name": p.get("name"),
        "profile": p.get("profile"),
        "accounts": p.get("accounts", []),
    }


# ─────────────────────────── Tool registry ───────────────────────────
# Maps tool name → (impl, schema for Anthropic, allowed-agents)
#
# Schemas use the Anthropic tool-use format (name, description,
# input_schema). The schema is intentionally tight so Claude picks the
# right tool for the right turn.

TOOLS = {
    # Servicing
    "get_account_balance": {
        "impl": get_account_balance,
        "agents": {"servicing", "sales", "growth"},
        "schema": {
            "name": "get_account_balance",
            "description": "Get balance and key details for the customer's account(s). Pass account_id to restrict to one account, or leave it out for all accounts.",
            "input_schema": {
                "type": "object",
                "properties": {"account_id": {"type": "string", "description": "Optional internal account id"}},
            },
        },
    },
    "get_recent_transactions": {
        "impl": get_recent_transactions,
        "agents": {"servicing", "sales", "growth"},
        "schema": {
            "name": "get_recent_transactions",
            "description": "Get the customer's recent transactions. Useful for explaining holds, disputes, or contextualising recommendations.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Look-back window in days, default 30"},
                    "only_outflows": {"type": "boolean", "description": "True to return only debits"},
                },
            },
        },
    },
    "get_held_payments": {
        "impl": get_held_payments_tool,
        "agents": {"servicing"},
        "schema": {
            "name": "get_held_payments",
            "description": "List any payments currently on AML / compliance hold, with the reason each was held.",
            "input_schema": {"type": "object", "properties": {}},
        },
    },
    "release_held_payment": {
        "impl": release_held_payment,
        "agents": {"servicing"},
        "schema": {
            "name": "release_held_payment",
            "description": "Release a held payment using either quick-release (customer self-attest) or compliance-review option.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "payment_id": {"type": "string"},
                    "method":     {"type": "string", "enum": ["quick-release", "compliance-review"]},
                },
                "required": ["payment_id"],
            },
        },
    },
    "raise_dispute_case": {
        "impl": raise_dispute_case,
        "agents": {"servicing"},
        "schema": {
            "name": "raise_dispute_case",
            "description": "Raise a chargeback / dispute case against a transaction. Returns a case ID and provisional-credit ETA. Cite the RBI Customer Liability Framework when applicable.",
            "input_schema": {
                "type": "object",
                "properties": {"transaction_id": {"type": "string"}, "reason": {"type": "string"}},
                "required": ["transaction_id"],
            },
        },
    },
    "block_card": {
        "impl": block_card,
        "agents": {"servicing"},
        "schema": {
            "name": "block_card",
            "description": "Block a card (temporary or permanent). On permanent blocks, a replacement is issued and tokenised cards-on-file auto-update via the network rails.",
            "input_schema": {
                "type": "object",
                "properties": {"card_id": {"type": "string"}, "permanent": {"type": "boolean"}},
                "required": ["card_id"],
            },
        },
    },

    # Sales & Advisory
    "check_loan_eligibility": {
        "impl": check_loan_eligibility,
        "agents": {"sales"},
        "schema": {
            "name": "check_loan_eligibility",
            "description": "Indicative loan eligibility check for the customer. Returns pre-qualification, APR, EMI estimate.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "purpose":        {"type": "string", "description": "e.g. 'equipment', 'working capital', 'expansion', 'personal'"},
                    "amount_inr":     {"type": "integer"},
                    "tenure_months":  {"type": "integer"},
                },
                "required": ["purpose", "amount_inr", "tenure_months"],
            },
        },
    },
    "draft_key_fact_statement": {
        "impl": draft_key_fact_statement,
        "agents": {"sales"},
        "schema": {
            "name": "draft_key_fact_statement",
            "description": "Draft a Key Fact Statement (KFS) for a proposed loan, per RBI Digital Lending Guidelines.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "loan_type":      {"type": "string"},
                    "amount_inr":     {"type": "integer"},
                    "tenure_months":  {"type": "integer"},
                },
                "required": ["loan_type", "amount_inr", "tenure_months"],
            },
        },
    },
    "compare_credit_cards": {
        "impl": compare_credit_cards,
        "agents": {"sales"},
        "schema": {
            "name": "compare_credit_cards",
            "description": "Compare pre-approved credit card options against the customer's 6-month spend pattern. Useful for next-best-action.",
            "input_schema": {
                "type": "object",
                "properties": {"optimise_for": {"type": "string", "description": "e.g. 'travel', 'dining', 'best yield'"}},
            },
        },
    },
    "get_spend_breakdown": {
        "impl": get_spend_breakdown,
        "agents": {"sales", "growth"},
        "schema": {
            "name": "get_spend_breakdown",
            "description": "Get the customer's spend by category for the last N months, plus subscription-leakage findings.",
            "input_schema": {
                "type": "object",
                "properties": {"months": {"type": "integer"}},
            },
        },
    },

    # Growth & Marketplace
    "get_mdr_analysis": {
        "impl": get_mdr_analysis,
        "agents": {"growth"},
        "schema": {
            "name": "get_mdr_analysis",
            "description": "Merchant Discount Rate breakdown for the last month — which rails drove cost, where savings can come from.",
            "input_schema": {"type": "object", "properties": {}},
        },
    },
    "list_partner_offers": {
        "impl": list_partner_offers,
        "agents": {"growth"},
        "schema": {
            "name": "list_partner_offers",
            "description": "List marketplace partner offers that match the customer intent (e.g. 'pos terminal', 'travel', 'forex').",
            "input_schema": {
                "type": "object",
                "properties": {"intent": {"type": "string"}},
                "required": ["intent"],
            },
        },
    },
    "get_loyalty_balance": {
        "impl": get_loyalty_balance,
        "agents": {"growth"},
        "schema": {
            "name": "get_loyalty_balance",
            "description": "Customer's reward / loyalty point balance and redeemable value.",
            "input_schema": {"type": "object", "properties": {}},
        },
    },
}


def tools_for_agent(agent_name: str) -> list:
    """Return the list of tool schemas this agent can use."""
    return [t["schema"] for t in TOOLS.values() if agent_name in t["agents"]]


def call_tool(name: str, persona_id: str, **kwargs) -> dict:
    """Execute a tool by name. Always passes persona_id as the first arg."""
    t = TOOLS.get(name)
    if not t:
        return {"error": f"unknown tool: {name}"}
    try:
        return t["impl"](persona_id, **kwargs)
    except TypeError as e:
        return {"error": f"bad arguments for {name}: {e}"}

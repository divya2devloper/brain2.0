from __future__ import annotations

from typing import Any, Optional

import httpx


class SupabaseClient:
    def __init__(self, base_url: str, key: str, service_key: str):
        self.base_url = base_url.rstrip("/")
        self.key = key
        self.service_key = service_key
        self.client = httpx.Client(timeout=15.0)

    def _headers(self, service: bool = False) -> dict[str, str]:
        token = self.service_key if service else self.key
        return {
            "apikey": token,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def select(self, table: str, tenant_field: str, tenant_id: str, extra_query: Optional[str] = None) -> Any:
        query = f"{tenant_field}=eq.{tenant_id}"
        if extra_query:
            query = f"{query}&{extra_query}"
        r = self.client.get(
            f"{self.base_url}/rest/v1/{table}?{query}",
            headers=self._headers(service=False),
        )
        r.raise_for_status()
        return r.json()

    def insert(self, table: str, payload: dict[str, Any], service: bool = True) -> Any:
        r = self.client.post(f"{self.base_url}/rest/v1/{table}", headers=self._headers(service=service), json=payload)
        r.raise_for_status()
        return r.json()

    def update(self, table: str, pk_field: str, pk_value: str, tenant_field: str, tenant_id: str, payload: dict[str, Any]) -> Any:
        query = f"{pk_field}=eq.{pk_value}&{tenant_field}=eq.{tenant_id}"
        r = self.client.patch(f"{self.base_url}/rest/v1/{table}?{query}", headers=self._headers(service=True), json=payload)
        r.raise_for_status()
        return r.json()

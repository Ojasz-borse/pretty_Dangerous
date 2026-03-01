import httpx
import asyncio

async def test_radish():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test a crop that is NOT in the CSV but should have synthetic fallback
            resp = await client.get("http://localhost:8000/predict", params={"crop": "Radish", "district": "Sirsa"})
            print(f"Status: {resp.status_code}")
            print(f"JSON: {resp.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_radish())

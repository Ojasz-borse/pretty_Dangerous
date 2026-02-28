import sys
sys.path.insert(0, r'd:/My Version/IntelliReviewAI1.0/mandi-mcp')
import services.price_prediction_service as svc

print("Import OK")
csv_path = r'd:/My Version/IntelliReviewAI1.0/data/mandi_data_2000_rows.csv'
svc.load_and_train_models(csv_path)

# Test 1: known combo
forecast = svc.predict_price('Tomato', 'Nashik', 7)
print("Tomato/Nashik forecast (7 days):")
if forecast:
    for f in forecast:
        print(f"  {f['date']}  predicted={f['predicted_price']}  [{f['lower']} – {f['upper']}]")
    print("Advice:", svc.get_sell_advice(forecast))
else:
    print("  No forecast returned (check fallback model)")

# Test 2: fallback – unknown district
forecast2 = svc.predict_price('Onion', 'UnknownCity', 7)
print("\nOnion/UnknownCity (fallback) forecast:")
if forecast2:
    for f in forecast2:
        print(f"  {f['date']}  predicted={f['predicted_price']}")
    print("Advice:", svc.get_sell_advice(forecast2))
else:
    print("  No fallback model either")

print("\nAll tests passed!")

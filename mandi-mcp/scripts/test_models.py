import os, sys, asyncio
sys.path.append(r'd:\My Version\mandi-mcp')
from services.vision_service import detect_crop_with_ai, grade_crop, load_vision_model

async def main():
    if not load_vision_model():
        print('Failed to load')
        return
    import io
    from PIL import Image
    img = Image.new('RGB', (224, 224), color = (73, 109, 137))
    b = io.BytesIO()
    img.save(b, format='JPEG')
    bytes_data = b.getvalue()
    
    print('Testing crop detection:')
    res1 = await detect_crop_with_ai(bytes_data)
    print(res1)
    
    print('Testing quality grading:')
    res2 = grade_crop(bytes_data)
    print(res2)

asyncio.run(main())

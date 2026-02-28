import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

import services.vision_service as vs

async def main():
    # create a dummy image
    from PIL import Image
    import io
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    image_bytes = img_byte_arr.getvalue()

    print(f"Using Gemini key? {'Yes' if GEMINI_API_KEY else 'No'}")
    
    try:
        res = await vs._gemini_detect(image_bytes, GEMINI_API_KEY)
        print("Gemini result:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())

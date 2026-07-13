const KEYWORD_MAP: Record<string, string[]> = {
  // Categories
  "tempurung": ["photo-1543218024-57a70143c369"],
  "sabut": ["photo-1595246140625-573b715d11dc"],
  "arang": ["photo-1599819811279-d5ad9cccf838"],
  "minyak": ["photo-1622484211148-716598e04041"],
  "kerajinan": ["photo-1534422298391-e4f8c172dddb"],
  "olahan": ["photo-1596797038530-2c107229654b"],
  "segar": ["photo-1596797038530-2c107229654b"],
  "gula": ["photo-1596797038530-2c107229654b"],
  "santan": ["photo-1596797038530-2c107229654b"],
  "perawatan": ["photo-1615485290382-441e4d049cb5"],
  "pakan": ["photo-1557234195-bd9f290f3e2b"],

  // Products
  "briket": ["photo-1605647540924-852290f6b0d5", "photo-1599819811279-d5ad9cccf838"],
  "arang-aktif": ["photo-1508962914676-134849a727f0"],
  "tepung-tempurung": ["photo-1541832676-9b763b0239ab"],
  "asap-cair": ["photo-1608571423902-eed4a5ad8108"],
  "cocopeat": ["photo-1463936575829-25148e1db1b8", "photo-1557234195-bd9f290f3e2b"],
  "sabut-anyaman": ["photo-1595246140625-573b715d11dc"],
  "vco": ["photo-1622484211148-716598e04041", "photo-1596797038530-2c107229654b"],
  "capsule": ["photo-1615485290382-441e4d049cb5"],
  "softgel": ["photo-1615485290382-441e4d049cb5"],
  "goreng": ["photo-1622484211148-716598e04041"],
  "mangkok": ["photo-1534422298391-e4f8c172dddb", "photo-1513519245088-0e12902e5a38"],
  "frame": ["photo-1513519245088-0e12902e5a38"],
  "pot-bunga": ["photo-1585320806297-9794b3e4eeae"],
  "cocofiber": ["photo-1595246140625-573b715d11dc"],
  "lilin": ["photo-1606744824163-985d376605aa"],
  
  // Stores / general
  "workshop": ["photo-1526318896980-cf78c088247c"],
  "factory": ["photo-1527018601619-a508a2be00cd"],
  "farm": ["photo-1526318896980-cf78c088247c"],
  "artisan": ["photo-1534422298391-e4f8c172dddb"],
  "industry": ["photo-1527018601619-a508a2be00cd"],
};

export function sanitizeImageUrl(
  url: string | null | undefined,
  seedKey: string = "default",
  index = 0
): string {
  if (
    !url ||
    url.includes("loremflickr.com") ||
    url.includes("placeholder") ||
    url.includes("unsplash.com/photo-1546069901-ba9599a7e63c") ||
    url.includes("unsplash.com/photo-1518495973542-4542c06a5843")
  ) {
    const normalizedKey = seedKey.toLowerCase();
    
    let foundKey = "";
    for (const key of Object.keys(KEYWORD_MAP)) {
      if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
        foundKey = key;
        break;
      }
    }
    
    const ids = foundKey ? KEYWORD_MAP[foundKey] : ["photo-1560806887-1e4cd0b6cbd6"];
    const id = ids[index % ids.length];
    return `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;
  }
  return url;
}

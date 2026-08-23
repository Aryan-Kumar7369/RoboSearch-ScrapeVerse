export function mergeScrapedResults(existingComponents, scrapedRecords) {
  if (!scrapedRecords || scrapedRecords.length === 0) return existingComponents;

  const vendorNameMap = {
    "robu": "Robu.in",
    "flyrobo": "Flyrobo",
    "electronicscomp": "ElectronicsComp",
    "amazon": "Amazon India"
  };

  return existingComponents.map(component => {
    // Find records that match this product
    const matchingRecords = scrapedRecords.filter(rec => 
      rec.keyword && (
        component.id.includes(rec.keyword.toLowerCase()) ||
        component.name.toLowerCase().includes(rec.keyword.toLowerCase())
      )
    );

    if (matchingRecords.length === 0) return component;

    const updatedVendors = component.vendors.map(vendor => {
      const match = matchingRecords.find(r => vendorNameMap[r.site] === vendor.name);
      if (match && match.price > 0) {
        return {
          ...vendor,
          price: match.price,
          in_stock: match.inStock !== undefined ? match.inStock : vendor.in_stock,
          shipping_fee: match.shipping_fee !== undefined ? match.shipping_fee : vendor.shipping_fee,
          delivery_days: match.delivery_days || vendor.delivery_days,
          url: match.url || vendor.url
        };
      }
      return vendor;
    });

    return { ...component, vendors: updatedVendors };
  });
}
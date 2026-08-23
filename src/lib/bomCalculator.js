/**
 * Computes Split vs Single-Store BOM scenarios and potential shipping/part savings
 */
export function calculateBOMOptimization(selectedIds, allComponents) {
  if (!selectedIds || selectedIds.length === 0 || !allComponents) return null;

  const selectedItems = allComponents.filter(c => selectedIds.includes(c.id));
  if (selectedItems.length === 0) return null;

  // 1. Split Strategy: Cheapest in-stock vendor per item
  let splitItemsCost = 0;
  const splitVendorsUsed = new Set();
  const splitBreakdown = [];

  selectedItems.forEach(item => {
    const available = item.vendors.filter(v => v.in_stock);
    if (available.length > 0) {
      const best = available.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));
      splitItemsCost += best.price;
      splitVendorsUsed.add(best.name);
      splitBreakdown.push({ itemId: item.id, itemName: item.name, vendor: best });
    }
  });

  // Calculate unique shipping fees for split orders
  let splitShippingCost = 0;
  splitVendorsUsed.forEach(vName => {
    const vendorInfo = selectedItems.flatMap(i => i.vendors).find(v => v.name === vName);
    splitShippingCost += vendorInfo ? vendorInfo.shipping_fee : 0;
  });

  const totalSplitCost = splitItemsCost + splitShippingCost;

  // 2. Consolidated Strategy: Vendors with all items in stock
  const allVendorNames = ["Robu.in", "Flyrobo", "ElectronicsComp", "Amazon India"];
  const consolidatedOptions = [];

  allVendorNames.forEach(vName => {
    let hasAll = true;
    let itemsTotal = 0;
    let shippingFee = 0;

    for (const item of selectedItems) {
      const vData = item.vendors.find(v => v.name === vName);
      if (!vData || !vData.in_stock) {
        hasAll = false;
        break;
      }
      itemsTotal += vData.price;
      shippingFee = vData.shipping_fee;
    }

    if (hasAll) {
      consolidatedOptions.push({
        vendorName: vName,
        totalCost: itemsTotal + shippingFee,
        itemsTotal,
        shippingFee
      });
    }
  });

  const bestConsolidated = consolidatedOptions.length > 0
    ? consolidatedOptions.reduce((prev, curr) => (curr.totalCost < prev.totalCost ? curr : prev))
    : null;

  const savings = bestConsolidated ? Math.max(0, bestConsolidated.totalCost - totalSplitCost) : 0;

  return {
    split: {
      total: totalSplitCost,
      itemsCost: splitItemsCost,
      shipping: splitShippingCost,
      breakdown: splitBreakdown,
      uniqueVendorsCount: splitVendorsUsed.size
    },
    consolidated: bestConsolidated,
    savings,
    hasCompleteConsolidatedOption: !!bestConsolidated
  };
}

/**
 * Merges scraped records into the local catalog state
 */
export function mergeScrapedResults(existingComponents, scrapedRecords) {
  if (!scrapedRecords || !Array.isArray(scrapedRecords) || scrapedRecords.length === 0) {
    return existingComponents;
  }

  const siteMap = {
    'robu': 'Robu.in',
    'robu.in': 'Robu.in',
    'flyrobo': 'Flyrobo',
    'flyrobo.in': 'Flyrobo',
    'electronicscomp': 'ElectronicsComp',
    'amazon': 'Amazon India',
    'amazon.in': 'Amazon India'
  };

  return existingComponents.map(component => {
    // Check if the scraped records match this component
    const relevantRecords = scrapedRecords.filter(rec => {
      const keyword = (rec.keyword || '').toLowerCase();
      const compId = component.id.toLowerCase();
      const compName = component.name.toLowerCase();
      return compId.includes(keyword) || compName.includes(keyword) || keyword.includes('esp32');
    });

    if (relevantRecords.length === 0) return component;

    const updatedVendors = component.vendors.map(vendor => {
      const match = relevantRecords.find(r => {
        const siteKey = (r.site || '').toLowerCase();
        return siteMap[siteKey] === vendor.name || vendor.name.toLowerCase().includes(siteKey);
      });

      if (match && Number(match.price) > 0) {
        return {
          ...vendor,
          price: Number(match.price),
          in_stock: match.inStock !== undefined ? Boolean(match.inStock) : vendor.in_stock,
          shipping_fee: match.shipping_fee !== undefined ? Number(match.shipping_fee) : vendor.shipping_fee,
          delivery_days: match.delivery_days || vendor.delivery_days,
          url: match.url || vendor.url
        };
      }
      return vendor;
    });

    return {
      ...component,
      vendors: updatedVendors
    };
  });
}